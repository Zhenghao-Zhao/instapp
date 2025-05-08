import Dragbar from "./DragBar";

export default function Slider({
  title,
  currentValue,
  changeValue,
  maxValue,
  minValue,
  neutralValue,
}: {
  title: string;
  currentValue: number;
  changeValue: (scale: number) => void;
  maxValue: number;
  minValue: number;
  neutralValue: number;
}) {
  return (
    <div className="w-full h-fit shrink-0 group">
      <div className="flex justify-between">
        <p className="text-xl">{title}</p>
        <button
          className="opacity-0 group-hover:opacity-100 transition-all ease-out"
          onClick={() => changeValue(neutralValue)}
        >
          Reset
        </button>
      </div>
      <div className="flex w-full h-fit items-center">
        <Dragbar
          currentValue={currentValue}
          changeValue={changeValue}
          maxValue={maxValue}
          minValue={minValue}
        />
        <p className="w-[40px] text-right">
          {Math.round(normalize(minValue, maxValue, 0, 100, currentValue))}
        </p>
      </div>
    </div>
  );
}

// convert between scales, e.g. 0.5 between 0, 1 to 50 between 0, 100
function normalize(
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
  val: number,
) {
  return (val / (fromMax - fromMin)) * (toMax - toMin) + toMin;
}
