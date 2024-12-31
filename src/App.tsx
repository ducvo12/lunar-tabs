import { useEffect, useState } from "react";
import Message from "./components/Message";
import Searchbar from "./components/Searchbar";
import { GoGear } from "react-icons/go";
import Menu from "./components/Menu";
import { v4 as uuidv4 } from "uuid";

/*
things to add:
weather
time
calendar
stocks
news
twitter posts?
*/

function App() {
  const [theme] = useState("dark");
  document.documentElement.classList.add(theme);

  const [menuVisible, setMenuVisible] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const toggleMenu = () => {
    setEditMode(false);
    setMenuVisible(!menuVisible);
  };
  const toggleEditMode = () => {
    setMenuVisible(false);
    setEditMode(!editMode);
  };

  const [messageElements, setMessageElements] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const addMessageElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newMessageElement = {
      id: uuidv4(),
      x: x,
      y: y
    };
    setMessageElements([...messageElements, newMessageElement]);
  };

  const [searchbarElements, setSearchbarElements] = useState<
    { id: string; x: number; y: number }[]
  >([]);
  const addSearchbarElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newSearchbarElement = {
      id: uuidv4(),
      x: x,
      y: y
    };
    setSearchbarElements([...searchbarElements, newSearchbarElement]);
  };

  useEffect(() => {
    addMessageElement(window.innerWidth / 2, window.innerHeight / 2 - 30);
    addSearchbarElement(window.innerWidth / 2, window.innerHeight / 2 + 25);

    const handleMouseMove = (event: MouseEvent) => {
      console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-surface1 select-none font-quicksand overflow-hidden">
      <div className="hidden">
        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white"></div>
      </div>

      {messageElements.map((element) => (
        <Message key={element.id} x={element.x} y={element.y} canBeDragged={editMode} />
      ))}

      {searchbarElements.map((element) => (
        <Searchbar key={element.id} x={element.x} y={element.y} canBeDragged={editMode} />
      ))}

      <Menu visible={menuVisible} func={addMessageElement} />

      <div
        className="absolute bottom-3 right-3
          bg-neutral-800/50 hover:bg-black transition-colors
          rounded-full p-2 cursor-pointer"
        onClick={toggleMenu}
      >
        <GoGear className="text-white" style={{ fontSize: "40px" }} />
      </div>
      <div
        className="absolute bottom-3 right-[73px]
          bg-neutral-800/50 hover:bg-black transition-colors
          rounded-full p-2 cursor-pointer"
        onClick={toggleEditMode}
      >
        <GoGear className="text-white" style={{ fontSize: "40px" }} />
      </div>
    </div>
  );
}

export default App;
