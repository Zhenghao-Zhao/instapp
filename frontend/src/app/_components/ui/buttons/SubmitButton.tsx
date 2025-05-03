import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";
import { twMerge } from "tailwind-merge";
import Throbber from "../loaders/Throbber";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  className?: string;
  disabled?: boolean;
}

export default function SubmitButton({
  title,
  className,
  disabled = false,
  ...props
}: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={twMerge(
        "bg-blue-500 h-[45px] rounded-md disabled:bg-gray-400 flex items-center justify-center",
        className,
      )}
      disabled={disabled || pending}
      {...props}
    >
      {pending ? <Throbber size={20} /> : title}
    </button>
  );
}
