import Draggable from "react-draggable";

interface SearchbarProps {
  x: number;
  y: number;
  canBeDragged: boolean;
  id?: string;
  removeFunc?: (id: string) => void;
}

const Searchbar = ({ x, y, canBeDragged }: SearchbarProps) => {
  return (
    <Draggable defaultPosition={{ x: x - 350, y: y - 25 }} bounds="parent" disabled={!canBeDragged}>
      <div
        className={`absolute outline-none
          ${canBeDragged ? "hover:outline hover:outline-2 hover:outline-white" : ""}
          transition-[outline]`}
      >
        <form action="https://www.google.com/search" method="GET">
          <input
            className="bg-surface2 border-none outline-none
              w-searchBar h-12 rounded-full
              indent-5 text-2xl text-text"
            name="q"
            type="text"
            placeholder="Search"
            autoComplete="off"
            readOnly={canBeDragged}
          />
        </form>
      </div>
    </Draggable>
  );
};

export default Searchbar;
