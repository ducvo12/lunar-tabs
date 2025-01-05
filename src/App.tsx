import { useEffect, useState, useRef } from "react";
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
  const dataInitializedRef = useRef(false);

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
      x: x - 125,
      y: y - 35
    };
    setMessageElements([...messageElements, newMessageElement]);
  };
  const removeMessageElement = (id: string) => {
    const newMessageElements = messageElements.filter((element) => element.id !== id);
    setMessageElements(newMessageElements);
  };
  const updateMessageElementInfo = (id: string, x: number, y: number) => {
    setMessageElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
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
      x: x - 350,
      y: y - 25
    };
    setSearchbarElements([...searchbarElements, newSearchbarElement]);
  };
  const removeSearchbarElement = (id: string) => {
    const newSearchbarElement = searchbarElements.filter((element) => element.id !== id);
    setMessageElements(newSearchbarElement);
  };
  const updateSearchbarElementInfo = (id: string, x: number, y: number) => {
    setSearchbarElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  useEffect(() => {
    const savedMessageElements = localStorage.getItem("messageElements");
    const savedSearchbarElements = localStorage.getItem("searchbarElements");

    if (!savedMessageElements && !savedSearchbarElements) {
      addMessageElement(window.innerWidth / 2, window.innerHeight / 2 - 30);
      addSearchbarElement(window.innerWidth / 2, window.innerHeight / 2 + 25);
    } else {
      setMessageElements(JSON.parse(savedMessageElements || "[]"));
      setSearchbarElements(JSON.parse(savedSearchbarElements || "[]"));
    }
    // check this out later!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dataInitializedRef.current) {
      dataInitializedRef.current = true;
    } else {
      localStorage.setItem("messageElements", JSON.stringify(messageElements));
      localStorage.setItem("searchbarElements", JSON.stringify(searchbarElements));
    }
  }, [messageElements, searchbarElements]);

  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="w-screen h-screen bg-surface1 select-none font-quicksand overflow-hidden">
      <div className="hidden">
        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white"></div>
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white"></div>
      </div>

      {messageElements.map((element) => (
        <Message
          key={element.id}
          x={element.x}
          y={element.y}
          canBeDragged={editMode}
          id={element.id}
          removeFunc={removeMessageElement}
          updateFunc={updateMessageElementInfo}
        />
      ))}

      {searchbarElements.map((element) => (
        <Searchbar
          key={element.id}
          x={element.x}
          y={element.y}
          canBeDragged={editMode}
          id={element.id}
          removeFunc={removeSearchbarElement}
          updateFunc={updateSearchbarElementInfo}
        />
      ))}

      <Menu
        visible={menuVisible}
        restoreDefaultFunc={clearLocalStorage}
        editWidgetsFunc={toggleEditMode}
        addMessageFunc={addMessageElement}
        addSearchbarFunc={addSearchbarElement}
      />

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
      <div
        className="absolute bottom-3 right-[133px]
          bg-neutral-800/50 hover:bg-black transition-colors
          rounded-full p-2 cursor-pointer"
        onClick={clearLocalStorage}
      >
        <GoGear className="text-white" style={{ fontSize: "40px" }} />
      </div>
    </div>
  );
}

export default App;
