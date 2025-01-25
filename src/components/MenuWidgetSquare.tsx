interface MenuWidgetSquareProps {
  title: string;
  func: () => void;
}

const MenuWidgetSquare = ({ title, func }: MenuWidgetSquareProps) => {
  return (
    <div className="flex flex-col justify-between w-full h-36 bg-neutral-900/90 rounded-lg p-5 text-2xl">
      {title}
      <button
        className="w-full h-8 bg-neutral-800/50 rounded-lg text-xl text-center"
        onClick={() => func()}
      >
        Add
      </button>
    </div>
  );
};

export default MenuWidgetSquare;
