import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { GoX } from "react-icons/go";

import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TodoListTask from "./TodoListTask";

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

  const [tasks, setTasks] = useState<{ id: number; content: string }[]>([]);
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addToList = () => {
    if (inputRef.current) {
      const value = inputRef.current.value.trim();
      if (value !== "") {
        const newId = tasks.length === 0 ? 1 : tasks[tasks.length - 1].id + 1;
        const newTask = { id: newId, content: value };
        setTasks([...tasks, newTask]);
        inputRef.current.value = "";
      }
    }
  };
  const removeFromList = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getTaskPosition = (id: number) => {
    return tasks.findIndex((task) => task.id === id);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    setTasks((prevTasks) => {
      const originalPos = getTaskPosition(activeId);
      const newPos = getTaskPosition(overId);
      return arrayMove(prevTasks, originalPos, newPos);
    });
  };

  useEffect(() => {
    // get tasks from localStorage
    setTasks(JSON.parse(localStorage.getItem("tasks") || "[]"));

    // update circle position
    updateCirclePosition();

    window.addEventListener("resize", updateCirclePosition);
    return () => {
      window.removeEventListener("resize", updateCirclePosition);
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // preventing instant override when DOM loads
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }, 500);

    return () => clearTimeout(timeout);
  }, [tasks]);

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
          {tasks.length > 0 ? (
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
              <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                  <div>
                    <TodoListTask
                      id={task.id}
                      key={task.id}
                      content={task.content}
                      removeFromList={removeFromList}
                    />
                  </div>
                ))}
              </SortableContext>
            </DndContext>
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
            onFocus={() => {
              if (!canBeDragged) setIsActive(true);
            }}
            onBlur={() => {
              if (!canBeDragged) setIsActive(false);
            }}
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
