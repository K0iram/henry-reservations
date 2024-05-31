import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { Provider } from '../../lib/types';

interface ScheduleProviderSelectProps {
  providers: Provider[];
  selectedProvider: Provider | undefined;
  onProviderChange: (provider: Provider) => void;
}

/**
 * ScheduleProviderSelect is a component that renders a dropdown select menu for providers.
 * 
 * Props:
 * - providers: An array of Provider objects to be displayed in the dropdown.
 * - selectedProvider: The currently selected provider's ID.
 * - setSelectedProvider: A function to update the selected provider's ID.
 */
const ScheduleProviderSelect: React.FC<ScheduleProviderSelectProps> = ({ providers, selectedProvider, onProviderChange }) => {
  return (
    <Select onValueChange={(value) => onProviderChange(providers.find(p => p.id === value)!)}>
      <SelectTrigger>
        <span>{selectedProvider ? selectedProvider.name : 'Select Provider'}</span>
      </SelectTrigger>
      <SelectContent>
        {providers.map((provider) => (
          <SelectItem key={provider.id} value={provider.id}>
            {provider.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ScheduleProviderSelect;