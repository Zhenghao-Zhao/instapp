export default function ListLoader() {
  return (
    <div className="w-full flex-1 flex flex-col">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="animate-pulse flex py-2 px-4">
          <div className="rounded-full bg-loader-primary size-comment-profile-image-size" />
          <div className="flex-1 space-y-3 pl-4">
            <div className="grid grid-cols-4">
              <div className="h-4 bg-loader-primary rounded-lg col-span-2" />
            </div>
            <div className="grid grid-cols-4">
              <div className="h-4 bg-loader-primary rounded-lg col-span-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
