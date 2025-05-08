import { FilterParams } from "@/app/_libs/vars/types";
import Slider from "./Slider";

export function EditPalette({
  filter,
  changeFilters,
}: {
  filter: FilterParams;
  changeFilters: (f: FilterParams) => void;
}) {
  const updateFilterVal = (filterName: string, val: number) => {
    changeFilters({ ...filter, [filterName]: val });
  };

  return (
    <div className="flex flex-col justify-around w-upload-menu-width h-full p-[20px] shrink-0">
      <Slider
        title={"Brightness"}
        currentValue={filter.brightness}
        changeValue={(scale) => updateFilterVal("brightness", scale)}
        minValue={0}
        maxValue={2}
        neutralValue={1}
      />
      <Slider
        title={"Contrast"}
        currentValue={filter.contrast}
        changeValue={(scale) => updateFilterVal("contrast", scale)}
        minValue={0}
        maxValue={2}
        neutralValue={1}
      />
      <Slider
        title={"Saturation"}
        currentValue={filter.saturation}
        changeValue={(scale) => updateFilterVal("saturation", scale)}
        minValue={0}
        maxValue={2}
        neutralValue={1}
      />
      <Slider
        title={"Sepia"}
        currentValue={filter.sepia}
        changeValue={(scale) => updateFilterVal("sepia", scale)}
        minValue={0}
        maxValue={1}
        neutralValue={0}
      />
      <Slider
        title={"Grayscale"}
        currentValue={filter.grayscale}
        changeValue={(scale) => updateFilterVal("grayscale", scale)}
        minValue={0}
        maxValue={1}
        neutralValue={0}
      />
    </div>
  );
}
