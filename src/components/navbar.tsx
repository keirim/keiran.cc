'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Upload, User, BarChart2, Menu, X } from 'lucide-react'
import { ThemeSwitcher } from '@/components/theme-switcher'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const NavItems = () => (
    <>
      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
        <Link href="/"><Upload className="mr-2 h-4 w-4" /> Upload</Link>
      </Button>
      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
        <Link href="/bio"><User className="mr-2 h-4 w-4" /> Bio</Link>
      </Button>
      <Button variant="ghost" asChild onClick={() => setIsOpen(false)}>
        <Link href="/stats"><BarChart2 className="mr-2 h-4 w-4" /> Stats</Link>
      </Button>
    </>
  )

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-2xl">AnonHost</Link>
        <div className="hidden md:flex items-center space-x-4">
          <NavItems />
          <ThemeSwitcher />
        </div>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 mt-4">
                <NavItems />
                <ThemeSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
