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
  const [isActive, setIsActive] = useState(false);

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
        <div className="">
          <form action="https://www.google.com/search" method="GET">
            <input
              className={`backdrop-blur-sm border-none outline-none
                w-[700px] h-10 indent-3 rounded-t-md transition-all
                text-2xl
                ${
                  isActive
                    ? "text-white placeholder:text-white bg-neutral-900/30"
                    : "text-white/50 placeholder:text-white/50 bg-neutral-900/10"
                }`}
              name="q"
              type="text"
              placeholder="Search"
              autoComplete="off"
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
              readOnly={canBeDragged}
            />
          </form>
          <div
            className={`translate-y-[1px] w-[700px] h-[1px] transition-all
              ${isActive ? "bg-white" : "bg-white/50"}`}
          ></div>
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

export default Searchbar;
