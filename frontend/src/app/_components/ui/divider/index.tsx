import { twMerge } from "tailwind-merge";

export default function Divider({
  className,
  ...props
}: JSX.IntrinsicElements["hr"]) {
  return <hr className={twMerge("w-full my-2", className)} {...props} />;
}
