import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

/**
 * Home is the main component that renders the home page.
 * 
 * The component uses the Card and Button components to display a welcome message and a set of links to navigate to the different sections.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-20">
      <h1 className="scroll-m-20 text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
        Welcome to Henry Reservations
      </h1>
      <p className="scroll-m-20 text-base sm:text-lg text-center px-4 sm:px-24">
        {`This is a simple platform for booking and confirming reservations. Due to the time constraints, this platform combines 2 separate UI's into one. Use the links below to navigate to the different sections.`}
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-10">
        <Card className="flex flex-col justify-between max-w-sm w-full">
          <CardHeader>
            <CardTitle>For Providers</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription>
              Click below to go through the process of setting up the schedule for your providers.
            </CardDescription>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" color="primary" asChild>
              <Link href="/providers">Go to Providers</Link>
            </Button>
          </div>
        </Card>
        
        <Card className="flex flex-col justify-between max-w-sm w-full">
          <CardHeader>
            <CardTitle>For Clients</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription>
              Click below to go through the process of booking and confirming reservations.
            </CardDescription>
          </CardContent>
          <div className="p-6 pt-0">
            <Button variant="outline" color="secondary" asChild>
              <Link href="/clients">Go to Clients</Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
};