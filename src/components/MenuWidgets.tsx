import MenuWidgetSquare from "./MenuWidgetSquare";

interface MenuWidgetsProps {
  addMessageFunc: () => void;
  addSearchbarFunc: () => void;
  addWeatherFunc: () => void;
  addTimeTextFunc: () => void;
}

const MenuWidgets = ({
  addMessageFunc,
  addSearchbarFunc,
  addWeatherFunc,
  addTimeTextFunc
}: MenuWidgetsProps) => {
  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {MenuWidgetSquare({ title: "Message", func: addMessageFunc })}
      {MenuWidgetSquare({ title: "Search bar", func: addSearchbarFunc })}
      {MenuWidgetSquare({ title: "Weather", func: addWeatherFunc })}
      {MenuWidgetSquare({ title: "Time", func: addTimeTextFunc })}
    </main>
  );
};

export default MenuWidgets;
