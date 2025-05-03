export default function IconLoader() {
  return (
    <div className="mx-auto w-40">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full shrink-0 bg-loader-primary h-8 w-8" />
        <div className="flex flex-col justify-between w-full">
          <div className="h-2 bg-loader-primary rounded" />
          <div className="h-2 bg-loader-primary rounded" />
        </div>
      </div>
    </div>
  );
}
