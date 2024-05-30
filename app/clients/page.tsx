import ReservationForm from "../../components/ReservationForm";
import Reservations from "../../components/Reservations";

const Client = () => {
  return (
    <div className="flex flex-col p-20 gap-4">
      <h1 className="text-2xl font-bold">Welcome to Henry</h1>
      <ReservationForm />
      <Reservations />
    </div>
  );
}
 
export default Client;