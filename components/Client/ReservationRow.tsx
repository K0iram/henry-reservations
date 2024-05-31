import React from 'react';
import moment from 'moment';
import { Button } from '../ui/button';
import { Reservation } from '@/lib/types';
import { providers } from '../../lib/mockApi';
import { TableCell, TableRow } from '../ui/table';

interface ReservationRowProps {
  reservation: Reservation;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

/**
 * ReservationRow is a component that renders a table row for a reservation.
 * 
 * Props:
 * - reservation: A Reservation object containing details of the reservation.
 * - onConfirm: A function to be called when the reservation is confirmed.
 * - onCancel: A function to be called when the reservation is canceled.
 * 
 * The component displays the reservation date, time, provider, status, and action buttons.
 * If the reservation is confirmed, a "Cancel" button is shown.
 * If the reservation is pending, both "Confirm" and "Cancel" buttons are shown.
 * If the reservation is neither confirmed nor pending, no action buttons are shown.
 */
const ReservationRow: React.FC<ReservationRowProps> = ({ reservation, onConfirm, onCancel }) => {
  return (
    <TableRow className={`${!reservation.confirmed && !reservation.blockedUntil ? 'bg-gray-200 italic' : ''}`}>
      <TableCell className="px-4 py-2">{moment(reservation.date).format('LL')}</TableCell>
      <TableCell className="px-4 py-2">
        {moment(`${reservation.date} ${reservation.startTime}`, 'YYYY-MM-DD HH:mm').format('h:mm A')} - {moment(`${reservation.date} ${reservation.endTime}`, 'YYYY-MM-DD HH:mm').format('h:mm A')}
      </TableCell>
      <TableCell className="px-4 py-2">{providers.find(provider => provider.id === reservation.providerId)?.name}</TableCell>
      <TableCell className="px-4 py-2">
        {reservation.confirmed ? 'Confirmed' : reservation.blockedUntil ? 'Pending' : 'Canceled'}
      </TableCell>
      <TableCell className="px-4 py-2">
        {reservation.confirmed ? (
          <Button variant="destructive" onClick={() => onCancel(reservation.id)}>Cancel</Button>
        ) : reservation.blockedUntil ? (
          <div className="flex gap-2">
            <Button onClick={() => onConfirm(reservation.id)}>Confirm</Button>
            <Button variant="destructive" onClick={() => onCancel(reservation.id)}>Cancel</Button>
          </div>
        ) : null}
      </TableCell>
    </TableRow>
  );
};

export default ReservationRow;

