import { useEffect, useState } from "react";
import Title from "./components/Title";
import Searchbar from "./components/Searchbar";
// import { v4 as uuidv4 } from "uuid";

function App() {
  const [theme] = useState("dark");
  document.documentElement.classList.add(theme);

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
      <div className="absolute top-0 left-1/2 w-[2px] h-full bg-white"></div>
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white"></div>
      <Title x={window.innerWidth / 2} y={window.innerHeight / 2}></Title>
      <Searchbar x={window.innerWidth / 2} y={window.innerHeight / 2}></Searchbar>
    </div>
  );
}

export default App;
