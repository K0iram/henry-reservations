import SetSchedule from "../../components/SetSchedule";

const ProviderPage = () => {
  return ( 
    <div className="flex flex-col p-20 gap-4">
      <h1 className="text-2xl font-bold">Set Provider Schedules</h1>
      <SetSchedule />
    </div>
   );
}
 
export default ProviderPage;