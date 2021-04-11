import { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("Ilorin");
  const [cityData, setCityData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      const successfulLookup = (position) => {
        const { latitude, longitude } = position.coords;
        Axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
        ).then((res) => {
          // console.log(res.data.list);
          const reading = res.data.list.filter((dt) =>
            dt.dt_txt.includes("18:00:00")
          );
          console.log(reading);
          setCityData(reading);
        });
      };
      window.navigator.geolocation.getCurrentPosition(
        successfulLookup,
        console.log
      );
    } else {
      Axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
      ).then((res) => {
        // console.log(res.data.list);
        const reading = res.data.list.filter((dt) =>
          dt.dt_txt.includes("18:00:00")
        );
        console.log(reading);
        setCityData(reading);
      });
    }
  }, []);

  return (
    <div className="App grid grid-cols-3 ">
      <div className="w-full py-4 px-6">
        <p className="flex items-center">
          <span className="text-2xl font-extrabold">Your City</span>
          <span className="pr-9 pl-2 py-1 border border-gray-300 mx-6">
            {city}
          </span>
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
                src={`http://openweathermap.org/img/w/${cityData[activeIndex].weather[0].icon}.png
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
      <div className="col-span-2 grid grid-rows-3 ">
        <div className="row-span-2">
          <p>Temperature</p>
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
                src={`http://openweathermap.org/img/w/${cityd.weather[0].icon}.png
`}
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
