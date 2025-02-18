import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { GoX } from "react-icons/go";
import { FaCheck } from "react-icons/fa6";

interface TodoListProps {
  x: number;
  y: number;
  canBeDragged: boolean;
  id: string;
  removeFunc: (id: string) => void;
  updateFunc: (id: string, x: number, y: number) => void;
}

const TodoList = ({ x, y, canBeDragged, id, removeFunc, updateFunc }: TodoListProps) => {
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

  const [todoItems, setTodoItems] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addToList = () => {
    if (inputRef.current) {
      const value = inputRef.current.value.trim();
      if (value !== "") {
        setTodoItems([...todoItems, value]);
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    updateCirclePosition();
    window.addEventListener("resize", updateCirclePosition);
    return () => {
      window.removeEventListener("resize", updateCirclePosition);
    };
  }, []);

  return (
    <Draggable
      defaultPosition={{ x: x, y: y }}
      bounds="parent"
      disabled={!canBeDragged}
      onDrag={updateCirclePosition}
      onStop={(_, data) => handleStop(data)}
    >
      <div
        ref={divRef}
        className={`absolute group rounded-lg outline-none text-white
          ${canBeDragged ? "hover:outline hover:outline-2 hover:outline-white" : ""}
          transition-[outline] bg-neutral-900/30 shadow-xl w-[300px] p-1 px-[10px]
          z-1 hover:z-10`}
      >
        <div className="text-2xl">Tasks:</div>
        <div className="text-lg mb-2">
          {todoItems.length > 0 ? (
            todoItems.map((item, index) => (
              <li
                key={index}
                onClick={() => setTodoItems(todoItems.filter((_, i) => i !== index))}
                className="group/item flex flex-row items-center gap-2
                    rounded-md hover:bg-neutral-900/60"
              >
                <FaCheck className="ml-1 -mr-1 opacity-0 group-hover/item:opacity-100" />
                <div className="text-lg">{item}</div>
              </li>
            ))
          ) : (
            <span className="ml-6">All Done!</span>
          )}
        </div>
        <div className="flex flex-row items-center mb-2">
          <input
            ref={inputRef}
            className={`outline outline-1 outline-white
            backdrop-blur-sm border-none outline-none
            w-full h-6 indent-1 rounded-md transition-all
            text-md mx-1
            ${
              isActive
                ? "text-white placeholder:text-white bg-neutral-900/30"
                : "text-white/50 placeholder:text-white/50 bg-neutral-900/10"
            }`}
            type="text"
            placeholder="Add New (Press Enter)"
            autoComplete="off"
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onKeyDown={(e) => e.key === "Enter" && addToList()}
            readOnly={canBeDragged}
          />
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
export default TodoList;
