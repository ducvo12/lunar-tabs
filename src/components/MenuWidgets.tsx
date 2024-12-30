const MenuWidgets = () => {
  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex flex-col justify-between w-full h-36 bg-neutral-900/90 rounded-lg p-5 text-2xl">
        Custom Message
        <div className="w-full h-8 bg-neutral-800/50 rounded-lg text-xl text-center">Add</div>
      </div>

      <div className="flex flex-col justify-between w-full h-36 bg-neutral-900/90 rounded-lg p-5 text-2xl">
        Search Bar
        <div className="w-full h-8 bg-neutral-800/50 rounded-lg text-xl text-center">Add</div>
      </div>
    </main>
  );
};

export default MenuWidgets;
