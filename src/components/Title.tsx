import Draggable from "react-draggable";

interface TitleProps {
  x: number;
  y: number;
  id?: string;
  removeFunc?: (id: string) => void;
}

const Title = ({ x, y }: TitleProps) => {
  return (
    <Draggable defaultPosition={{ x: x - 125, y: y - 35 }} bounds="parent">
      <div
        className="absolute
          text-6xl text-text text-center"
      >
        Welcome
      </div>
    </Draggable>
  );
};

export default Title;
