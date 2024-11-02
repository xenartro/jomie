import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function CenterLayout({ children }: Props) {
  return (
    <div className="Layout --Center">
      <div className="Layout_Center_Container">{children}</div>
    </div>
  );
}

export default CenterLayout;
