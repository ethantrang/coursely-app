"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-orange"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <nav className="hidden md:flex space-x-4">
            <Link className="text-sm font-medium text-charcoal hover:underline" href="#">
              Courses
            </Link>
            <Link className="text-sm font-medium text-charcoal hover:underline" href="#">
              About Us
            </Link>
            <Link className="text-sm font-medium text-charcoal hover:underline" href="#">
              Contact
            </Link>
          </nav>
        </div>
        <SignedOut>
          <SignInButton>
            <Button variant="secondary" className="text-sm font-medium text-black">
              Sign In →
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/app">
            <Button variant="secondary" className="text-sm font-medium text-black">
              Discover courses →
            </Button>
          </Link>
        </SignedIn>
      </header>
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-charcoal">
          Advance Your Career
          <br />
          with Top Executive Education
        </h1>
        <p className="text-xl text-charcoal mb-8 max-w-2xl">
          Unlock high-impact courses and programs for leaders. Elevate your skills with industry experts and shape your success.
        </p>
        <div className="flex space-x-4">
          <Link href="/chatbot">
            <SignInButton>
              <Button size="lg" className="bg-orange text-white hover:bg-orange/90">
                Let's determine your path
              </Button>
            </SignInButton>
          </Link>
        </div>
      </main>
    </div>
  )
}