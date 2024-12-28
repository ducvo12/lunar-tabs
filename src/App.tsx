import { useEffect, useState } from "react";
import Title from "./components/Title";
import Searchbar from "./components/Searchbar";
import { GoGear } from "react-icons/go";
import Menu from "./components/Menu";
// import { v4 as uuidv4 } from "uuid";

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

  /*
  const [elements, setElements] = useState<{ id: string }[]>([]);

  const addElement = () => {
    const newSquare = { id: uuidv4() };
    setElements([...elements, newSquare]);
  };

  const removeElement = (id: string) => {
    const newElements = elements.filter((element) => element.id !== id);
    setElements(newElements);
  };*/

  useEffect(() => {
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

      <Title x={window.innerWidth / 2} y={window.innerHeight / 2 - 30}></Title>
      <Searchbar x={window.innerWidth / 2} y={window.innerHeight / 2 + 25}></Searchbar>

      <Menu visible={menuVisible} />

      <div
        className="absolute bottom-3 right-3
          bg-neutral-800/50 hover:bg-black transition-colors
          rounded-full p-2 cursor-pointer"
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <GoGear className="text-white" style={{ fontSize: "40px" }} />
      </div>
    </div>
  );
}

export default App;
