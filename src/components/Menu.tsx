interface MenuProps {
  visible: boolean;
}

const Menu = ({ visible }: MenuProps) => {
  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-neutral-900/90 transition-all duration-300
        w-1/2 h-1/2 z-50 rounded-xl
        ${visible ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="text-white">Menu</div>
    </div>
  );
};

export default Menu;
