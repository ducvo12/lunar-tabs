import { FaRegSquarePlus } from "react-icons/fa6";

const MenuWallpaper = () => {
  return (
    <div
      className="w-full h-full
        grid grid-cols-2 gap-3"
    >
      <div className="w-full h-full bg-neutral-900 p-2 pl-3 rounded-lg">
        <div className="flex flex-row justify-between items-center">
          <div className="text-xl">Wallpapers</div>
          <FaRegSquarePlus className="text-2xl mx-1" />
        </div>
      </div>

      <div className="w-full h-full bg-neutral-900 p-2 pl-3 rounded-lg">
        <div className="flex flex-col justify-center">
          <div className="text-xl">Settings</div>
        </div>
      </div>
    </div>
  );
};

export default MenuWallpaper;
