import Providers from './components/Providers';
import Reservations from './components/Reservations';
import ReservationForm from './components/ReservationForm';
import SetSchedule from './components/SetSchedule';
import { providers } from './mockApi';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Henry Reservations</h1>
      <Providers />
      <ReservationForm />
      <Reservations />

      <SetSchedule provider={providers[0]} />
    </main>
  );
}