'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SVGProps } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Image from "next/image"
import henryIcon from "@/public/henry_icon.png"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { clearData } from "@/lib/utils"

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link className="flex items-center" href="/">
            <Image src={henryIcon} alt="Henry Reservations" width={32} height={32} />
            <span className="sr-only">Henry Reservations</span>
          </Link>
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>MK</AvatarFallback>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/10127008?v=4" alt="MK" />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <DropdownMenuItem asChild>
                  <Link href="/clients" className="block px-4 py-2 text-sm">My Reservations</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/providers" className="block px-4 py-2 text-sm">Provider Scheduler</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button onClick={clearData} className="block w-full text-left px-4 py-2 text-sm">
                    Reset All Data
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
