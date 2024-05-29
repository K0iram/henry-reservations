import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SVGProps } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Image from "next/image"
import  henryIcon from "@/public/henry_icon.png"

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link className="flex items-center" href="/">
            <Image src="/henry_icon.png" alt="Henry Reservations" width={32} height={32} />
            <span className="sr-only">Henry Reservations</span>
          </Link>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>MK</AvatarFallback>
              <AvatarImage src="https://avatars.githubusercontent.com/u/10127008?v=4" alt="MK" />
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  )
}