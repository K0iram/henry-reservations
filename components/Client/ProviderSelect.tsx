import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem } from '../ui/select';
import { Provider } from '@/lib/types';

interface ProviderSelectProps {
  providers: Provider[];
  selectedProvider: string;
  setSelectedProvider: (providerId: string) => void;
}

/**
 * ProviderSelect is a component that renders a dropdown select menu for providers.
 * 
 * Props:
 * - providers: An array of Provider objects to be displayed in the dropdown.
 * - selectedProvider: The currently selected provider's ID.
 * - setSelectedProvider: A function to update the selected provider's ID.
 * 
 * The component uses the Select, SelectTrigger, SelectContent, and SelectItem components
 * from the 'ui/select' module to create the dropdown menu. When a provider is selected,
 * the setSelectedProvider function is called with the selected provider's ID.
 */
const ProviderSelect: React.FC<ProviderSelectProps> = ({ providers, selectedProvider, setSelectedProvider }) => {
  return (
    <Select onValueChange={setSelectedProvider} value={selectedProvider}>
      <SelectTrigger>
        <span>{selectedProvider ? providers.find(p => p.id === selectedProvider)?.name : 'Select Provider'}</span>
      </SelectTrigger>
      <SelectContent>
        {providers.map(provider => (
          <SelectItem key={provider.id} value={provider.id}>
            {provider.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProviderSelect;


