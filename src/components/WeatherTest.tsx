import { useEffect, useState } from "react";

const formatTime12Hour = (isoTime: string): string => {
  const date = new Date(isoTime);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 (midnight) and 12 (noon) correctly
  return `${hours}:${minutes} ${ampm}`;
};

const WeatherTest = () => {
  const [isDayTime, setIsDaytime] = useState<string>("Loading...");
  const [temperature, setTemperature] = useState<string>("Loading...");
  const [precipitationProbability, setPrecipitationProbability] = useState<string>("Loading...");
  const [dewpoint, setDewpoint] = useState<string>("Loading...");
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
        setIsDaytime(currentWeather.isDaytime);
        setTemperature(currentWeather.temperature);
        setPrecipitationProbability(currentWeather.probabilityOfPrecipitation.value + "%");
        setDewpoint(parseFloat(currentWeather.dewpoint).toFixed(2) + "°");
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
    <div className="text-white">
      <h1 className="text-white">Current Weather</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <p>{temperature}°F</p>
          <p>{precipitation}</p>
          <p>{windSpeed} Winds</p>
        </div>
      )}
    </div>
  );
};

export default WeatherTest;
