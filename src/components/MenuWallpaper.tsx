const MenuWallpaper = () => {
  return (
    <div
      className="w-full h-full
        grid grid-cols-2 gap-3"
    >
      <div className="w-full h-full bg-neutral-900 p-2 pl-3 rounded-lg">
        <div className="text-xl mb-1">Wallpapers</div>
        <div className="grid grid-cols-2 gap-2">
          <input id="selectWallpaper" type="file" accept="image/*" className="hidden" />
          <label
            htmlFor="selectWallpaper"
            className="inline-block text-sm text-center
              w-full py-1
              text-gray-500 bg-blue-50 hover:bg-slate-200
              rounded cursor-pointer"
          >
            Select Wallpaper
          </label>
          <input id="saveWallpaper" type="file" accept="image/*" className="hidden" />
          <label
            htmlFor="saveWallpaper"
            className="inline-block text-sm text-center
              w-full py-1
              text-gray-500 bg-blue-50 hover:bg-slate-200
              rounded cursor-pointer"
          >
            Save Wallpaper
          </label>
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
