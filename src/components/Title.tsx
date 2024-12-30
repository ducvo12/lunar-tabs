import Draggable from "react-draggable";

interface TitleProps {
  x: number;
  y: number;
  canBeDragged: boolean;
  id?: string;
  removeFunc?: (id: string) => void;
}

const Title = ({ x, y, canBeDragged }: TitleProps) => {
  return (
    <Draggable defaultPosition={{ x: x - 125, y: y - 35 }} bounds="parent" disabled={!canBeDragged}>
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
