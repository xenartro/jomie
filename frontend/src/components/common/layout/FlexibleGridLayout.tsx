import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function FlexibleGridLayout({ children }: Props) {
  return <div className="Layout --FlexibleGrid">{children}</div>;
}

export default FlexibleGridLayout;
