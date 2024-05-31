import moment from 'moment';
import { Provider, Reservation, Schedule } from './types';
import { getStoredSchedules, generateDefaultSchedule, saveSchedules } from './utils';

/**
 * mockApi is a module that provides mock functions for interacting with the backend.
 * 
 * The functions are used to simulate the behavior of the backend.
 */

// Provider Functions
export const providers: Provider[] = [
  {
    id: '1',
    name: 'Dr. Henry',
    schedule: getStoredSchedules('1').length ? getStoredSchedules('1') : generateDefaultSchedule(),
  },
  {
    id: '2',
    name: 'Dr. Smith',
    schedule: getStoredSchedules('2').length ? getStoredSchedules('2') : generateDefaultSchedule(),
  },
  {
    id: '3',
    name: 'Dr. Johnson',
    schedule: getStoredSchedules('3').length ? getStoredSchedules('3') : generateDefaultSchedule(),
  },
];

export const getProviders = (): Promise<Provider[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      providers.forEach(provider => {
        let schedule = getStoredSchedules(provider.id);
        if (!schedule.length) {
          schedule = generateDefaultSchedule();
          saveSchedules(provider.id, schedule);
        }
        provider.schedule = schedule;
      });
      resolve(providers);
    }, 1000);
  });
};

export const updateProviderSchedule = (providerId: string, schedule: Schedule[]): Promise<void> => {
  return new Promise((resolve) => {
    const provider = providers.find((p) => p.id === providerId);
    if (provider) {
      provider.schedule = schedule;
      saveSchedules(providerId, schedule); // Update local storage
      setTimeout(() => resolve(), 1000);
    }
  });
};

// Reservation Functions
const getStoredReservations = (): Reservation[] => {
  const storedReservations = localStorage.getItem('reservations');
  return storedReservations ? JSON.parse(storedReservations) : [];
};

const saveReservations = (reservations: Reservation[]) => {
  localStorage.setItem('reservations', JSON.stringify(reservations));
};

export const getReservations = (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getStoredReservations()), 1000);
  });
};

export const createReservation = (reservation: Reservation): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reservations = getStoredReservations();

    // Check for overlapping reservations excluding canceled ones
    const isOverlapping = reservations.some((res) => 
      res.providerId === reservation.providerId &&
      res.date === reservation.date &&
      res.confirmed && // Only consider confirmed reservations
      (
        (moment(`${reservation.date} ${res.startTime}`, 'YYYY-MM-DD HH:mm').isBefore(moment(`${reservation.date} ${reservation.endTime}`, 'YYYY-MM-DD HH:mm')) &&
        moment(`${reservation.date} ${res.endTime}`, 'YYYY-MM-DD HH:mm').isAfter(moment(`${reservation.date} ${reservation.startTime}`, 'YYYY-MM-DD HH:mm')))
      )
    );

    if (isOverlapping) {
      reject(new Error('Selected timeslot is already booked or blocked.'));
    } else {
      reservations.push(reservation);
      saveReservations(reservations);
      setTimeout(() => resolve(), 1000);
    }
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

export const cancelReservation = (reservationId: string): Promise<void> => {
  return new Promise((resolve) => {
    const reservations = getStoredReservations();
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      reservation.confirmed = false;
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