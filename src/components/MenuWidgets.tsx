import MenuWidgetSquare from "./MenuWidgetSquare";

interface MenuWidgetsProps {
  addMessageFunc: () => void;
  addSearchbarFunc: () => void;
  addWeatherFunc: () => void;
  addTimeTextFunc: () => void;
  addTodoListFunc: () => void;
  addWeatherForecastFunc: () => void;
}

const MenuWidgets = ({
  addMessageFunc,
  addSearchbarFunc,
  addWeatherFunc,
  addTimeTextFunc,
  addTodoListFunc,
  addWeatherForecastFunc
}: MenuWidgetsProps) => {
  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {MenuWidgetSquare({ title: "Message", func: addMessageFunc })}
      {MenuWidgetSquare({ title: "Search bar", func: addSearchbarFunc })}
      {MenuWidgetSquare({ title: "Weather", func: addWeatherFunc })}
      {MenuWidgetSquare({ title: "Time", func: addTimeTextFunc })}
      {MenuWidgetSquare({ title: "Todo List", func: addTodoListFunc })}
      {MenuWidgetSquare({ title: "Weather Forecast", func: addWeatherForecastFunc })}
    </main>
  );
};

export default MenuWidgets;
