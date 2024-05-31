import moment from 'moment';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Schedule } from './types';

// Util Functions

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * getNextWeekdays is a function that returns the next n weekdays.
 */
export const getNextWeekdays = (count: number): string[] => {
  const weekdays: string[] = [];
  let day = moment().add(1, 'day');

  while (weekdays.length < count) {
    if (day.isoWeekday() < 6) {
      weekdays.push(day.format('YYYY-MM-DD'));
    }
    day = day.add(1, 'day');
  }

  return weekdays;
};

const isBrowser = typeof window !== 'undefined';

/**
 * saveSchedules is a function that saves the schedule for a provider to local storage.
 */
export const saveSchedules = (providerId: string, schedule: Schedule[]): void => {
  if (isBrowser) {
    localStorage.setItem(`schedule-${providerId}`, JSON.stringify(schedule));
  }
};

/**
 * getStoredSchedules is a function that retrieves the schedule for a provider from local storage.
 */
export const getStoredSchedules = (providerId: string): Schedule[] => {
  if (!isBrowser) return [];
  const storedSchedule = localStorage.getItem(`schedule-${providerId}`);
  return storedSchedule ? JSON.parse(storedSchedule) : [];
};

/**
 * generateDefaultSchedule is a function that generates a default schedule for a provider.
 * 
 * The schedule is generated for the next 5 days, starting from the next day.
 */
export const generateDefaultSchedule = (): Schedule[] => {
  const schedule: Schedule[] = [];
  const startOfDay = moment().startOf('day').add(9, 'hours'); // 9am
  const endOfDay = moment().startOf('day').add(17, 'hours'); // 5pm

  let day = moment().add(1, 'day'); 
  let weekdaysAdded = 0;

  while (weekdaysAdded < 5) {
    if (day.isoWeekday() <= 5) {
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

/**
 * clearData is a function that clears the local storage and redirects to the home page. This is for testing purposes.
 */
export const clearData = (): void => {
  localStorage.clear();
  window.location.href = '/';
};
