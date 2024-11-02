import "./CreateFlow.scss";
import { useCallback, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { Palette, PaletteColor, getPalette } from "services/palette";

export interface HSLPalette {
  colors: PaletteColor[];
  randomComponent: number;
}

const CreateFlow = () => {
  const [id, setId] = useState<number | undefined>(undefined);
  const [hue, setHue] = useState<number | undefined>();
  const [saturation, setSaturation] = useState<number | undefined>();
  const [balance, setBalance] = useState(50);
  const [selectedPalette, setSelectedPalette] = useState<
    HSLPalette | undefined
  >(undefined);
  const navigate = useNavigate();

  const setHueSaturation = useCallback(
    (selectedHue: number, selectedSaturation: number) => {
      setSelectedPalette(undefined);
      if (hue === selectedHue && saturation === selectedSaturation) {
        setHue(undefined);
        setSaturation(undefined);
        return;
      }
      setHue(selectedHue);
      setSaturation(selectedSaturation);
    },
    [hue, saturation]
  );

  const edit = useCallback(
    (id: number) => {
      setId(id);
      const promise = getPalette(id);
      promise.then((palette: Palette | null) => {
        if (!palette) {
          return navigate("/app/visuals/palette");
        }
        setSelectedPalette({
          colors: palette.palette,
          randomComponent: palette.r,
        });
        setHue(palette.hue);
        setSaturation(palette.saturation);
      });
      return promise;
    },
    [navigate]
  );

  const setPalette = useCallback(
    (newPalette?: HSLPalette) => {
      setSelectedPalette(newPalette);
    },
    [setSelectedPalette]
  );

  return (
    <div className="CreateFlow Layout --SideColumn">
      <Outlet
        context={{
          setHueSaturation,
          hue,
          saturation,
          balance,
          setBalance,
          selectPalette: setPalette,
          selectedPalette,
          id,
          edit,
        }}
      />
    </div>
  );
};

interface ColorFlowContextInterface {
  setHueSaturation: (hue: number, saturation: number) => void;
  hue: number;
  saturation: number;
  balance: number;
  setBalance: (lightness: number) => void;
  selectPalette: (newPalette?: HSLPalette) => void;
  selectedPalette?: HSLPalette;
  edit: (id: number) => void;
  id?: number;
}

export function useColorFlowContext() {
  return useOutletContext<ColorFlowContextInterface>();
}

export default CreateFlow;
