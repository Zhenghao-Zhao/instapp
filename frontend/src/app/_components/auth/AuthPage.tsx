"use client";
import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="font-bold text-6xl mb-[60px]">
        Welcome to the Blue App
      </div>
      <div className={`bg-background-primary flex flex-col rounded-md p-4`}>
        <div className="border-b pb-4">
          {isSignUp && <SignUpForm />}
          {!isSignUp && <SignInForm />}
        </div>
        <button
          onClick={() => setIsSignUp((prev) => !prev)}
          className="mt-2 hover:underline"
        >
          <p>
            {isSignUp && "Already have an account? Sign in"}
            {!isSignUp && "Don't have an account? Sign up"}
          </p>
        </button>
      </div>
    </div>
  );
}
