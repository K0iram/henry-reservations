'use client';
import React, { useState, useEffect } from 'react';
import { getProviders, providers, updateProviderSchedule } from '../../lib/mockApi';
import { Provider, Schedule } from '../../lib/types';
import { getNextWeekdays } from '../../lib/utils';
import { Card, CardHeader, CardContent } from '../ui/card';
import { useToast } from '../ui/use-toast';
import ScheduleProviderSelect from './ScheduleProviderSelect';
import ScheduleForm from './ScheduleForm';
import moment from 'moment';

/**
 * SetSchedule is a component that renders a form for setting the schedule for a provider.
 * 
 * The component uses the ScheduleProviderSelect and ScheduleForm components to create
 * a form for setting the schedule for a provider. The schedule is stored in local storage
 * and updated whenever the schedule is changed.
 */
const SetSchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    getProviders(); // fetch providers for default schedule
    if (selectedProvider) {
      const savedSchedule = localStorage.getItem(`schedule-${selectedProvider.id}`);
      if (savedSchedule && savedSchedule.length > 0) {
        setSchedule(JSON.parse(savedSchedule));
      } else {
        const nextWeekdays = getNextWeekdays(5);
        const existingSchedule = selectedProvider.schedule.reduce((acc, curr) => {
          acc[curr.date] = curr;
          return acc;
        }, {} as { [key: string]: Schedule });

        const mergedSchedule = nextWeekdays.map(date => existingSchedule[date] || { date, startTime: '', endTime: '' });
        setSchedule(mergedSchedule);
      }
    }
  }, [selectedProvider]);

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    if (field === 'startTime' || field === 'endTime') {
      newSchedule[index] = { ...newSchedule[index], [field]: moment(value, 'HH:mm').format('HH:mm') };
    } else {
      newSchedule[index] = { ...newSchedule[index], [field]: value };
    }
    setSchedule(newSchedule);
  };

  const handleClearTime = (index: number) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], startTime: '', endTime: '' };
    setSchedule(newSchedule);
  };

  const handleSubmit = () => {
    if (selectedProvider) {
      const updatedSchedule = schedule.filter(slot => slot.startTime && slot.endTime);
      updateProviderSchedule(selectedProvider.id, updatedSchedule).then(() => {
        toast({
          title: "Success!",
          description: `Schedule updated for ${selectedProvider.name}`,
        });
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2>Set Schedule for</h2>
        <ScheduleProviderSelect
          providers={providers}
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
        />
      </CardHeader>
      <CardContent>
        <ScheduleForm
          schedule={schedule}
          onScheduleChange={handleScheduleChange}
          onClearTime={handleClearTime}
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default SetSchedule;
