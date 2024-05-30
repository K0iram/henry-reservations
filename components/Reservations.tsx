'use client';
import React, { useEffect, useState } from 'react';
import { getReservations, confirmReservation, unblockExpiredReservations, cancelReservation, providers } from '../lib/mockApi';
import { Provider, Reservation } from '../lib/types';
import moment from 'moment';
import { Card, CardContent, CardHeader } from './ui/card';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from './ui/table';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    getReservations().then(data => {
      setReservations(data);
      setIsLoading(false);
    });
    const interval = setInterval(unblockExpiredReservations, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = (id: string) => {
    confirmReservation(id).then(() => {
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, confirmed: true, blockedUntil: undefined } : res))
      );
      toast({
        title: "Success!",
        description: "Reservation confirmed.",
      });
    });
  };

  const handleCancel = (id: string) => {
    cancelReservation(id).then(() => {
      setReservations((prev) =>
        prev.map((res) => (res.id === id ? { ...res, confirmed: false, blockedUntil: null } : res))
      );
      toast({
        title: "Success!",
        description: "Reservation canceled.",
      });
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
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5}>Loading...</TableCell>
              </TableRow>
            )}
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{providers.find((provider) => provider.id === reservation.providerId)?.name}</TableCell>
                <TableCell>
                  {reservation.startTime} - {reservation.endTime}
                  {!reservation.confirmed && reservation.blockedUntil && (
                    <span> (Blocked until {moment(reservation.blockedUntil).format('HH:mm')})</span>
                  )}
                </TableCell>
                <TableCell>
                  {reservation.confirmed ? 'Confirmed' : reservation.blockedUntil ? 'Pending' : 'Canceled'}
                </TableCell>
                <TableCell>
                  {reservation.confirmed ? (
                    <Button variant="destructive" onClick={() => handleCancel(reservation.id)}>Cancel</Button>
                  ) : reservation.blockedUntil ? (
                    <>
                      <Button onClick={() => handleConfirm(reservation.id)}>Confirm</Button>
                      <Button variant="destructive" onClick={() => handleCancel(reservation.id)}>Cancel</Button>
                    </>
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