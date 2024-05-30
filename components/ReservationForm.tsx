'use client';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { getProviders, createReservation, unblockExpiredReservations } from '../lib/mockApi';
import { Provider, Reservation } from '../lib/types';
import { Card, CardContent, CardHeader } from './ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import { useReservations } from '../lib/context/ReservationsContext';

const ReservationForm: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { reservations, addReservation } = useReservations();
  const { toast } = useToast()

  useEffect(() => {
    getProviders().then(setProviders);
    const interval = setInterval(unblockExpiredReservations, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleReservation = () => {
    const startTime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD hh:mm A');
    const endTime = startTime.clone().add(15, 'minutes');
    const blockedUntil = moment().add(30, 'minutes');

    const reservation: Reservation = {
      id: `${Date.now()}`,
      providerId: selectedProvider,
      clientId: '1', // Assume client ID is 1 as 'logged in user'
      date: selectedDate,
      startTime: startTime.format('HH:mm'),
      endTime: endTime.format('HH:mm'),
      confirmed: false,
      blockedUntil: blockedUntil.toDate(), // Block for 30 minutes
    };

    const clearForm = () => {
      setSelectedProvider('');
      setSelectedDate('');
      setSelectedTime('');
    }

    // Check if the selected time is within provider's working hours
    const provider = providers.find((p) => p.id === selectedProvider);
    if (provider) {
      const schedule = provider.schedule.find((s) => s.date === selectedDate);
      if (schedule) {
        const scheduleStartTime = moment(`${selectedDate} ${schedule.startTime}`, 'YYYY-MM-DD HH:mm');
        const scheduleEndTime = moment(`${selectedDate} ${schedule.endTime}`, 'YYYY-MM-DD HH:mm');

        if (startTime.isBetween(scheduleStartTime, scheduleEndTime, undefined, '[)') && endTime.isBefore(scheduleEndTime)) {
          const isOverlapping = reservations.some((res) => 
            res.providerId === selectedProvider &&
            res.date === selectedDate &&
            res.confirmed && // Only confirmed reservations
            (
              moment(`${selectedDate} ${res.startTime}`, 'YYYY-MM-DD HH:mm').isBefore(endTime) &&
              moment(`${selectedDate} ${res.endTime}`, 'YYYY-MM-DD HH:mm').isAfter(startTime)
            )
          );
          if (!isOverlapping) {
            createReservation(reservation).then(() => {
              toast({
                title: "Success!",
                description: "Reservation created and blocked for 30 minutes. Please confirm within 30 minutes.",
              })
              addReservation(reservation); // Add reservation to context
              clearForm();
            });
          } else {
            toast({
              title: "Oops!",
              description: "Selected timeslot is already booked or blocked.",
              variant: "destructive" 
            })
            clearForm();
          }
        } else {
          toast({
            title: "Oops!",
            description: "Selected time is outside of provider's working hours.",
            variant: "destructive"
          })
          clearForm();
        }
      }
    }
  };

  const getProviderHours = () => {
    const provider = providers.find((p) => p.id === selectedProvider);
    if (provider) {
      const schedule = provider.schedule.find((s) => s.date === selectedDate);
      if (schedule) {
        const scheduleStartTime = moment(`${selectedDate} ${schedule.startTime}`);
        const scheduleEndTime = moment(`${selectedDate} ${schedule.endTime}`);
        const timeSlots = [];
        let currentTime = scheduleStartTime;

        while (currentTime.isBefore(scheduleEndTime)) {
          const isBooked = reservations.some((res) => 
            res.providerId === selectedProvider &&
            res.date === selectedDate &&
            res.confirmed && // Only confirmed reservations
            moment(`${selectedDate} ${res.startTime}`).isSame(currentTime)
          );

          if (!isBooked) {
            timeSlots.push(
              <SelectItem key={currentTime.format('hh:mm A')} value={currentTime.format('hh:mm A')}>
                {currentTime.format('hh:mm A')}
              </SelectItem>
            );
          }

          currentTime = currentTime.add(15, 'minutes');
        }

        return timeSlots;
      }
    }
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h2>Create Reservation</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Select onValueChange={setSelectedProvider} value={selectedProvider}>
          <SelectTrigger>
            <span>{selectedProvider ? providers.find(p => p.id === selectedProvider)?.name : 'Select Provider'}</span>
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input 
          type="date" 
          onChange={(e) => setSelectedDate(e.target.value)} 
          value={selectedDate} 
          min={moment().add(1, 'days').format('YYYY-MM-DD')} // Disable all days up to and including today
          disabled={!selectedProvider}
        />
        <Select onValueChange={setSelectedTime} value={selectedTime} disabled={!selectedProvider || !selectedDate}>
          <SelectTrigger>
            <span>{selectedTime || 'Select Time'}</span>
          </SelectTrigger>
          <SelectContent>
            {getProviderHours()}
          </SelectContent>
        </Select>
        <Button onClick={handleReservation}>Reserve</Button>
      </CardContent>
    </Card>
  );
};

export default ReservationForm;