"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthDialogStore } from "@/store/auth-dialog-store";

export function SignInDialog() {
  const { signInOpen, openSignIn, closeSignIn } = useAuthDialogStore();

  return (
    <>
      <Button variant="outline" onClick={openSignIn}>
        Sign In
      </Button>
      <Dialog open={signInOpen} onOpenChange={(open) => !open && closeSignIn()}>
        <DialogContent
          showCloseButton={false}
          className="p-0 border-0 bg-transparent shadow-none w-fit max-w-fit focus:outline-none"
        >
          <DialogHeader>
            <DialogTitle className="sr-only">Sign In</DialogTitle>
            <DialogDescription className="sr-only">Sign In</DialogDescription>
          </DialogHeader>
          <SignIn routing="virtual" />
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SignUpDialog() {
  const { signUpOpen, openSignUp, closeSignUp } = useAuthDialogStore();

  return (
    <>
      <Button onClick={openSignUp}>Sign Up</Button>
      <Dialog open={signUpOpen} onOpenChange={(open) => !open && closeSignUp()}>
        <DialogHeader>
          <DialogTitle className="sr-only">Sign Up</DialogTitle>
          <DialogDescription className="sr-only">Sign Up</DialogDescription>
        </DialogHeader>
        <DialogContent
          showCloseButton={false}
          className="p-0 border-0 bg-transparent shadow-none w-fit max-w-fit focus:outline-none"
        >
          <DialogHeader>
            <DialogTitle className="sr-only">Sign Up</DialogTitle>
            <DialogDescription className="sr-only">Sign Up</DialogDescription>
          </DialogHeader>
          <SignUp routing="virtual" />
        </DialogContent>
      </Dialog>
    </>
  );
}
