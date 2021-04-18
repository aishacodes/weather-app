import { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import { Line } from "react-chartjs-2";

function App() {
  const [city, setCity] = useState("Kenya");
  const [cityData, setCityData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [curW, setCurw] = useState([]);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const successfulLookup = (position) => {
      const { latitude, longitude } = position.coords;
      //current weather
      Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      ).then((res) => {
        setCity(() => cityData.concat(res.data));
      });

      Axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
      ).then((res) => {
        const reading = res.data.list.filter((dt) =>
          dt.dt_txt.includes("18:00:00")
        );
        setCityData(() => cityData.concat(reading));
        console.log(cityData);
      });
    };

    const unSuccessful = () => {
      // current weather

      Axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
      ).then((res) => {
        setCityData([res.data]);
      });
      console.log(cityData, "preev cittttyyyy");

      // forecast;
      Axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=London&units=imperial&appid=${apiKey}`
      ).then((res) => {
        console.log(res.data.city);
        const reading = res.data.list.filter((dt) =>
          dt.dt_txt.includes("18:00:00")
        );
        setCityData((we) =>
          we.concat(reading.filter((dat) => dat.dt !== we[0].dt))
        );
      });
      console.log("unsiihhhh", cityData);
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    window.navigator.geolocation.getCurrentPosition(
      successfulLookup,
      unSuccessful,
      options
    );
  }, []);

  useEffect(() => {
    Axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    ).then((res) => {
      setCityData([res.data]);
    });
    console.log(cityData, "preev cittttyyyy");

    // forecast;
    Axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=London&units=imperial&appid=${apiKey}`
    ).then((res) => {
      console.log(res.data.city);
      const reading = res.data.list.filter((dt) =>
        dt.dt_txt.includes("18:00:00")
      );
      setCityData((we) => we.concat(reading));
      console.log("unsiihhhh", cityData);
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
    <div className="App grid grid-cols-3 ">
      <div className="w-full py-4 px-6">
        <p className="flex items-center">
          <span className="text-2xl font-extrabold">Your City</span>
          <input
            type="text"
            name=""
            placeholder={city}
            className="pr-6 pl-2 py-1 border border-gray-300 mx-6"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {/* <span className="pr-9 pl-2 py-1 border border-gray-300 mx-6">
            {city}
          </span> */}
        </p>

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
          "Loading...."
        )}
      </div>
      <div className="col-span-2 grid grid-rows-2 ">
        <div className="h-1/2">
          <p>Temperature</p>
          <Line
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
        <div className="flex">
          {cityData.map((cityd, citydIndex) => (
            <div
              className={`p-6 mx-4 flex flex-col justify-center text-center items-center ${
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
