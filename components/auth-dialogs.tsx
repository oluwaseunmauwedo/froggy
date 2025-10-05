"use client"

import { SignIn, SignUp } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function SignInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="p-0 border-0 bg-transparent shadow-none max-w-fit">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <SignIn routing="virtual" />
      </DialogContent>
    </Dialog>
  )
}

export function SignUpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Sign Up</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="p-0 border-0 bg-transparent shadow-none max-w-fit">
        <DialogTitle className="sr-only">Sign Up</DialogTitle>
        <SignUp routing="virtual" />
      </DialogContent>
    </Dialog>
  )
}
