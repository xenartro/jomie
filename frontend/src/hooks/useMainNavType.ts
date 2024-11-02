import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export type NavType = "main" | "content" | "visuals";

export default function useMainNavType() {
  const [type, setType] = useState<NavType>("main");
  let location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("/content")) {
      setType("content");
    } else {
      if (location.pathname.includes("/visuals")) {
        setType("visuals");
      } else {
        setType("main");
      }
    }
  }, [location]);

  return type;
}
