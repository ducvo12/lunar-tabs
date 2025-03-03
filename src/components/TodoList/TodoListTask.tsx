import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { RiDraggable } from "react-icons/ri";

interface TodoListTaskProps {
  id: number;
  content: string;
  removeFromList: (id: number) => void;
}

const TodoListTask = ({ id, content, removeFromList }: TodoListTaskProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const [isMouseDown, setIsMouseDown] = useState(false);
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) setIsMouseDown(true);
    };
    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) setIsMouseDown(false);
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform)
  };

  return (
    <div
      className={`group/item flex flex-row rounded-md text-white
      ${isMouseDown ? "" : "hover:bg-neutral-900/60"}`}
    >
      <FaCheck
        className={`text-xl mt-1 ml-1 opacity-0
          ${isMouseDown ? "" : "group-hover/item:opacity-100"}`}
        onClick={() => removeFromList(id)}
      ></FaCheck>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="group/item flex flex-row items-center h-7 w-full"
      >
        <div className="text-lg ml-1">{content}</div>
      </div>
      <div
        className={`flex items-center justify-center opacity-0
          ${isMouseDown ? "" : "group-hover/item:opacity-100"}`}
      >
        <RiDraggable className="text-2xl" />
      </div>
    </div>
  );
};

export default TodoListTask;
