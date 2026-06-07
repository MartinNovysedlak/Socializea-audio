"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fromDate?: Date;
}

export function DatePicker({ 
  selected, 
  onSelect, 
  placeholder = "Vyberte dátum", 
  className,
  disabled,
  fromDate
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal bg-black/50 border-white/10 text-white rounded-xl h-11",
            !selected && "text-gray-400",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#BD20D3]" />
          {selected ? format(selected, "dd.MM.yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-[#0a0d1f] border border-white/10 rounded-xl" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={fromDate ? { before: fromDate } : undefined}
          initialFocus
          className="text-white [&_button]:text-white [&_button:hover]:bg-[#BD20D3]/20 [&_button[aria-selected='true']]:bg-[#BD20D3] [&_button[aria-selected='true']]:text-white [&_.rdp-day_today]:text-[#BD20D3] [&_.rdp-day_today]:font-bold"
        />
      </PopoverContent>
    </Popover>
  );
}