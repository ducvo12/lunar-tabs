import { useState } from "react";

const generateId = () => `id-${Date.now()}`;

const useTodoListElement = () => {
  const [todoListElements, setTodoListElements] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const addTodoListElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newTodoListElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setTodoListElements([...todoListElements, newTodoListElement]);
  };
  const removeTodoListElement = (id: string) => {
    const newTodoListElements = todoListElements.filter((element) => element.id !== id);
    setTodoListElements(newTodoListElements);
  };
  const updateTodoListElementInfo = (id: string, x: number, y: number) => {
    setTodoListElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  return {
    todoListElements,
    setTodoListElements,
    addTodoListElement,
    removeTodoListElement,
    updateTodoListElementInfo
  };
};

export default useTodoListElement;
