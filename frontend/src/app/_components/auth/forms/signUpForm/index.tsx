"use client";
import { useRegistration } from "@/app/_api/hooks/authentication";
import SubmitButton from "@/app/_components/ui/buttons/submitButton";
import { signUpSchema } from "@/app/_libs/types";
import { useRef, useState } from "react";

export type SignUpInfo = {
  email: string;
  password: string;
  username: string;
  name: string;
};

export function SignUpForm() {
  const [signUpInfo, setSignUpInfo] = useState<SignUpInfo>({
    email: "",
    password: "",
    username: "",
    name: "",
  });
  const [showUsernameValidation, setShowUsernameValidation] = useState(false);
  const [showNameValidation, setShowNameValidation] = useState(false);
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validation = signUpSchema.safeParse({
    email: signUpInfo.email,
    password: signUpInfo.password,
    username: signUpInfo.username,
    name: signUpInfo.name,
  });
  const isValid = validation.success;
  const errors = validation.error?.flatten();
  const usernameError = errors && errors.fieldErrors.username;
  const nameError = errors && errors.fieldErrors.name;
  const emailError = errors && errors.fieldErrors.email;
  const passwordError = errors && errors.fieldErrors.password;
  const {
    mutation: { mutate },
    errorMessage,
  } = useRegistration();

  // if (formState.message === "Success") {
  //   return <VerificationForm email={signUpInfo.email} />;
  // }
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setSignUpInfo({
      ...signUpInfo,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate(formData);
  };

  return (
    <div className="w-[450px]">
      <div className="flex items-center justify-between">
        <p className="text-[25px]">Sign up</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-2"
        ref={formRef}
      >
        <label className="mt-2">
          <span>Username</span>
          <input
            value={signUpInfo.username}
            className="bg-btn-primary w-full p-2 rounded-md"
            name="username"
            onChange={handleChange}
            onBlur={() => setShowUsernameValidation(true)}
            autoComplete="on"
          />
        </label>
        {showUsernameValidation && usernameError && (
          <p className="text-red-500">{usernameError}</p>
        )}
        <label className="mt-2">
          <span>Name</span>
          <input
            value={signUpInfo.name}
            className="bg-btn-primary w-full p-2 rounded-md"
            name="name"
            onChange={handleChange}
            onBlur={() => setShowNameValidation(true)}
            autoComplete="on"
          />
        </label>
        {showNameValidation && nameError && (
          <p className="text-red-500">{nameError}</p>
        )}
        <label className="mt-2">
          <span>Email</span>
          <input
            type="email"
            value={signUpInfo.email}
            className="bg-btn-primary w-full p-2 rounded-md"
            name="email"
            onChange={handleChange}
            onBlur={() => setShowEmailValidation(true)}
            autoComplete="on"
          />
        </label>
        {showEmailValidation && emailError && (
          <p className="text-red-500">{emailError}</p>
        )}
        <label className="mt-2">
          <span>Password</span>
          <input
            type="password"
            value={signUpInfo.password}
            className="bg-btn-primary w-full p-2 rounded-md"
            name="password"
            onChange={handleChange}
            onBlur={() => setShowPasswordValidation(true)}
            autoComplete="on"
          />
        </label>
        {showPasswordValidation && passwordError && (
          <p className="text-red-500">{passwordError}</p>
        )}
        <SubmitButton title="Submit" disabled={!isValid} className="mt-4" />
      </form>
      {<p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
