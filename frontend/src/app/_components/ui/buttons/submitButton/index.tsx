import { twMerge } from "tailwind-merge";
import Throbber from "../../loaders";
import { useFormStatus } from "react-dom";
import { ButtonHTMLAttributes } from "react";

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
      className={twMerge(
        "bg-blue-500 h-[45px] rounded-md text-white disabled:bg-gray-400 flex items-center justify-center",
        className,
      )}
      disabled={disabled || pending}
      {...props}
    >
      {pending ? <Throbber size={20} /> : title}
    </button>
  );
}
