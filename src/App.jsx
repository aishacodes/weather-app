import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import Loader from "./Component/Loader";
import weatherServices from "./Services/weatherServices";

import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityData, setCityData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const successfulLookup = (position) => {
      const { latitude, longitude } = position.coords;
      //current weather
      weatherServices.getCurrentWeather(latitude, longitude).then((res) => {
        setCityData((prev) => [res.data]);
      });
      //forecast
      weatherServices
        .getForecastWeatherbyCoord(latitude, longitude)
        .then((res) => {
          console.log(res.data.city);
          const reading = res.data.list.filter((dt) =>
            dt.dt_txt.includes("18:00:00")
          );
          setCityData((we) =>
            we.concat(reading.filter((dat) => dat.dt !== we[0].dt))
          );
        });
    };

    const unSuccessful = () => {
      // current weather
      weatherServices.getCurrentWeather("London").then((res) => {
        console.log(res.data);
        setCityName(res.data.name);
        setCityData((prev) => [res.data]);
      });

      // // forecast;
      weatherServices.getForecastWeatherbyCity("London").then((res) => {
        console.log(res.data);
        const reading = res.data.list.filter((dt) =>
          dt.dt_txt.includes("18:00:00")
        );
        setCityData((we) =>
          we.concat(reading.filter((dat) => dat.dt !== we[0].dt))
        );
      });
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
    };

    window.navigator.geolocation.getCurrentPosition(
      successfulLookup,
      unSuccessful,
      options
    );
  }, []);

  useEffect(() => {
    //current
    weatherServices.getCurrentWeather(city).then((res) => {
      console.log(res.data);
      setCityData((prev) => [res.data]);
    });

    // // forecast;
    weatherServices.getForecastWeatherbyCity(city).then((res) => {
      console.log(res.data);
      const reading = res.data.list.filter((dt) =>
        dt.dt_txt.includes("18:00:00")
      );
      setCityData((we) =>
        we.concat(reading.filter((dat) => dat.dt !== we[0].dt))
      );
    });
  }, [city]);

  const state = {
    labels: cityData.map((t) => new Date(t.dt * 1000).toDateString("en-US")),
    datasets: [
      {
        label: "Temperature",
        backgroundColor: "#eef2ffff",
        borderColor: "#5a7df9ff",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#5a7df9ff",
        data: cityData.map((t) => t.main.temp),
      },
    ],
  };

  return (
    <div className="App grid grid-cols-3 h-screen w-screen overflow-hidden">
      <div className="w-full py-4 px-6">
        <p className="flex items-center">
          <span className="text-2xl font-extrabold">Your City</span>
          <form action="" onSubmit={(e) => setCity(e.target.searchInput.value)}>
            <input
              type="text"
              name="searchInput"
              placeholder="Enter your City"
              className="pr-6 pl-2 py-1 border border-gray-300 mx-6"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </p>
        <span className="pr-9 pl-2 py-1 mx-6">{cityName}</span>
        {cityData.length > 0 ? (
          <div className="p-6 mx-4">
            <p className="py-6">
              {new Date(cityData[activeIndex].dt * 1000).toLocaleTimeString(
                "en-US"
              )}
              ,{" "}
              {new Date(cityData[activeIndex].dt * 1000).toDateString("en-US")}
            </p>
            <div className="flex items-center">
              <img
                src={`http://openweathermap.org/img/wn/${cityData[activeIndex].weather[0].icon}@2x.png
`}
                className="w-32 h-32"
                alt=""
              />{" "}
              <p className="text-3xl font-bold pl-4">
                {cityData[activeIndex].main.temp} <sup>o</sup>F
              </p>
            </div>
            <p className="my-8 text-4xl font-extrabold">
              {" "}
              {cityData[activeIndex].weather[0].description}
            </p>
            <div className="flex justify-between">
              <p className="flex flex-col justify-center">
                <span className="text-2xl">Humidity</span>{" "}
                <span className="text-2xl font-extrabold pt-4">
                  {cityData[activeIndex].main.humidity}%
                </span>
              </p>
              <p className="flex flex-col justify-center">
                <span className="text-2xl"> Wind Speed </span>{" "}
                <span className="text-2xl font-extrabold pt-4">
                  {" "}
                  {cityData[activeIndex].wind.speed}km/j
                </span>
              </p>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
      <div className="col-span-2 w-full">
        <div className="h-1/2 w-full">
          <p>Temperature</p>
          <div className="w-full h-16">
            <Line
              height={100}
              data={state}
              options={{
                legend: {
                  display: false,
                },
                scales: {
                  xAxes: [
                    {
                      display: false,
                    },
                  ],
                  yAxes: [
                    {
                      display: false,
                    },
                  ],
                },
              }}
            />
          </div>
        </div>
        <div className="flex overflow-x-auto">
          {cityData.length ? (
            cityData.map((cityd, citydIndex) => (
              <div
                className={`p-6 mx-4 flex flex-col justify-center text-center items-center shadow-lg ${
                  citydIndex === activeIndex ? "bg-blue-300" : "bg-white"
                } `}
                onClick={() => setActiveIndex(citydIndex)}
              >
                <p>{new Date(cityd.dt * 1000).toDateString("en-US")}</p>
                <img
                  src={`http://openweathermap.org/img/wn/${cityd.weather[0].icon}@2x.png`}
                  alt=""
                />
                <p>
                  Humidity <br /> {cityd.main.humidity}%
                </p>
              </div>
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
