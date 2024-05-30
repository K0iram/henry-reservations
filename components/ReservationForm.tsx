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
  const { toast } = useToast();

  useEffect(() => {
    getProviders().then(setProviders);
    const interval = setInterval(unblockExpiredReservations, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleReservation = () => {
    const startTime = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD h:mm A');
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
    };

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
              });
              addReservation(reservation); // Add reservation to context
              clearForm();
            });
          } else {
            toast({
              title: "Oops!",
              description: "Selected timeslot is already booked or blocked.",
              variant: "destructive" 
            });
            clearForm();
          }
        } else {
          toast({
            title: "Oops!",
            description: "Selected time is outside of provider's working hours.",
            variant: "destructive"
          });
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
            const timeString = currentTime.format('h:mm A');
            timeSlots.push(
              <Button 
                key={timeString} 
                onClick={() => setSelectedTime(timeString)} 
                className="m-1"
                variant={selectedTime === timeString ? 'default' : 'outline'}
              >
                {timeString}
              </Button>
            );
          }

          currentTime = currentTime.add(15, 'minutes');
        }

        return timeSlots;
      }
    }
    return null;
  };

  const getAvailableDates = () => {
    const provider = providers.find((p) => p.id === selectedProvider);
    if (provider) {
      return provider.schedule.map((s) => (
        <Button 
          key={s.date} 
          onClick={() => setSelectedDate(s.date)} 
          className="m-1"
          variant={selectedDate === s.date ? 'default' : 'outline'}
        >
          {moment(s.date).format('LL')}
        </Button>
      ));
    }
    return null;
  };

  return (
    <Card className="p-4">
      <CardHeader>
        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">Add New Reservation</h2>
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
        <h4 className="scroll-m-20 text-md font-semibold tracking-tight">Available Dates</h4>
        <Card className="p-2 overflow-y-auto max-h-20">
          <CardContent className="flex flex-wrap gap-2 overflow-y-auto max-h-12">
            {getAvailableDates()}
          </CardContent>
        </Card>
        <h4 className="scroll-m-20 text-md font-semibold tracking-tight">Available Times</h4>
        <Card className="p-2 overflow-y-auto max-h-20">
          <CardContent className="flex flex-wrap gap-2 overflow-y-auto max-h-12">
            {getProviderHours()}
          </CardContent>
        </Card>
        {selectedProvider && selectedDate && selectedTime && (
          <>
            <span className="text-sm font-medium leading-none">{`Confirm reservation for ${moment(selectedDate).format('LL')} at ${moment(selectedTime, 'HH:mm').format('h:mm A')} with ${providers.find(p => p.id === selectedProvider)?.name}?`}</span>
            <Button onClick={handleReservation}>
              Reserve
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationForm;