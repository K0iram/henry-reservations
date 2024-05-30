import moment from 'moment';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Schedule } from './types';

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

const isBrowser = typeof window !== 'undefined';

export const saveSchedules = (providerId: string, schedule: Schedule[]): void => {
  if (isBrowser) {
    localStorage.setItem(`schedule-${providerId}`, JSON.stringify(schedule));
  }
};

export const getStoredSchedules = (providerId: string): Schedule[] => {
  if (!isBrowser) return [];
  const storedSchedule = localStorage.getItem(`schedule-${providerId}`);
  return storedSchedule ? JSON.parse(storedSchedule) : [];
};

export const generateDefaultSchedule = (): Schedule[] => {
  const schedule: Schedule[] = [];
  const startOfDay = moment().startOf('day').add(9, 'hours'); // 9am
  const endOfDay = moment().startOf('day').add(17, 'hours'); // 5pm

  let day = moment();
  let weekdaysAdded = 0;

  while (weekdaysAdded < 5) {
    if (day.isoWeekday() <= 5) { // Only weekdays
      schedule.push({
        date: day.format('YYYY-MM-DD'),
        startTime: startOfDay.format('HH:mm'),
        endTime: endOfDay.format('HH:mm'),
      });
      weekdaysAdded++;
    }
    day = day.add(1, 'days');
  }

  return schedule;
};

export const clearData = (): void => {
  localStorage.clear();
  window.location.href = '/';
};
