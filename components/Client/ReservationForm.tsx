'use client';

import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { getProviders, createReservation, unblockExpiredReservations } from '../../lib/mockApi';
import { Provider, Reservation } from '../../lib/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { useToast } from "@/components/ui/use-toast"
import { useReservations } from '../../lib/context/ReservationsContext';
import ProviderSelect from './ProviderSelect';
import AvailableDates from './AvailableDates';
import AvailableTimes from './AvailableTimes';

/**
 * ReservationForm is a component that allows users to create reservations with providers.
 * 
 * State:
 * - providers: An array of Provider objects fetched from the API.
 * - selectedProvider: The ID of the currently selected provider.
 * - selectedDate: The currently selected date in 'YYYY-MM-DD' format.
 * - selectedTime: The currently selected time in 'HH:mm' format.
 * 
 * Context:
 * - reservations: An array of Reservation objects from the ReservationsContext.
 * - addReservation: A function to add a new reservation to the context.
 * - toast: A function to display toast notifications.
 * 
 * Effects:
 * - Fetches providers from the API on component mount.
 * - Sets an interval to unblock expired reservations every minute.
 * 
 * Methods:
 * - handleReservation: Creates a new reservation and adds it to the context if the selected time is within the provider's working hours and not overlapping with existing reservations.
 * - clearForm: Clears the form fields after a reservation is made.
 * 
 * Components:
 * - ProviderSelect: A dropdown to select a provider.
 * - AvailableDates: A list of available dates for the selected provider.
 * - AvailableTimes: A list of available time slots for the selected provider and date.
 */

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

  const handleReservation = (): void => {
    const startTime: Moment = moment(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD h:mm A');
    const endTime: Moment = startTime.clone().add(15, 'minutes');
    const blockedUntil: Moment = moment().add(30, 'minutes');

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

    const clearForm = (): void => {
      setSelectedProvider('');
      setSelectedDate('');
      setSelectedTime('');
    };

    // Check if the selected time is within provider's working hours
    const provider = providers.find((p) => p.id === selectedProvider);
    if (provider) {
      const schedule = provider.schedule.find((s) => s.date === selectedDate);
      if (schedule) {
        const scheduleStartTime: Moment = moment(`${selectedDate} ${schedule.startTime}`, 'YYYY-MM-DD HH:mm');
        const scheduleEndTime: Moment = moment(`${selectedDate} ${schedule.endTime}`, 'YYYY-MM-DD HH:mm');

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

  return (
    <Card>
      <CardHeader>
        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">Add New Reservation</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ProviderSelect providers={providers} selectedProvider={selectedProvider} setSelectedProvider={setSelectedProvider} />
        <h4 className="scroll-m-20 text-md font-semibold tracking-tight">Available Dates</h4>
        <Card className="p-2 overflow-y-auto max-h-20">
          <CardContent className="flex flex-wrap gap-2 overflow-y-auto max-h-12">
            <AvailableDates providers={providers} selectedProvider={selectedProvider} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          </CardContent>
        </Card>
        <h4 className="scroll-m-20 text-md font-semibold tracking-tight">Available Times</h4>
        <Card className="p-2 overflow-y-auto max-h-20">
          <CardContent className="flex flex-wrap gap-2 overflow-y-auto max-h-12">
            <AvailableTimes providers={providers} selectedProvider={selectedProvider} selectedDate={selectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} reservations={reservations} />
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
