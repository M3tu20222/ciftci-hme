"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
}

export function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(selected || new Date());
  const [selectedDate, setSelectedDate] = React.useState(selected);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onSelect?.(newDate);
  };

  const weekDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  return (
    <div className={cn("p-3 bg-popover text-popover-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handlePrevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {currentDate.toLocaleDateString("tr-TR", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <Button
          variant="outline"
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: 42 }, (_, i) => {
          const day = i - firstDayOfMonth + 1;
          const isCurrentMonth = day > 0 && day <= daysInMonth;
          const isSelected =
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();

          return (
            <Button
              key={i}
              variant="ghost"
              className={cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                !isCurrentMonth && "invisible",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
              )}
              onClick={() => isCurrentMonth && handleDateClick(day)}
              disabled={!isCurrentMonth}
            >
              {isCurrentMonth ? day : ""}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
