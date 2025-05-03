import { twMerge } from "tailwind-merge";
export default function Separator({ className }: { className?: string }) {
  return (
    <div className={twMerge("flex justify-center items-center", className)}>
      <div className="border-t grow" />
    </div>
  );
}
