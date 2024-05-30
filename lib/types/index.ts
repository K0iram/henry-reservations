export interface Provider {
  id: string;
  name: string;
  schedule: Schedule[];
}

export interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
}

export interface Client {
  id: string;
  name: string;
}

export interface Reservation {
  id: string;
  providerId: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  confirmed: boolean;
  blockedUntil?: Date | null; //handles blocking logic