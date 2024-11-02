import { useColorFlowContext } from "../../../create-flow/CreateColorFlow";
import "./Balance.scss";
import { useCallback, MouseEvent } from "react";

interface Props {
  previewBalance: number;
  setPreviewBalance: (lightness: number) => void;
}

function Balance({ previewBalance, setPreviewBalance }: Props) {
  const { hue, saturation, balance, setBalance } = useColorFlowContext();

  const handleClick = useCallback(() => {
    setBalance(previewBalance);
    setPreviewBalance(previewBalance);
  }, [previewBalance, setBalance, setPreviewBalance]);

  const handleMove = useCallback(
    (event: MouseEvent) => {
      const mouseY = event.clientY;
      const windowHeight = window.innerHeight;
      const balance = Math.round(100 - (mouseY / windowHeight) * 100);
      setPreviewBalance(balance);
    },
    [setPreviewBalance]
  );

  const handleReset = useCallback(() => {
    setPreviewBalance(balance);
  }, [balance, setPreviewBalance]);

  return (
    <div className="Balance">
      <div
        className="Picker-Container"
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleReset}
      >
        <div
          className="Balance-Item"
          style={{
            backgroundColor: `hsl(${hue}, ${saturation}%, 50%)`,
            height: `${previewBalance}%`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default Balance;
