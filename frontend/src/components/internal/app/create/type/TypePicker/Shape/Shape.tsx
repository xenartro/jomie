import { useTypeFlowContext } from "../../../create-flow/CreateTypeFlow";
import "./Shape.scss";
import { useCallback } from "react";
import { fontFamilies } from "services/font";

function Shape() {
  const { mainFamily, setMainFamily } = useTypeFlowContext();

  const handleItemClick = useCallback(
    (family: string) => {
      setMainFamily(family);
    },
    [setMainFamily]
  );

  return (
    <div className="Shape">
      <div className="Picker-Container">
        {fontFamilies.map((family) => (
          <button
            className={`Shape-Item ${
              mainFamily === family ? "--selected" : ""
            }`}
            style={{ fontFamily: family }}
            key={family}
            onClick={() => handleItemClick(family)}
          >
            Aa
            {mainFamily === family && (
              <div className="SelectedBadge">Selected</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Shape;
