import ReservationForm from "../../components/ReservationForm";
import Reservations from "../../components/Reservations";

const Client = () => {
  return (
    <div className="flex flex-col p-10">
      <h1>Welcome to Henry</h1>
      <ReservationForm />
      <Reservations />
    </div>
  );
}
 
export default Client;