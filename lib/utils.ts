import moment from 'moment';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getNextWeekdays = (count: number): string[] => {
  const weekdays: string[] = [];
  let day = moment();

  while (weekdays.length < count) {
    if (day.isoWeekday() < 6) { // Monday to Friday are considered weekdays
      weekdays.push(day.format('YYYY-MM-DD'));
    }
    day = day.add(1, 'day');
  }

  return weekdays;
};