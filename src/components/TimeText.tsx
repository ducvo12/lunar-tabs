import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import { GoX } from "react-icons/go";

const getFormattedTime = (): { time: string; date: string; weekday: string } => {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const date = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const weekday = now.toLocaleDateString("en-US", { weekday: "long" });

  return { time, date, weekday };
};
interface TimeTextProps {
  x: number;
  y: number;
  canBeDragged: boolean;
  id: string;
  removeFunc: (id: string) => void;
  updateFunc: (id: string, x: number, y: number) => void;
}

const TimeText = ({ x, y, canBeDragged, id, removeFunc, updateFunc }: TimeTextProps) => {
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

  const [timeData, setTimeData] = useState(getFormattedTime());

  useEffect(() => {
    updateCirclePosition();
    window.addEventListener("resize", updateCirclePosition);

    const interval = setInterval(() => {
      setTimeData(getFormattedTime());
    }, 1000);

    return () => {
      window.removeEventListener("resize", updateCirclePosition);
      clearInterval(interval);
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
        className={`absolute group rounded-[1px]
          text-6xl text-text text-center outline-none
          ${canBeDragged ? "hover:outline hover:outline-2 hover:outline-white" : ""}
          transition-[outline] shadow-xl
          z-1 hover:z-10`}
      >
        <div
          className="flex flex-col items-center justify-center
            bg-neutral-900/20 backdrop-blur-sm text-white text-center
            shadow-lg p-4 w-[250px] rounded-lg"
        >
          <h1 className="text-4xl">{timeData.time}</h1>
          <p className="text-xl text-white/70">{timeData.weekday}</p>
          <p className="text-lg text-white/50">{timeData.date}</p>
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
export default TimeText;
