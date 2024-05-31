import ReservationForm from "../../components/Client/ReservationForm";
import Reservations from "../../components/Client/Reservations";

/**
 * This is the main client component for the Henry Reservations application.
 * It renders the reservation form and the list of reservations.
 *
 * Components:
 * - ReservationForm: A form to add new reservations.
 * - Reservations: A list of existing reservations.
 */
const Client = () => {
  return (
    <div className="flex flex-col p-20 gap-4 sm:py-20 px-5">
      <h1 className="text-2xl font-bold">Welcome to Henry</h1>
      <ReservationForm />
      <Reservations />
    </div>
  );
}
 
export default Client;