import React from 'react';
import { Provider } from '../../lib/types';
import { Button } from '../ui/button';
import moment from 'moment';

interface AvailableDatesProps {
  providers: Provider[];
  selectedProvider: string;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

/**
 * AvailableDates is a component that displays a list of available dates for a selected provider.
 * 
 * Context:
 * - providers: An array of Provider objects from the ProvidersContext.
 * - selectedProvider: A string representing the selected provider.
 * - selectedDate: A string representing the selected date.
 * - setSelectedDate: A function to set the selected date.
 */
const AvailableDates: React.FC<AvailableDatesProps> = ({ providers, selectedProvider, selectedDate, setSelectedDate }) => {
  const provider = providers.find((p) => p.id === selectedProvider);
  const dates = provider?.schedule.map((s) => s.date) || [];

  return (
    <>
      {dates.map((date) => (
        <Button key={date} onClick={() => setSelectedDate(date)} variant={selectedDate === date ? 'default' : 'outline'}>
          {moment(date).format('ll')}
        </Button>
      ))}
    </>
  );
};

export default AvailableDates;

