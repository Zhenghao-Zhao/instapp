import Spinner from "../_components/ui/loaders/Spinner";

export default function Loading() {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-background-primary">
      <Spinner />
    </div>
  );
}
