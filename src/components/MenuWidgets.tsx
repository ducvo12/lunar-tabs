interface MenuWidgetsProps {
  addMessageFunc: () => void;
  addSearchbarFunc: () => void;
}

const MenuWidgets = ({ addMessageFunc, addSearchbarFunc }: MenuWidgetsProps) => {
  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="flex flex-col justify-between w-full h-36 bg-neutral-900/90 rounded-lg p-5 text-2xl">
        Custom Message
        <button
          className="w-full h-8 bg-neutral-800/50 rounded-lg text-xl text-center"
          onClick={() => addMessageFunc()}
        >
          Add
        </button>
      </div>

      <div className="flex flex-col justify-between w-full h-36 bg-neutral-900/90 rounded-lg p-5 text-2xl">
        Search Bar
        <button
          className="w-full h-8 bg-neutral-800/50 rounded-lg text-xl text-center"
          onClick={() => addSearchbarFunc()}
        >
          Add
        </button>
      </div>
    </main>
  );
};

export default MenuWidgets;
