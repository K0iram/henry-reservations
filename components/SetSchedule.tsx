'use client';
import React, { useState, useEffect } from 'react';
import { providers, updateProviderSchedule } from '../lib/mockApi';
import { Provider, Schedule } from '../lib/types';
import { getNextWeekdays } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

const SetSchedule: React.FC<{ provider: Provider }> = ({ provider }) => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>(provider);

  useEffect(() => {
    if (selectedProvider) {
      const nextWeekdays = getNextWeekdays(5);
      const existingSchedule = selectedProvider.schedule.reduce((acc, curr) => {
        acc[curr.date] = curr;
        return acc;
      }, {} as { [key: string]: Schedule });

      const mergedSchedule = nextWeekdays.map(date => existingSchedule[date] || { date, startTime: '', endTime: '' });
      setSchedule(mergedSchedule);
    }
  }, [selectedProvider]);

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleSubmit = () => {
    if (selectedProvider) {
      const updatedSchedule = schedule.filter(slot => slot.startTime && slot.endTime);
      updateProviderSchedule(selectedProvider.id, updatedSchedule).then(() => {
        alert('Schedule updated successfully');
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2>Set Schedule for</h2>
        <Select onValueChange={(value) => setSelectedProvider(providers.find(p => p.id === value))} value={selectedProvider?.id}>
          <SelectTrigger>
            <span>{selectedProvider ? selectedProvider.name : 'Select Provider'}</span>
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {schedule.map((slot, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input type="date" value={slot.date} readOnly />
            <Input type="time" value={slot.startTime} onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} />
            <Input type="time" value={slot.endTime} onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)} />
          </div>
        ))}
        <Button onClick={handleSubmit}>Update Schedule</Button>
      </CardContent>
    </Card>
  );
};

export default SetSchedule;