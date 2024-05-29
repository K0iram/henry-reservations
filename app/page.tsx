import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Welcome to Henry Reservations
      </h1>
      
      <div className="flex space-x-4 pt-10">
        <Button variant="outline" color="primary" asChild>
          <Link href="/providers">For Providers</Link>
        </Button>
        <Button variant="outline" color="secondary" asChild>
          <Link href="/clients">For Clients</Link>
        </Button>
      </div>
    </main>
  );
};