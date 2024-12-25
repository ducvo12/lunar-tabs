import { useEffect, useRef, useState } from "react";

function App() {
  const [theme] = useState("dark");
  document.documentElement.classList.add(theme);

  const boxRef = useRef<HTMLDivElement>(null);
  const rect = boxRef.current?.getBoundingClientRect();

  const [isDragging, setIsDragging] = useState(false);

  const [x, setX] = useState(
    (rect ? window.innerWidth / 2 - rect.width / 2 : window.innerWidth / 2 - 100) - 25
  );
  const [y, setY] = useState(
    (rect ? window.innerHeight / 2 - rect?.height / 2 : window.innerHeight / 2 - 100) - 25
  );

  const mouseDown = () => {
    setIsDragging(true);
  };
  const mouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      if (isDragging) {
        if (rect) {
          setX(e.clientX - rect.width / 2);
          setY(e.clientY - rect.height / 2);
        }
      }
    };

    document.addEventListener("mousemove", mouseMove);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
    };
  });

  return (
    <main className="flex w-screen h-screen items-center justify-center bg-surface1 font-quicksand">
      <div
        ref={boxRef}
        className="absolute
          text-6xl text-text text-center"
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        style={{
          left: x,
          top: y
        }}
      >
        Welcome
      </div>
      <section className="grid relative -top-6 grid-rows-2 grid-flow-row place-content-center place-items-center">
        <form action="https://www.google.com/search" method="GET">
          <input
            className="bg-surface2 border-none outline-none
              w-searchBar h-12 rounded-full
              indent-5 text-2xl text-text"
            name="q"
            type="text"
            placeholder="Search"
            autoComplete="off"
          />
        </form>
      </section>
    </main>
  );
}

export default App;
