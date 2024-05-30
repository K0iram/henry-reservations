'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getReservations } from '../../lib/mockApi';
import { Reservation } from '../../lib/types';

interface ReservationsContextType {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  cancelReservation: (id: string) => void;
  confirmReservation: (id: string) => void;
  isLoading: boolean;
}

const ReservationsContext = createContext<ReservationsContextType | undefined>(undefined);

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getReservations().then((data) => {
      setReservations(data);
      setIsLoading(false);
    });
  }, []);

  const addReservation = (reservation: Reservation) => {
    setReservations((prev) => [...prev, reservation]);
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id ? { ...reservation, confirmed: false, blockedUntil: undefined } : reservation
      )
    );
  };

  const confirmReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id ? { ...reservation, confirmed: true, blockedUntil: undefined } : reservation
      )
    );
  };

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, cancelReservation, confirmReservation, isLoading }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => {
  const context = useContext(ReservationsContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationsProvider');
  }
  return context;
};