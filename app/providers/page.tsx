import SetSchedule from "../../components/SetSchedule";
import { providers } from "../../lib/mockApi";

const ProviderPage = () => {
  return ( 
    <div className="flex flex-col p-20">
      <SetSchedule provider={providers[0]} />
    </div>
   );
}
 
export default ProviderPage;