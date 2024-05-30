# Henry Reservations App

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Mock API

The mock API is defined in `lib/mockApi.ts` and provides the following functions:

### Providers
* `getProviders()`: Fetches the list of providers.
* `updateProviderSchedule(providerId, schedule)`: Updates the schedule for a provider.

### Reservations
* `getReservations()`: Fetches the list of reservations.
* `createReservation(reservation)`: Creates a new reservation.
* `confirmReservation(reservationId)`: Confirms a reservation.
* `cancelReservation(reservationId)`: Cancels a reservation.
* `unblockExpiredReservations()`: Unblocks reservations that have expired.

## Features

### Setting Provider Schedules
To set a provider's schedule, navigate to the Providers page and select a provider from the dropdown. Adjust the schedule as needed and click "Update Schedule".

### Making Reservations
To make a reservation, navigate to the Clients page. Select a provider, choose a date and time, and click "Reserve". Confirm the reservation within 30 minutes to avoid it being blocked.

### Viewing Reservations
Clients can view their reservations on the Clients page. Providers can see their schedules and reservations on the Providers page.
