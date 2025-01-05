import { useState } from "react";
import MenuWidgets from "./MenuWidgets";

interface MenuProps {
  visible: boolean;
  restoreDefaultFunc: () => void;
  editWidgetsFunc: () => void;
  addMessageFunc: () => void;
  addSearchbarFunc: () => void;
}

const Menu = ({
  visible,
  restoreDefaultFunc,
  editWidgetsFunc,
  addMessageFunc,
  addSearchbarFunc
}: MenuProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Widgets", "Settings", "Wallpaper"];
  const tabContent = [
    <MenuWidgets addMessageFunc={addMessageFunc} addSearchbarFunc={addSearchbarFunc} />,
    <div>Content for Tab 2</div>,
    <div>Content for Tab 3</div>
  ];

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        bg-neutral-900/90 transition-all duration-300 text-text
        w-1/2 h-2/3 z-50 rounded-xl p-3
        flex flex-col
        ${visible ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      <div className="flex w-full justify-between items-center">
        <button onClick={restoreDefaultFunc}>Restore Default</button>
        <div className="grid grid-flow-col -translate-x-3 grid-cols-3 h-10 w-1/3">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`py-2 rounded-t-lg -mb-[1px]
                ${activeTab === index ? "bg-neutral-800/50" : "bg-neutral-900/90"}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button onClick={editWidgetsFunc}>Edit Widgets</button>
      </div>

      <div className="flex-grow p-4 bg-neutral-800/50 rounded-lg">{tabContent[activeTab]}</div>
    </div>
  );
};

export default Menu;
