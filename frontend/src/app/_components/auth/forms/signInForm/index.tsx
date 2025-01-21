import { signIn } from "@/app/_actions";
import SubmitButton from "@/app/_components/ui/buttons/submitButton";
import { signInSchema } from "@/app/_libs/types";
import { useRef, useState } from "react";
import { useFormState } from "react-dom";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailValidation, setShowEmailValidation] = useState(false);
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [formState, action] = useFormState(signIn, {
    error: null,
    message: "",
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const validation = signInSchema.safeParse({ email, password });
  const isValid = validation.success;
  const errors = validation.error?.flatten();
  const emailError = errors && errors.fieldErrors.email;
  const passwordError = errors && errors.fieldErrors.password;

  return (
    <div className="w-[450px]">
      <div className="flex items-center justify-between">
        <p className="text-[25px]">Sign in</p>
      </div>
      <form action={action} className="flex flex-col gap-2 mt-2" ref={formRef}>
        <label className="mt-2">
          <span>Email</span>
          <input
            type="email"
            value={email}
            className="bg-btn-primary w-full p-2 rounded-md"
            name="email"
            onChange={handleEmailChange}
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
            value={password}
            className="bg-btn-primary w-full p-2 rounded-md"
            name="password"
            onChange={handlePasswordChange}
            onBlur={() => setShowPasswordValidation(true)}
            autoComplete="on"
          />
        </label>
        {showPasswordValidation && passwordError && (
          <p className="text-red-500">{passwordError}</p>
        )}
        <SubmitButton
          title="Submit"
          disabled={!isValid}
          onClick={() => {
            if (!formRef.current) return;
            formRef.current.requestSubmit();
          }}
          className="mt-4"
        />
      </form>
      {formState.error && <p className="text-red-500">{formState.error}</p>}
    </div>
  );
}
