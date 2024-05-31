'use client';
import React, { useEffect } from 'react';
import { confirmReservation, unblockExpiredReservations, cancelReservation } from '../../lib/mockApi';
import { useReservations } from '../../lib/context/ReservationsContext';
import moment from 'moment';
import { Card, CardContent, CardHeader } from '../ui/card';
import { useToast } from '@/components/ui/use-toast';
import ReservationTable from './ReservationTable';

/**
 * Reservations is a component that displays a list of reservations.
 * 
 * Context:
 * - reservations: An array of Reservation objects from the ReservationsContext.
 * - confirmReservation: A function to confirm a reservation in the context.
 * - cancelReservation: A function to cancel a reservation in the context.
 * - isLoading: A boolean indicating if the reservations are being loaded.
 * 
 * Effects:
 * - Sets an interval to unblock expired reservations every minute.
 * 
 * Methods:
 * - handleConfirm: Confirms a reservation and shows a success toast.
 * - handleCancel: Cancels a reservation and shows a success toast.
 * 
 * Components:
 * - Card: A UI component to display the reservations in a card layout.
 * - CardHeader: A UI component to display the header of the card.
 * - CardContent: A UI component to display the content of the card.
 * - ReservationTable: A component to display the reservations in a table format.
 */
const Reservations: React.FC = () => {
  const { 
    reservations, 
    confirmReservation: confirmReservationContext, 
    cancelReservation: cancelReservationContext, 
    isLoading 
  } = useReservations();
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

  const sortedReservations = reservations.sort((a, b) => 
    moment(`${a.date} ${a.startTime}`, 'YYYY-MM-DD HH:mm').isBefore(moment(`${b.date} ${b.startTime}`, 'YYYY-MM-DD HH:mm')) ? -1 : 1
  );

  return (
    <Card>
      <CardHeader>
        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">My Reservations</h2>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <ReservationTable
            reservations={sortedReservations}
            isLoading={isLoading}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Reservations;