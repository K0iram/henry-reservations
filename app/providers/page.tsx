import SetSchedule from "@/components/provider/SetSchedule";

/**
 * This is the main provider page component for the Henry Reservations application.
 * It renders the SetSchedule component which allows providers to set their schedules.
 *
 * Components:
 * - SetSchedule: A form to set provider schedules.
 */
const ProviderPage = () => {
  return ( 
    <div className="flex flex-col p-20 gap-4 sm:py-20 px-5">
      <h1 className="text-2xl font-bold">Set Provider Schedules</h1>
      <SetSchedule />
    </div>
   );
}
 
export default ProviderPage;