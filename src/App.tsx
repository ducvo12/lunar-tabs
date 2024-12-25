import { useEffect, useRef, useState } from "react";

interface Element {
  reference: React.RefObject<HTMLDivElement>;
  x: number;
  y: number;
  width: number | undefined;
  height: number | undefined;
}

function App() {
  const [theme] = useState("dark");
  document.documentElement.classList.add(theme);

  const [titleElement] = useState<Element>({
    reference: useRef<HTMLDivElement>(null),
    x: window.innerWidth / 2 - 100,
    y: window.innerHeight / 2 - 100,
    width: undefined,
    height: undefined
  });

  useEffect(() => {
    if (titleElement.reference.current) {
      const rect = titleElement.reference.current.getBoundingClientRect();
      titleElement.width = rect.width;
      titleElement.height = rect.height;
    }
  });

  const [isDragging, setIsDragging] = useState(false);

  const [x, setX] = useState(
    (titleElement.width
      ? window.innerWidth / 2 - titleElement.width / 2
      : window.innerWidth / 2 - 100) - 25
  );
  const [y, setY] = useState(
    (titleElement.height
      ? window.innerHeight / 2 - titleElement?.height / 2
      : window.innerHeight / 2 - 100) - 25
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
        if (titleElement.width && titleElement.height) {
          setX(e.clientX - titleElement.width / 2);
          setY(e.clientY - titleElement.height / 2);
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
        ref={titleElement.reference}
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
