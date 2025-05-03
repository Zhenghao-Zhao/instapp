export default function Spinner({ color = "#00a1ff" }: { color?: string }) {
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
