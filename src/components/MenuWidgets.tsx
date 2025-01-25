import MenuWidgetSquare from "./MenuWidgetSquare";

interface MenuWidgetsProps {
  addMessageFunc: () => void;
  addSearchbarFunc: () => void;
}

const MenuWidgets = ({ addMessageFunc, addSearchbarFunc }: MenuWidgetsProps) => {
  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {MenuWidgetSquare({ title: "Message", func: addMessageFunc })}
      {MenuWidgetSquare({ title: "Search bar", func: addSearchbarFunc })}
      {MenuWidgetSquare({ title: "Weather", func: addSearchbarFunc })}
    </main>
  );
};

export default MenuWidgets;
