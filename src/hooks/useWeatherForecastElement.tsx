import { useState } from "react";

const generateId = () => `id-${Date.now()}`;

const useWeatherForecastElement = () => {
  const [weatherForecastElements, setWeatherForecastElements] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const addWeatherForecastElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newWeatherForecastElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setWeatherForecastElements([...weatherForecastElements, newWeatherForecastElement]);
  };
  const removeWeatherForecastElement = (id: string) => {
    const newWeatherForecastElements = weatherForecastElements.filter(
      (element) => element.id !== id
    );
    setWeatherForecastElements(newWeatherForecastElements);
  };
  const updateWeatherForecastElementInfo = (id: string, x: number, y: number) => {
    setWeatherForecastElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  return {
    weatherForecastElements,
    setWeatherForecastElements,
    addWeatherForecastElement,
    removeWeatherForecastElement,
    updateWeatherForecastElementInfo
  };
};

export default useWeatherForecastElement;
