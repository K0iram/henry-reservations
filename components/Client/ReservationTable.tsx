import React from 'react';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '../ui/table';
import { Reservation } from '@/lib/types';
import ReservationRow from './ReservationRow';

interface ReservationTableProps {
  reservations: Reservation[];
  isLoading: boolean;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

/**
 * ReservationTable is a component that displays a table of reservations.
 * 
 * Props:
 * - reservations: An array of Reservation objects.
 * - isLoading: A boolean indicating if the reservations are being loaded.
 * - onConfirm: A function to confirm a reservation.
 * - onCancel: A function to cancel a reservation.
 */
const ReservationTable: React.FC<ReservationTableProps> = ({ reservations, isLoading, onConfirm, onCancel }) => {
  return (
    <Table className="min-w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="px-4 py-2">Date</TableHead>
          <TableHead className="px-4 py-2">Time</TableHead>
          <TableHead className="px-4 py-2">Provider</TableHead>
          <TableHead className="px-4 py-2">Status</TableHead>
          <TableHead className="px-4 py-2">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">Loading...</TableCell>
          </TableRow>
        ) : (
          reservations.map((reservation: Reservation) => (
            <ReservationRow
              key={reservation.id}
              reservation={reservation}
              onConfirm={onConfirm}
              onCancel={onCancel}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ReservationTable;

