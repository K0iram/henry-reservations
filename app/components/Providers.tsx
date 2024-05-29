'use client';
import React, { useEffect, useState } from 'react';
import { getProviders } from '../mockApi';
import { Provider } from '../types';

const Providers: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  return (
    <div>
      <h2>Providers</h2>
      <ul>
        {providers.map((provider) => (
          <li key={provider.id}>
            {provider.name}
            <ul>
              {provider.schedule.map((slot, index) => (
                <li key={index}>
                  {slot.date} from {slot.startTime} to {slot.endTime}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Providers;