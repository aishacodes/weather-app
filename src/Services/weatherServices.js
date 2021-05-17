import Axios from "axios";
const apiKey = process.env.REACT_APP_API_KEY;

const getCurrentWeatherByCoord = (latitude, longitude) => {
  return Axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
  );
};

const getCurrentWeatherByCity = (city) => {
  return Axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  );
};

const getForecastWeatherbyCoord = (latitude, longitude) => {
  return Axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
  );
};
const getForecastWeatherbyCity = (city = "London") => {
  return Axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
  );
};
const weatherService = {
  getCurrentWeather,
  getForecastWeatherbyCity,
  getForecastWeatherbyCoord,
};
export default weatherService;
