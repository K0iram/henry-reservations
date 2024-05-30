'use client';
import React, { useEffect, useState } from 'react';
import { confirmReservation, unblockExpiredReservations, cancelReservation, providers } from '../lib/mockApi';
import { useReservations } from '../lib/context/ReservationsContext';
import moment from 'moment';
import { Card, CardContent, CardHeader } from './ui/card';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from './ui/table';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Reservation } from '@/lib/types';

const Reservations: React.FC = () => {
  const { reservations,confirmReservation: confirmReservationContext, cancelReservation: cancelReservationContext, isLoading } = useReservations();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(unblockExpiredReservations, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = (id: string) => {
    confirmReservation(id).then(() => {
      confirmReservationContext(id);
      toast({
        title: "Success!",
        description: "Reservation confirmed.",
      });
    });
  };
  
  const handleCancel = (id: string) => {
    cancelReservation(id).then(() => {
      cancelReservationContext(id);
      toast({
        title: "Success!",
        description: "Reservation canceled.",
      });
    });
  };

  return (
    <Card>
      <CardHeader>
      <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">My Reservations</h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(isLoading) && (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            )}
            {reservations.map((reservation: Reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{moment(reservation.date).format('LL')}</TableCell>
                <TableCell>{moment(`${reservation.date} ${reservation.startTime}`, 'YYYY-MM-DD HH:mm').format('h:mm A')} - {moment(`${reservation.date} ${reservation.endTime}`, 'YYYY-MM-DD HH:mm').format('h:mm A')}</TableCell>
                <TableCell>{providers.find(provider => provider.id === reservation.providerId)?.name}</TableCell>
                <TableCell>
                  {reservation.confirmed ? 'Confirmed' : reservation.blockedUntil ? 'Pending' : 'Canceled'}
                </TableCell>
                <TableCell>
                  {reservation.confirmed ? (
                    <Button variant="destructive" onClick={() => handleCancel(reservation.id)}>Cancel</Button>
                  ) : reservation.blockedUntil ? (
                    <div className="flex gap-2">
                      <Button onClick={() => handleConfirm(reservation.id)}>Confirm</Button>
                      <Button variant="destructive" onClick={() => handleCancel(reservation.id)}>Cancel</Button>
                    </div>
                  ) : null}
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