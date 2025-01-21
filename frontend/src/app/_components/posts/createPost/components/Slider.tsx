import Dragbar from "@/app/_components/posts/createPost/components/DragBar";

export function Slider({
  title,
  scale,
  changeScale,
  maxScale,
  minScale,
  neutral,
}: {
  title: string;
  scale: number;
  changeScale: (scale: number) => void;
  maxScale: number;
  minScale: number;
  neutral: number;
}) {
  return (
    <div className="w-full h-fit shrink-0 group">
      <div className="flex justify-between">
        <p className="text-xl">{title}</p>
        <button
          className="opacity-0 group-hover:opacity-100 transition-all ease-out"
          onClick={() => changeScale(neutral)}
        >
          Reset
        </button>
      </div>
      <div className="flex w-full h-fit items-center">
        <Dragbar
          scale={scale}
          changeScale={changeScale}
          maxScale={maxScale}
          minScale={minScale}
        />
        <p className="w-6 mx-2 text-center">
          {Math.round(normalize(minScale, maxScale, 0, 100, scale))}
        </p>
      </div>
    </div>
  );
}

function normalize(
  atMin: number,
  atMax: number,
  toMin: number,
  toMax: number,
  val: number
) {
  return (val / (atMax - atMin)) * (toMax - toMin) + toMin;
}