import { useState } from "react";

const generateId = () => `id-${Date.now()}`;

const useTimeTextElement = () => {
  const [TimeTextElements, setTimeTextElements] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const addTimeTextElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newTimeTextElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setTimeTextElements([...TimeTextElements, newTimeTextElement]);
  };
  const removeTimeTextElement = (id: string) => {
    const newTimeTextElements = TimeTextElements.filter((element) => element.id !== id);
    setTimeTextElements(newTimeTextElements);
  };
  const updateTimeTextElementInfo = (id: string, x: number, y: number) => {
    setTimeTextElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  return {
    TimeTextElements,
    setTimeTextElements,
    addTimeTextElement,
    removeTimeTextElement,
    updateTimeTextElementInfo
  };
};

export default useTimeTextElement;
