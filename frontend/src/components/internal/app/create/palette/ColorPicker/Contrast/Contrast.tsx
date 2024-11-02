import {
  HSLPalette,
  useColorFlowContext,
} from "../../../create-flow/CreateColorFlow";
import "./Contrast.scss";
import { useCallback, useState } from "react";
import { PaletteColor, generatePalette } from "services/palette";

const numberOfDivs = 4;

function Contrast({ randomComponent }: { randomComponent: number }) {
  const { hue, saturation, selectPalette, selectedPalette } =
    useColorFlowContext();
  const handleClick = useCallback(
    (palette: PaletteColor[]) => {
      selectPalette({
        colors: palette,
        randomComponent,
      });
    },
    [randomComponent, selectPalette]
  );

  return (
    <div className="Contrast">
      <div className="Picker-Container">
        <ContrastPicker
          hue={hue}
          saturation={saturation}
          amount={numberOfDivs}
          randomComponent={randomComponent}
          onClick={handleClick}
          selectedPalette={selectedPalette}
        />
      </div>
    </div>
  );
}

interface ContrastPickerInterface {
  hue: number;
  saturation: number;
  amount: number;
  randomComponent: number;
  onClick(palette: PaletteColor[]): void;
  selectedPalette?: HSLPalette;
}

const ContrastPicker = ({
  hue,
  saturation,
  amount,
  randomComponent,
  onClick,
  selectedPalette,
}: ContrastPickerInterface) => {
  const [previews] = useState(new Array(amount).fill(0));

  return previews.map((_: number, index: number) => {
    const palette = generatePalette(
      hue,
      saturation,
      randomComponent,
      index + 1
    );
    const selected =
      selectedPalette?.colors.length === palette.length &&
      selectedPalette.randomComponent === randomComponent;
    return (
      <div
        key={index}
        className={`Contrast-Item ${selected ? "--Selected" : ""}`}
      >
        {palette.map(({ hue, saturation }, nestedIndex) => {
          const nestedBackgroundColor = `hsl(${hue}, ${saturation}%, 50%)`;
          return (
            <div
              key={nestedIndex}
              className="Contrast-Item__Nested"
              style={{ backgroundColor: nestedBackgroundColor }}
              onClick={() => onClick(palette)}
            />
          );
        })}
      </div>
    );
  });
};

export default Contrast;
