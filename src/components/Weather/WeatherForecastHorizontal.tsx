import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { GoX } from "react-icons/go";

interface WeatherForecastProps {
  x: number;
  y: number;
  canBeDragged: boolean;
  id: string;
  removeFunc: (id: string) => void;
  updateFunc: (id: string, x: number, y: number) => void;
}

const WeatherForecastHorizontal = ({
  x,
  y,
  canBeDragged,
  id,
  removeFunc,
  updateFunc
}: WeatherForecastProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [circlePosition, setCirclePosition] = useState({ top: false, left: false });
  const updateCirclePosition = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;

      setCirclePosition({
        top: rect.top + rect.height / 2 < screenCenterY,
        left: rect.left + rect.width / 2 < screenCenterX
      });
    }
  };
  const handleStop = (data: { x: number; y: number }) => {
    updateCirclePosition();
    updateFunc(id, data.x, data.y);
  };

  const [forecast, setForecast] = useState<{ day: string; high: number; low: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const lat = 42.18979;
  const lon = -87.90838;

  const fetchWeather = async () => {
    try {
      // Step 1: Get the gridpoint info
      const gridResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
      const gridData = await gridResponse.json();

      if (!gridData?.properties) {
        throw new Error("Invalid grid data");
      }

      const { gridId, gridX, gridY } = gridData.properties;

      // Step 2: Fetch the 7-day forecast using the grid ID and coordinates
      const forecastResponse = await fetch(
        `https://api.weather.gov/gridpoints/${gridId}/${gridX},${gridY}/forecast`
      );
      const forecastData = await forecastResponse.json();

      if (forecastData?.properties?.periods) {
        const dailyForecast = forecastData.properties.periods;

        const forecastArray = [];
        for (let i = 1; i < dailyForecast.length; i += 2) {
          if (i + 1 < dailyForecast.length) {
            forecastArray.push({
              day: dailyForecast[i].name, // "Monday", "Tuesday", etc.
              high: dailyForecast[i].temperature, // High temperature
              low: dailyForecast[i + 1].temperature // Low temperature (night)
            });
          }
        }
        setForecast(forecastArray);
        // console.log(forecastArray);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateCirclePosition();
    fetchWeather();

    window.addEventListener("resize", updateCirclePosition);
    return () => {
      window.removeEventListener("resize", updateCirclePosition);
    };

    // check this out later!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Draggable
      defaultPosition={{ x: x, y: y }}
      bounds="parent"
      disabled={!canBeDragged}
      onDrag={updateCirclePosition}
      onStop={(_, data) => handleStop(data)}
    >
      {/*
    <Draggable
      defaultPosition={{ x: x, y: y }}
      bounds="parent"
      disabled={!canBeDragged}
      onDrag={updateCirclePosition}
      onStop={(_, data) => handleStop(data)}
    >
      <div
        ref={divRef}
        className={`absolute group rounded-[1px]
          text-6xl text-text text-center outline-none
          ${canBeDragged ? "hover:outline hover:outline-2 hover:outline-white" : ""}
          transition-[outline] shadow-xl
          z-1 hover:z-10`}
      >
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">7-Day Weather Forecast (New York)</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-3">
              {forecast.map(({ day, high, low }, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-gray-700 p-3 rounded-md text-sm"
                >
                  <span className="font-medium">{day}</span>
                  <span>
                    <span className="text-yellow-300">{high}°</span> /{" "}
                    <span className="text-blue-300">{low}°</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div hidden={!canBeDragged}>
          <GoX
            onClick={() => removeFunc(id)}
            className={`absolute text-xl rounded-full
              bg-white text-black
              opacity-0 group-hover:opacity-100 transition-opacity
              ${circlePosition.top ? "-bottom-3" : "-top-3"}
              ${circlePosition.left ? "-right-3" : "-left-3"}`}
          ></GoX>
        </div>
      </div>
    </Draggable>
    */}
      <div
        ref={divRef}
        className={`absolute group rounded-[1px]
          text-6xl text-text text-center outline-none
          ${canBeDragged ? "hover:outline hover:outline-2 hover:outline-white" : ""}
          transition-[outline] shadow-xl
          z-1 hover:z-10`}
      >
        <div
          className="flex flex-col items-center justify-center
            bg-neutral-900/30 backdrop-blur-sm text-white text-center
            shadow-lg p-2 rounded-lg"
        >
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-row gap-1">
              {forecast.map(({ day, high, low }, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center bg-neutral-900/20 p-2 rounded-md text-sm"
                >
                  <span className="font-medium">{day.slice(0, 3)}</span>
                  <span className="text-lg">
                    <span className="text-yellow-300">{high}° </span>/
                    <span className="text-blue-300"> {low}°</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div hidden={!canBeDragged}>
          <GoX
            onClick={() => removeFunc(id)}
            className={`absolute text-xl rounded-full
                  bg-white text-black
                  opacity-0 group-hover:opacity-100 transition-opacity
                  ${circlePosition.top ? "-bottom-3" : "-top-3"}
                  ${circlePosition.left ? "-right-3" : "-left-3"}`}
          ></GoX>
        </div>
      </div>
    </Draggable>
  );
};
export default WeatherForecastHorizontal;
