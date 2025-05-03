export enum ThrobberSize {
  SMALL = 20,
  MEDIUM = 30,
  LARGE = 45,
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
