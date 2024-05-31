import React from 'react';
import { Schedule } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ScheduleFormProps {
  schedule: Schedule[];
  onScheduleChange: (index: number, field: string, value: string) => void;
  onClearTime: (index: number) => void;
  onSubmit: () => void;
}

/**
 * ScheduleForm is a component that renders a form for setting the schedule for a provider.
 * 
 * Props:
 * - schedule: An array of Schedule objects to be displayed in the form.
 * - onScheduleChange: A function to update the schedule.
 * - onClearTime: A function to clear the time for a slot.
 * - onSubmit: A function to submit the form.
 */
const ScheduleForm: React.FC<ScheduleFormProps> = ({ schedule, onScheduleChange, onClearTime, onSubmit }) => {
  return (
    <>
      {schedule.map((slot, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <Input type="date" value={slot.date} readOnly />
          <Input type="time" value={slot.startTime} onChange={(e) => onScheduleChange(index, 'startTime', e.target.value)} />
          <Input type="time" value={slot.endTime} onChange={(e) => onScheduleChange(index, 'endTime', e.target.value)} />
          <Button onClick={() => onClearTime(index)} className="hidden sm:inline">Clear</Button>
          <Button onClick={() => onClearTime(index)} className="inline sm:hidden">X</Button>
        </div>
      ))}
      <Button onClick={onSubmit}>Update Schedule</Button>
    </>
  );
};

export default ScheduleForm;

