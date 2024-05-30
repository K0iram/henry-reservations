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

## Persistence

### Local Storage
Currently, the app uses local storage to persist data such as provider schedules and reservations. This approach is suitable for development and testing purposes because it is simple to implement and does not require a backend server.

### Limitations
- **Data Loss**: Data is stored only in the browser, so it will be lost if the user clears their browser data or accesses the app from a different device.
- **Scalability**: Local storage is not suitable for handling large amounts of data or multiple users.

### Making the App Production-Ready
To make this app ready for production, consider the following improvements:
1. **Backend Integration**: Implement a backend server using Node.js, Express, or another framework to handle data persistence. Use a database to store provider schedules and reservations.
2. **Authentication**: Add user authentication to ensure that only authorized users can make or view reservations.
3. **User Separation**: Separate the client and provider views so that clients can only view their own reservations and providers can only view their own schedules.
4. **Error Handling**: Improve error handling throughout the app to provide better feedback to users and handle edge cases gracefully.
5. **Testing**: Implement comprehensive unit and integration tests to ensure the app's reliability and stability.

## Notes
- The app assumes that the 'client' is signed in
- The app allows any provider to update their schedule
- The app does not have any tests