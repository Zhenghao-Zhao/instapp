import { FilterParams } from "@/app/_libs/vars/types";
import Slider from "./Slider";

export function EditPalette({
  filter,
  changeFilters,
}: {
  filter: FilterParams;
  changeFilters: (f: FilterParams) => void;
}) {
  const updateFilter = (filterName: string, val: number) => {
    changeFilters({ ...filter, [filterName]: val });
  };

  return (
    <div className="flex flex-col justify-around w-upload-caption h-full p-[20px] shrink-0">
      <Slider
        title={"Brightness"}
        scale={filter.brightness}
        changeScale={(scale) => updateFilter("brightness", scale)}
        minScale={0}
        maxScale={2}
        neutral={1}
      />
      <Slider
        title={"Contrast"}
        scale={filter.contrast}
        changeScale={(scale) => updateFilter("contrast", scale)}
        minScale={0}
        maxScale={2}
        neutral={1}
      />
      <Slider
        title={"Saturation"}
        scale={filter.saturation}
        changeScale={(scale) => updateFilter("saturation", scale)}
        minScale={0}
        maxScale={2}
        neutral={1}
      />
      <Slider
        title={"Sepia"}
        scale={filter.sepia}
        changeScale={(scale) => updateFilter("sepia", scale)}
        minScale={0}
        maxScale={1}
        neutral={0}
      />
      <Slider
        title={"Grayscale"}
        scale={filter.grayscale}
        changeScale={(scale) => updateFilter("grayscale", scale)}
        minScale={0}
        maxScale={1}
        neutral={0}
      />
    </div>
  );
}
