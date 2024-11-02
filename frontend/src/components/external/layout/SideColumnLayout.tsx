import AnimatedBackground from "components/external/animatedBackground/AnimatedBackground";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function SideColumnLayout({ children }: Props) {
  return (
    <div className="Layout --SideColumn">
      <div className="LayoutColumn --Content">{children}</div>
      <div className="LayoutColumn --Background">
        <AnimatedBackground />
      </div>
    </div>
  );
}

export default SideColumnLayout;
