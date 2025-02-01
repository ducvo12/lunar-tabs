import MenuWidgetSquare from "./MenuWidgetSquare";

interface MenuWidgetsProps {
  addMessageFunc: () => void;
  addSearchbarFunc: () => void;
  addWeatherFunc: () => void;
}

const MenuWidgets = ({ addMessageFunc, addSearchbarFunc, addWeatherFunc }: MenuWidgetsProps) => {
  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {MenuWidgetSquare({ title: "Message", func: addMessageFunc })}
      {MenuWidgetSquare({ title: "Search bar", func: addSearchbarFunc })}
      {MenuWidgetSquare({ title: "Weather", func: addWeatherFunc })}
    </main>
  );
};

export default MenuWidgets;
