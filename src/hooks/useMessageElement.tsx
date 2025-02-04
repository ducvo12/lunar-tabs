import { useState } from "react";

const generateId = () => `id-${Date.now()}`;

const useMessageElement = () => {
  const [messageElements, setMessageElements] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const addMessageElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newMessageElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setMessageElements([...messageElements, newMessageElement]);
  };
  const removeMessageElement = (id: string) => {
    const newMessageElements = messageElements.filter((element) => element.id !== id);
    setMessageElements(newMessageElements);
  };
  const updateMessageElementInfo = (id: string, x: number, y: number) => {
    setMessageElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  return {
    messageElements,
    setMessageElements,
    addMessageElement,
    removeMessageElement,
    updateMessageElementInfo
  };
};

export default useMessageElement;
