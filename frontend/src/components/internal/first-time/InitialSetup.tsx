import "./InitialSetup.scss";
import Header from "components/external/layout/header/Header";
import CenterLayout from "components/internal/layout/CenterLayout";
import { Dispatch, SetStateAction, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { InitialSetupInterface } from "services/initialSetup";

export interface SetupDataContextInterface {
  data: InitialSetupInterface;
  set: Dispatch<SetStateAction<InitialSetupInterface>>;
}

const InitialSetup = () => {
  const [setupData, setSetupData] = useState<InitialSetupInterface>({});
  return (
    <div className="InitialSetup">
      <Header version="centerLayout" />
      <CenterLayout>
        <Outlet context={{ data: setupData, set: setSetupData }} />
      </CenterLayout>
    </div>
  );
};

export function useSetupData() {
  return useOutletContext<SetupDataContextInterface>();
}

export default InitialSetup;
