import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { GoX } from "react-icons/go";

interface SearchbarProps {
  x: number;
  y: number;
  canBeDragged: boolean;
  id: string;
  removeFunc: (id: string) => void;
  updateFunc: (id: string, x: number, y: number) => void;
}

const Searchbar = ({ x, y, canBeDragged, id, removeFunc, updateFunc }: SearchbarProps) => {
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
        className={`absolute group outline-none rounded-[1px]
          ${canBeDragged ? "hover:outline hover:outline-2 hover:outline-white" : ""}
          transition-[outline]
          z-1 hover:z-10`}
      >
        <form action="https://www.google.com/search" method="GET">
          <input
            className="bg-surface2 border-none outline-none
              w-searchBar h-12 rounded-full
              indent-5 text-2xl text-text"
            name="q"
            type="text"
            placeholder="Search"
            autoComplete="off"
            readOnly={canBeDragged}
          />
        </form>
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

export default Searchbar;
