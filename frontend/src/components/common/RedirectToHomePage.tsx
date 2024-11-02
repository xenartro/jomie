import { useEffect } from "react";

const RedirectToHomePage = () => {
  useEffect(() => {
    window.location.replace("/");
  }, []);
  return null;
};

export default RedirectToHomePage;
