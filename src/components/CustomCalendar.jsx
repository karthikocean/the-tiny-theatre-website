import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomCalendar = ({ selectedDate, onChange, validDates }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    if (!selectedDate || !date) return false;
    const sDate = new Date(selectedDate);
    return date.getDate() === sDate.getDate() &&
      date.getMonth() === sDate.getMonth() &&
      date.getFullYear() === sDate.getFullYear();
  };

  const isValidDate = (date) => {
    if (!date) return false;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    // Also disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    return validDates.includes(dateStr);
  };

  return (
    <div className="w-full bg-theatre-dark/60 p-4 rounded-xl border border-white/10 text-white font-sans">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div className="font-bold text-sm">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-[10px] font-bold text-gray-500">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="h-8"></div>;
          }
          
          const valid = isValidDate(date);
          const selected = isSelected(date);
          const today = isToday(date);
          
          return (
            <button
              key={idx}
              type="button"
              disabled={!valid}
              onClick={() => {
                if (valid) {
                  const yyyy = date.getFullYear();
                  const mm = String(date.getMonth() + 1).padStart(2, '0');
                  const dd = String(date.getDate()).padStart(2, '0');
                  onChange(`${yyyy}-${mm}-${dd}`);
                }
              }}
              className={`h-8 w-full rounded-lg text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
                selected ? 'bg-theatre-gold text-theatre-grey-deep shadow-md' :
                valid ? 'hover:bg-white/10 cursor-pointer text-gray-200' :
                'opacity-50 cursor-not-allowed text-gray-500'
              } ${today && !selected && valid ? 'border border-theatre-gold/50 text-theatre-gold' : ''}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
