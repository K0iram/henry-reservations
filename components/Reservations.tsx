'use client';
import React, { useEffect, useState } from 'react';
import { getReservations, confirmReservation, unblockExpiredReservations } from '../lib/mockApi';
import { Reservation } from '../lib/types';
import moment from 'moment';
import { Card, CardContent, CardHeader } from './ui/card';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from './ui/table';
import { Button } from './ui/button';

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
    <Card>
      <CardHeader>
        <h2>My Reservations</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>
                  {reservation.startTime} - {reservation.endTime}
                  {!reservation.confirmed && reservation.blockedUntil && (
                    <span> (Blocked until {moment(reservation.blockedUntil).format('HH:mm')})</span>
                  )}
                </TableCell>
                <TableCell>{reservation.confirmed ? 'Confirmed' : 'Pending'}</TableCell>
                <TableCell>
                  {!reservation.confirmed && (
                    <Button onClick={() => handleConfirm(reservation.id)}>Confirm</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Reservations;