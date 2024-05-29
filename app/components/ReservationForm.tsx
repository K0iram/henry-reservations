'use client';

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { getProviders, createReservation, unblockExpiredReservations, getReservations } from '../mockApi';
import { Provider, Reservation } from '../types';

const ReservationForm: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    getProviders().then(setProviders);
    getReservations().then(setReservations);
    const interval = setInterval(unblockExpiredReservations, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleReservation = () => {
    const startTime = moment(`${selectedDate} ${selectedTime}`);
    const endTime = startTime.clone().add(15, 'minutes');
    const blockedUntil = moment().add(30, 'minutes');

    const reservation: Reservation = {
      id: `${Date.now()}`,
      providerId: selectedProvider,
      clientId: '1', // Assume client ID is 1
      date: selectedDate,
      startTime: startTime.format('HH:mm'),
      endTime: endTime.format('HH:mm'),
      confirmed: false,
      blockedUntil: blockedUntil.toDate(), // Block for 30 minutes
    };

    // Check if the selected time is within provider's working hours
    const provider = providers.find((p) => p.id === selectedProvider);
    if (provider) {
      const schedule = provider.schedule.find((s) => s.date === selectedDate);
      if (schedule) {
        const scheduleStartTime = moment(`${selectedDate} ${schedule.startTime}`);
        const scheduleEndTime = moment(`${selectedDate} ${schedule.endTime}`);

        if (startTime.isBetween(scheduleStartTime, scheduleEndTime, undefined, '[)') && endTime.isBetween(scheduleStartTime, scheduleEndTime, undefined, '[)')) {
          // Check for overbooking
          const isOverlapping = reservations.some((res) => 
            res.providerId === selectedProvider &&
            res.date === selectedDate &&
            ((moment(`${selectedDate} ${res.startTime}`).isBefore(endTime) && moment(`${selectedDate} ${res.endTime}`).isAfter(startTime)) ||
            (res.blockedUntil && moment(res.blockedUntil).isAfter(moment())))
          );

          if (!isOverlapping) {
            createReservation(reservation).then(() => {
              alert('Reservation created and blocked for 30 minutes. Please confirm within 30 minutes.');
              setReservations([...reservations, reservation]);
            });
          } else {
            alert('Selected timeslot is already booked or blocked.');
          }
        } else {
          alert('Selected time is outside of provider\'s working hours.');
        }
      }
    }
  };

  return (
    <div>
      <h2>Create Reservation</h2>
      <select onChange={(e) => setSelectedProvider(e.target.value)} value={selectedProvider}>
        <option value="">Select Provider</option>
        {providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>
      <input type="date" onChange={(e) => setSelectedDate(e.target.value)} value={selectedDate} />
      <input type="time" onChange={(e) => setSelectedTime(e.target.value)} value={selectedTime} />
      <button onClick={handleReservation}>Reserve</button>
    </div>
  );
};

export default ReservationForm;