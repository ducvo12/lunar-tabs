import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { FaCloudRain } from "react-icons/fa";
import { FaWind } from "react-icons/fa";
import { FaCloudSun } from "react-icons/fa";

type CurrentWeatherData = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
};

const formatTime12Hour = (isoTime: string): string => {
  const date = new Date(isoTime);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 (midnight) and 12 (noon) correctly
  return `${hours}:${minutes} ${ampm}`;
};

const Weather = () => {
  const [weather, setWeather] = useState<CurrentWeatherData | null>(null);
  const [rainStartTime, setRainStartTime] = useState<string | null>(null);

  const fetchWeather = async () => {
    const latitude = 42.18979;
    const longitude = -87.90838;

    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit&wind_speed_unit=mph&models=gfs_seamless`;

    const currentDate = new Date().toISOString().split("T")[0];
    const rainApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=precipitation&timezone=auto&start_date=${currentDate}&end_date=${currentDate}&models=gfs_seamless`;

    try {
      const weatherResponse = await fetch(weatherApiUrl);
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const weatherData = await weatherResponse.json();
      setWeather(weatherData.current_weather);

      const rainResponse = await fetch(rainApiUrl);
      if (!rainResponse.ok) {
        throw new Error("Failed to fetch rain data");
      }
      const rainData = await rainResponse.json();
      const { time, precipitation } = rainData.hourly;
      const firstRainIndex = precipitation.findIndex((value: number) => value > 0);

      if (firstRainIndex !== -1) {
        setRainStartTime(formatTime12Hour(time[firstRainIndex]));
      } else {
        setRainStartTime("No Rain");
      }
    } catch (err: unknown) {
      throw new Error(err as string);
    }
  };

  const getWeatherDescription = (code: number): string => {
    const weatherCodes: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail"
    };
    return weatherCodes[code] || "Unknown";
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <Draggable defaultPosition={{ x: 100, y: 100 }}>
      <div
        className={`absolute group outline-none rounded-[1px]
          hover:outline hover:outline-2 hover:outline-white
          transition-[outline]
          z-1 hover:z-10`}
      >
        <div
          className="flex items-center justify-between
          w-96 h-24 bg-neutral-900/90
          rounded-xl p-5 text-white text-[22px]"
        >
          {weather ? (
            <div className="">
              <p>{weather.temperature}°F</p>
              <p className="flex items-center justify-end gap-1">
                {weather.windspeed} Mph <FaWind />
              </p>
            </div>
          ) : (
            <div className="">Loading...</div>
          )}
          {weather ? (
            <div className="w-52 text-right">
              <p>{getWeatherDescription(weather.weathercode)}</p>
              <p className="flex items-center justify-end gap-1">
                {rainStartTime === "No Rain" ? <FaCloudSun /> : <FaCloudRain />}
                {rainStartTime}
              </p>
            </div>
          ) : (
            <div className="">Loading...</div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Weather;
