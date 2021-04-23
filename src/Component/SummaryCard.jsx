import React from "react";

function SummaryCard() {
  return (
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
  );
}

export default SummaryCard;
