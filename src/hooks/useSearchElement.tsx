import { useState } from "react";

const generateId = () => `id-${Date.now()}`;

const useSearchElement = () => {
  const [searchbarElements, setSearchbarElements] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const addSearchbarElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newSearchbarElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setSearchbarElements([...searchbarElements, newSearchbarElement]);
  };
  const removeSearchbarElement = (id: string) => {
    const newSearchbarElement = searchbarElements.filter((element) => element.id !== id);
    setSearchbarElements(newSearchbarElement);
  };
  const updateSearchbarElementInfo = (id: string, x: number, y: number) => {
    setSearchbarElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  return {
    searchbarElements,
    setSearchbarElements,
    addSearchbarElement,
    removeSearchbarElement,
    updateSearchbarElementInfo
  };
};

export default useSearchElement;
