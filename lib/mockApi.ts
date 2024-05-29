import moment from 'moment';
import { Provider, Reservation, Schedule } from './types';

export const providers: Provider[] = [
  {
    id: '1',
    name: 'Dr. Henry',
    schedule: [],
  },
  {
    id: '2',
    name: 'Dr. Smith',
    schedule: [],
  },
  {
    id: '3',
    name: 'Dr. Johnson',
    schedule: [],
  },
];

const getStoredReservations = (): Reservation[] => {
  const storedReservations = localStorage.getItem('reservations');
  return storedReservations ? JSON.parse(storedReservations) : [];
};

const saveReservations = (reservations: Reservation[]) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
};

export const getProviders = (): Promise<Provider[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(providers), 1000);
  });
};

export const getReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getStoredReservations()), 1000);
  });
};

export const updateProviderSchedule = (providerId: string, schedule: Schedule[]): Promise<void> => {
  return new Promise((resolve) => {
    const provider = providers.find((p) => p.id === providerId);
    if (provider) {
      provider.schedule = schedule;
      setTimeout(() => resolve(), 1000);
    }
  });
};

export const createReservation = (reservation: Reservation): Promise<void> => {
  return new Promise((resolve) => {
    const reservations = getStoredReservations();
    reservations.push(reservation);
    saveReservations(reservations);
    setTimeout(() => resolve(), 1000);
  });
};

export const confirmReservation = (reservationId: string): Promise<void> => {
  return new Promise((resolve) => {
    const reservations = getStoredReservations();
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      reservation.confirmed = true;
      reservation.blockedUntil = undefined;
      saveReservations(reservations);
    }
    setTimeout(() => resolve(), 1000);
  });
};

export const unblockExpiredReservations = (): void => {
  const now = moment();
  const reservations = getStoredReservations();
  reservations.forEach((reservation) => {
    if (reservation.blockedUntil && moment(reservation.blockedUntil).isBefore(now)) {
      reservation.blockedUntil = undefined;
    }
  });
  saveReservations(reservations);
};