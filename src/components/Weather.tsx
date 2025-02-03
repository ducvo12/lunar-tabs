import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

// icons
import { FaRegSun } from "react-icons/fa";
import { FaRegMoon } from "react-icons/fa";
import { FaTemperatureHigh } from "react-icons/fa";
import { FaDroplet } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import { FaRegCompass } from "react-icons/fa";
import { FaCloud } from "react-icons/fa";
import { FaCloudShowersHeavy } from "react-icons/fa";
const formatTime12Hour = (isoTime: string): string => {
  const date = new Date(isoTime);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 (midnight) and 12 (noon) correctly
  return `${hours}:${minutes} ${ampm}`;
};

interface WeatherProps {
  x: number;
  y: number;
  canBeDragged: boolean;
  id: string;
  removeFunc: (id: string) => void;
  updateFunc: (id: string, x: number, y: number) => void;
}

const Weather = ({ x, y, canBeDragged, id, removeFunc, updateFunc }: WeatherProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [circlePosition, setCirclePosition] = useState({ top: false, left: false });

  const [isDayTime, setIsDaytime] = useState<string>("Loading...");
  const [temperature, setTemperature] = useState<string>("Loading...");
  const [humidity, setHumidity] = useState<string>("Loading...");
  const [windSpeed, setWindSpeed] = useState<string>("Loading...");
  const [windDirection, setWindDirection] = useState<string>("Loading...");
  const [precipitation, setPrecipitation] = useState<string>("Loading...");
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const lat = 42.18979;
      const lon = -87.90838;
      const pointResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`, {
        headers: { "User-Agent": "MyWeatherApp (myemail@example.com)" }
      });
      if (!pointResponse.ok) throw new Error("Failed to fetch location data");
      const pointData = await pointResponse.json();
      const { gridId, gridX, gridY } = pointData.properties;
      const weatherResponse = await fetch(
        `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast/hourly`,
        { headers: { "User-Agent": "MyWeatherApp (myemail@example.com)" } }
      );
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather data");
      const weatherData = await weatherResponse.json();
      const weatherPeriods = weatherData.properties.periods;

      // current weather data
      {
        const currentWeather = weatherPeriods[0];

        // set isDaytime
        if (currentWeather.isDaytime) {
          setIsDaytime("Currently day");
        } else {
          setIsDaytime("Currently night");
        }

        // set other weather data
        setTemperature(currentWeather.temperature);
        setHumidity(currentWeather.relativeHumidity.value);
        setWindSpeed(currentWeather.windSpeed);
        setWindDirection(currentWeather.windDirection);
      }

      // precipitation data
      {
        const today = new Date().toISOString().split("T")[0];
        const todayWeather = weatherPeriods.filter((period: { startTime: string }) => {
          return period.startTime.startsWith(today);
        });
        const precipitationTerms =
          /(?=.*likely)\b(rain|snow|showers|drizzle|thunderstorms|precipitation)\b/i;
        const firstOccurrence = todayWeather.find((period: { shortForecast: string }) =>
          precipitationTerms.test(period.shortForecast)
        );
        if (firstOccurrence) {
          const time = formatTime12Hour(firstOccurrence.startTime);
          setPrecipitation(`${firstOccurrence.shortForecast} at ${time}`);
        } else {
          setPrecipitation("No precipitation");
        }
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <Draggable defaultPosition={{ x: 100, y: 100 }} bounds="parent" disabled={!canBeDragged}>
      <div
        className={`absolute group outline-none rounded-[1px]
          hover:outline hover:outline-2 hover:outline-white
          transition-[outline]
          z-1 hover:z-10`}
      >
        <div
          ref={divRef}
          className="flex items-center justify-between
            w-auto h-auto bg-neutral-900/90
            rounded-xl p-5 text-white text-[22px]"
        >
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <div>
              <p className="flex items-center justify-start gap-2">
                {isDayTime === "Currently Day" ? <FaRegSun /> : <FaRegMoon />}
                {isDayTime}
              </p>
              <p className="flex items-center justify-start gap-2">
                <FaTemperatureHigh />
                {temperature}°F
              </p>
              <p className="flex items-center justify-start gap-2">
                <FaDroplet />
                {humidity}% humidity
              </p>
              <p className="flex items-center justify-start gap-2">
                <FaWind />
                {windSpeed} winds
              </p>
              <p className="flex items-center justify-start gap-2">
                <FaRegCompass />
                {windDirection} winds
              </p>
              <p className="flex items-center justify-start gap-2">
                {precipitation === "No Precipitation" ? <FaCloud /> : <FaCloudShowersHeavy />}
                {precipitation}
              </p>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default Weather;
