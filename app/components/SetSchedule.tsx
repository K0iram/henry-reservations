'use client';
import React, { useState, useEffect } from 'react';
import { updateProviderSchedule } from '../mockApi';
import { Provider, Schedule } from '../types';
import { getNextWeekdays } from '../utils/getNextWeekDays';

const SetSchedule: React.FC<{ provider: Provider }> = ({ provider }) => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    const nextWeekdays = getNextWeekdays(5);
    const existingSchedule = provider.schedule.reduce((acc, curr) => {
      acc[curr.date] = curr;
      return acc;
    }, {} as { [key: string]: Schedule });

    const mergedSchedule = nextWeekdays.map(date => existingSchedule[date] || { date, startTime: '', endTime: '' });
    setSchedule(mergedSchedule);
  }, [provider.schedule]);

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const handleSubmit = () => {
    const updatedSchedule = schedule.filter(slot => slot.startTime && slot.endTime);
    updateProviderSchedule(provider.id, updatedSchedule).then(() => {
      alert('Schedule updated successfully');
    });
  };

  return (
    <div>
      <h2>Set Schedule for {provider.name}</h2>
      {schedule.map((slot, index) => (
        <div key={index}>
          <input type="date" value={slot.date} readOnly />
          <input type="time" value={slot.startTime} onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} />
          <input type="time" value={slot.endTime} onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)} />
        </div>
      ))}
      <button onClick={handleSubmit}>Update Schedule</button>
    </div>
  );
};

export default SetSchedule;