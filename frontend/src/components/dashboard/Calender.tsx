export const Calendar = () => {
  const today = new Date();
  const currentMonth = today.toLocaleString("default", { month: "short" });
  const currentDate = today.getDate();
  const currentDay = today.getDay();

  // Get the first day of current month and total days
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className=""></div>);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = day === currentDate;
    calendarDays.push(
      <div
        key={day}
        className={
          isToday
            ? "font-semibold bg-gray-900 text-white rounded w-6 h-6 flex items-center justify-center mx-auto text-[11px]"
            : "text-gray-600 text-[11px] hover:bg-gray-50 rounded w-6 h-6 flex items-center justify-center mx-auto cursor-pointer transition-colors"
        }
      >
        {day}
      </div>
    );
  }

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200/60 hover:border-gray-300/60 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-600">
          {currentMonth}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-2 font-medium">
        {dayNames.map((day, idx) => (
          <div key={idx} className="text-gray-400 w-6">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">{calendarDays}</div>
    </div>
  );
};

export default Calendar;
