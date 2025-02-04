import { useState } from "react";

const generateId = () => `id-${Date.now()}`;

const useWeatherElement = () => {
  const [weatherElements, setWeatherElements] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const addWeatherElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newWeatherElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setWeatherElements([...weatherElements, newWeatherElement]);
  };
  const removeWeatherElement = (id: string) => {
    const newWeatherElement = weatherElements.filter((element) => element.id !== id);
    setWeatherElements(newWeatherElement);
  };
  const updateWeatherElementInfo = (id: string, x: number, y: number) => {
    setWeatherElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  return {
    weatherElements,
    setWeatherElements,
    addWeatherElement,
    removeWeatherElement,
    updateWeatherElementInfo
  };
};

export default useWeatherElement;
