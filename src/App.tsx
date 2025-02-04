import { useEffect, useState, useRef } from "react";
import Message from "./components/Message";
import Searchbar from "./components/Searchbar";
import { GoGear } from "react-icons/go";
import Menu from "./components/Menu";
import Weather from "./components/Weather";
import WeatherTest from "./components/WeatherTest";

/*
things to add:
wallpaper
time
calendar
stocks
news
twitter posts?
settings for each widget
*/
const generateId = () => `id-${Date.now()}`;

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
      id: generateId(),
      x: x,
      y: y
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
      id: generateId(),
      x: x,
      y: y
    };
    setSearchbarElements([...searchbarElements, newSearchbarElement]);
  };
  const removeSearchbarElement = (id: string) => {
    const newSearchbarElement = searchbarElements.filter((element) => element.id !== id);
    setSearchbarElements(newSearchbarElement);
  };
  const updateSearchbarElementInfo = (id: string, x: number, y: number) => {
    setSearchbarElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  const [weatherElements, setWeatherElements] = useState<{ id: string; x: number; y: number }[]>(
    []
  );
  const addWeatherElement = (
    x: number = window.innerWidth / 2,
    y: number = window.innerHeight / 2
  ) => {
    const newWeatherElement = {
      id: generateId(),
      x: x,
      y: y
    };
    setWeatherElements([...weatherElements, newWeatherElement]);
  };
  const removeWeatherElement = (id: string) => {
    const newWeatherElement = weatherElements.filter((element) => element.id !== id);
    setWeatherElements(newWeatherElement);
  };
  const updateWeatherElementInfo = (id: string, x: number, y: number) => {
    setWeatherElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, x: x, y: y } : element))
    );
  };

  useEffect(() => {
    addWeatherElement(window.innerWidth / 2, window.innerHeight / 2 + 80);

    const savedMessageElements = localStorage.getItem("messageElements");
    const savedSearchbarElements = localStorage.getItem("searchbarElements");
    const savedWeatherElements = localStorage.getItem("weatherElements");

    if (!savedMessageElements && !savedSearchbarElements) {
      // fresh load (no saved data)
      addMessageElement(window.innerWidth / 2, window.innerHeight / 2 - 30);
      addSearchbarElement(window.innerWidth / 2, window.innerHeight / 2 + 25);
    } else {
      // load saved data
      setMessageElements(JSON.parse(savedMessageElements || "[]"));
      setSearchbarElements(JSON.parse(savedSearchbarElements || "[]"));
      setWeatherElements(JSON.parse(savedWeatherElements || "[]"));
    }
    // check this out later!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // save data to local storage
    if (!dataInitializedRef.current) {
      // prevent saving data on first render
      dataInitializedRef.current = true;
    } else {
      // save data every time deps change
      localStorage.setItem("messageElements", JSON.stringify(messageElements));
      localStorage.setItem("searchbarElements", JSON.stringify(searchbarElements));
      localStorage.setItem("weatherElements", JSON.stringify(weatherElements));
    }
  }, [messageElements, searchbarElements, weatherElements]);

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
      {weatherElements.map((element) => (
        <Weather
          key={element.id}
          x={element.x}
          y={element.y}
          canBeDragged={editMode}
          id={element.id}
          removeFunc={removeWeatherElement}
          updateFunc={updateWeatherElementInfo}
        />
      ))}

      <Menu
        visible={menuVisible}
        restoreDefaultFunc={clearLocalStorage}
        editWidgetsFunc={toggleEditMode}
        addMessageFunc={addMessageElement}
        addSearchbarFunc={addSearchbarElement}
        addWeatherFunc={addWeatherElement}
      />

      <button
        className={`absolute bottom-3 right-3 z-20
          bg-neutral-800/50 hover:bg-black transition-all
          rounded-full p-2 cursor-pointer
          ${editMode ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
        onClick={toggleMenu}
        disabled={editMode}
      >
        <GoGear className="text-white" style={{ fontSize: "35px" }} />
      </button>
      <button
        className={`absolute bottom-3 right-3 z-20
          bg-neutral-800/50 hover:bg-black transition-all
          rounded-full p-2 pl-3 cursor-pointer
          text-white text-base
          ${!editMode ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}
        onClick={toggleEditMode}
        disabled={!editMode}
      >
        Save Widgets
      </button>
    </div>
  );
}

export default App;
