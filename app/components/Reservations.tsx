'use client';
import React, { useEffect, useState } from 'react';
import { getReservations, confirmReservation, unblockExpiredReservations } from '../mockApi';
import { Reservation } from '../types';
import moment from 'moment';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    getReservations().then(data => {
      setReservations(data);
    });
    const interval = setInterval(unblockExpiredReservations, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reservations]);

  const handleConfirm = (id: string) => {
    confirmReservation(id).then(() => {
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, confirmed: true, blockedUntil: undefined } : res))
      );
    });
  };

  return (
    <div>
      <h2>Reservations</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            {reservation.date} from {reservation.startTime} to {reservation.endTime} - {reservation.confirmed ? 'Confirmed' : 'Pending'}
            {!reservation.confirmed && reservation.blockedUntil && (
              <span> (Blocked until {moment(reservation.blockedUntil).format('HH:mm')})</span>
            )}
            {!reservation.confirmed && (
              <button onClick={() => handleConfirm(reservation.id)}>Confirm</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservations;