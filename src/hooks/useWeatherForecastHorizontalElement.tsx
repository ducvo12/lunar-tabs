import { useState } from "react";

const generateId = () => `id-${Date.now()}`;

const useWeatherForecastHorizontalElement = () => {
  const [weatherForecastHorizontalElements, setWeatherForecastHorizontalElements] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const addWeatherForecastHorizontalElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newWeatherForecastHorizontalElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setWeatherForecastHorizontalElements([
      ...weatherForecastHorizontalElements,
      newWeatherForecastHorizontalElement
    ]);
  };
  const removeWeatherForecastHorizontalElement = (id: string) => {
    const newWeatherForecastHorizontalElements = weatherForecastHorizontalElements.filter(
      (element) => element.id !== id
    );
    setWeatherForecastHorizontalElements(newWeatherForecastHorizontalElements);
  };
  const updateWeatherForecastHorizontalElementInfo = (id: string, x: number, y: number) => {
    setWeatherForecastHorizontalElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  return {
    weatherForecastHorizontalElements,
    setWeatherForecastHorizontalElements,
    addWeatherForecastHorizontalElement,
    removeWeatherForecastHorizontalElement,
    updateWeatherForecastHorizontalElementInfo
  };
};

export default useWeatherForecastHorizontalElement;
