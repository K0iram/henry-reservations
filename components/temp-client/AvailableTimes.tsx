import React from 'react';
import moment from 'moment';
import { Provider, Reservation } from '@/lib/types';
import { Button } from '../ui/button';

interface AvailableTimesProps {
  providers: Provider[];
  selectedProvider: string;
  selectedDate: string;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  reservations: Reservation[];
}

/**
 * AvailableTimes is a component that displays available time slots for a selected provider and date.
 * 
 * Props:
 * - providers: An array of Provider objects.
 * - selectedProvider: The ID of the currently selected provider.
 * - selectedDate: The currently selected date in 'YYYY-MM-DD' format.
 * - selectedTime: The currently selected time in 'HH:mm' format.
 * - setSelectedTime: A function to update the selected time.
 * - reservations: An array of Reservation objects.
 * 
 * The component finds the schedule for the selected provider and date, generates time slots,
 * and checks if each time slot is available based on existing reservations.
 * 
 * The available time slots are displayed as buttons. Clicking a button sets the selected time.
 * If a time slot is not available, the button is disabled.
 */

const AvailableTimes: React.FC<AvailableTimesProps> = ({ providers, selectedProvider, selectedDate, selectedTime, setSelectedTime, reservations }) => {
  const provider = providers.find((p) => p.id === selectedProvider);
  const schedule = provider?.schedule.find((s) => s.date === selectedDate);
  const times = schedule ? generateTimes(schedule.startTime, schedule.endTime) : [];

  function generateTimes(startTime: string, endTime: string): string[] {
    const start = moment(startTime, 'HH:mm');
    const end = moment(endTime, 'HH:mm');
    const times = [];

    while (start.isBefore(end)) {
      times.push(start.format('HH:mm'));
      start.add(15, 'minutes');
    }

    return times;
  }

  const isTimeAvailable = (time: string): boolean => {
    const startTime = moment(`${selectedDate} ${time}`, 'YYYY-MM-DD HH:mm');
    const endTime = startTime.clone().add(15, 'minutes');

    return !reservations.some((res) =>
      res.providerId === selectedProvider &&
      res.date === selectedDate &&
      res.confirmed &&
      (
        moment(`${selectedDate} ${res.startTime}`, 'YYYY-MM-DD HH:mm').isBefore(endTime) &&
        moment(`${selectedDate} ${res.endTime}`, 'YYYY-MM-DD HH:mm').isAfter(startTime)
      )
    );
  };

  return (
    <>
      {times.map((time) => (
        <Button key={time} onClick={() => setSelectedTime(time)} variant={selectedTime === time ? 'default' : 'outline'} disabled={!isTimeAvailable(time)}>
          {moment(time, 'HH:mm').format('h:mm A')}
        </Button>
      ))}
    </>
  );
};

export default AvailableTimes;

