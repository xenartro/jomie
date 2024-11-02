import { useColorFlowContext } from "../../../create-flow/CreateColorFlow";
import "./HueSaturation.scss";
import { useState, useEffect, useCallback, useRef } from "react";

const numberOfDivs = 28;

function HueSaturation() {
  const {
    hue: selecteHue,
    saturation: selectedSaturation,
    setHueSaturation,
  } = useColorFlowContext();
  const [saturation, setSaturation] = useState<number>(
    selectedSaturation || 50
  );
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentRef = pickerRef.current;
    if (!currentRef) {
      return;
    }

    const updateSaturation = (event: MouseEvent | TouchEvent) => {
      const mouseY =
        "clientY" in event ? event.clientY : event.touches[0].clientY;
      const windowHeight = window.innerHeight;
      const newSaturation = Math.round(100 - (mouseY / windowHeight) * 90); // Invert the saturation
      setSaturation(Math.max(10, Math.min(100, newSaturation))); // Ensure saturation is between 10% and 100%
    };

    const resetSaturation = () => {
      setSaturation(selectedSaturation || 50);
    };

    currentRef.addEventListener("mousemove", updateSaturation);
    currentRef.addEventListener("touchmove", updateSaturation);
    currentRef.addEventListener("mouseleave", resetSaturation);
    currentRef.addEventListener("touchend", resetSaturation);

    return () => {
      if (!currentRef) {
        return;
      }

      currentRef.removeEventListener("mousemove", updateSaturation);
      currentRef.removeEventListener("touchmove", updateSaturation);
      currentRef.removeEventListener("mouseleave", resetSaturation);
      currentRef.removeEventListener("touchend", resetSaturation);
    };
  }, [pickerRef, selectedSaturation]);

  const handleColorSelection = useCallback(
    (hue: number, saturation: number) => {
      setHueSaturation(hue, saturation);
    },
    [setHueSaturation]
  );

  return (
    <div className="HueSaturation">
      <div className="Picker-Container" ref={pickerRef}>
        <ColorBars
          numberOfBars={numberOfDivs}
          selectedHue={selecteHue}
          saturation={saturation}
          onClick={handleColorSelection}
        />
      </div>
    </div>
  );
}

interface ColorBarsPropsInterface {
  numberOfBars: number;
  selectedHue: number;
  saturation: number;
  onClick: (hue: number, saturation: number) => void;
}

const ColorBars = ({
  numberOfBars,
  saturation,
  onClick,
  selectedHue,
}: ColorBarsPropsInterface) => {
  const [bars] = useState(new Array(numberOfBars).fill(0));

  return (
    <>
      {bars.map((_, index) => {
        const hue = Math.round((360 / numberOfBars) * index); // Calculate hue based on index
        const backgroundColor = `hsl(${hue}, ${saturation}%, 50%)`; // Use HSL color model
        const selected = selectedHue === hue;
        return (
          <div
            key={index}
            className={`Hue-Item ${selected ? "--Selected" : ""}`}
            style={{ backgroundColor }}
            onClick={() => {
              onClick(hue, saturation);
            }}
          />
        );
      })}
    </>
  );
};

export default HueSaturation;
