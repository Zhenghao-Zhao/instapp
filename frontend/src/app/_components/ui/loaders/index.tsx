export enum ThrobberSize {
  SMALL = 20,
  MEDIUM = 30,
  LARGE = 45,
}

export function IconLoader() {
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

export function ImageLoader() {
  return (
    <div className="bg-black w-full h-full">
      <div className="animate-pulse w-full h-full bg-loader-primary" />
    </div>
  );
}

export function GuideSectionLoader() {
  return (
    <div className="rounded-md p-4 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-3 py-1">
          <div className="h-6 bg-loader-primary rounded" />
          <div className="h-6 bg-loader-primary rounded" />
        </div>
      </div>
    </div>
  );
}

export function ListLoader() {
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

export default function Throbber({
  size = ThrobberSize.SMALL,
}: {
  size?: number | ThrobberSize;
}) {
  function Blade({ index = 0, delay = 60, width = 2 }) {
    return (
      <div
        className={`h-1/2 absolute left-1/2`}
        style={{
          transform: `rotate(${30 * index}deg)`,
          transformOrigin: "bottom",
          width,
        }}
      >
        <div
          className="absolute top-0 h-[60%] w-full rounded-lg"
          style={{
            animation: `spinner ${12 * delay}ms ease-in-out ${
              delay * index - 1000
            }ms infinite`,
          }}
        />
      </div>
    );
  }
  return (
    <div
      className="relative m-auto"
      style={{
        width: size + "px",
        height: size + "px",
      }}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <Blade key={i} index={i} width={size / 10} />
      ))}
    </div>
  );
}

export function Spinner({ color = "#00a1ff" }: { color?: string }) {
  return (
    <div className="absolute w-fit h-fit bg-transparent rotate-[-90deg]">
      <svg
        className="relative w-[150px] h-[150[x]"
        style={{ animation: "rotate 1s linear infinite" }}
      >
        <circle
          cx="70"
          cy="70"
          r="70"
          className="w-full h-full fill-none stroke-[10] translate-x-[5px] translate-y-[5px]"
          style={{
            stroke: color,
            strokeLinecap: "round",
            strokeDasharray: 440,
            strokeDashoffset: 440,
            animation: "strokeOffset 1s linear infinite",
          }}
        ></circle>
      </svg>
    </div>
  );
}

