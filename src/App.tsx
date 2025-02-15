import { useEffect, useState, useRef } from "react";

import { GoGear } from "react-icons/go";
import Menu from "./components/Menu";

import Message from "./components/Message";
import Searchbar from "./components/Searchbar";
import Weather from "./components/Weather";

import useMessageElement from "./hooks/useMessageElement";
import useSearchElement from "./hooks/useSearchElement";
import useWeatherElement from "./hooks/useWeatherElement";

// import bg from "./assets/wp3.jpg";

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

const DB_NAME = "WallpaperDB";
const DB_VERSION = 1;
const STORE_NAME = "wallpapers";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject("Error opening database");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}
function loadWallpaperFromIndexedDB(index: number): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    openDB()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get("wallpaperCollection");

        request.onsuccess = () => {
          if (request.result && request.result.wallpapers.length > 0) {
            resolve(request.result.wallpapers[index]);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => reject("Error loading image");
      })
      .catch(reject);
  });
}

function App() {
  const dataInitializedRef = useRef(false);

  const [theme] = useState("dark");
  document.documentElement.classList.add(theme);

  const [wallpaperIndex, setWallpaperIndex] = useState(-1);
  const [wallpaperURL, setWallpaperURL] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

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

  const {
    messageElements,
    setMessageElements,
    addMessageElement,
    removeMessageElement,
    updateMessageElementInfo
  } = useMessageElement();
  const {
    searchbarElements,
    setSearchbarElements,
    addSearchbarElement,
    removeSearchbarElement,
    updateSearchbarElementInfo
  } = useSearchElement();
  const {
    weatherElements,
    setWeatherElements,
    addWeatherElement,
    removeWeatherElement,
    updateWeatherElementInfo
  } = useWeatherElement();

  const setWallpaper = async (index: number) => {
    try {
      const wallpaper = await loadWallpaperFromIndexedDB(index);
      if (wallpaper) {
        setWallpaperURL(URL.createObjectURL(wallpaper));

        setIsVideo(wallpaper.type.split("/")[0] === "video");
      } else {
        setWallpaperURL(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const setIndex = () => {
      const newIndex = localStorage.getItem("curWallpaperIndex");
      if (newIndex && parseInt(newIndex) !== wallpaperIndex) {
        setWallpaperIndex(parseInt(newIndex));
      }
    };

    // setting index before the interval
    setIndex();
    const interval = setInterval(() => {
      setIndex();
    }, 100);
    setWallpaper(wallpaperIndex);

    return () => clearInterval(interval);
  }, [wallpaperIndex]);

  useEffect(() => {
    const savedMessageElements = localStorage.getItem("messageElements");
    const savedSearchbarElements = localStorage.getItem("searchbarElements");
    const savedWeatherElements = localStorage.getItem("weatherElements");

    if (!savedMessageElements && !savedSearchbarElements) {
      // fresh load (no saved data)
      //addMessageElement(window.innerWidth / 2 - 130, window.innerHeight / 2 - 54);
      addSearchbarElement(window.innerWidth / 2 - 355, window.innerHeight / 2 + 6);
      // addWeatherElement(0, 0);
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
    <>
      {wallpaperURL ? (
        isVideo ? (
          <video
            src={wallpaperURL}
            muted
            autoPlay
            loop
            className="absolute w-screen h-screen object-cover"
          ></video>
        ) : (
          <img src={wallpaperURL} className="absolute w-screen h-screen object-cover" />
        )
      ) : null}

      <div className="w-screen h-screen select-none font-quicksand overflow-hidden">
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
    </>
  );
}

export default App;
