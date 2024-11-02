import { useAppContext } from "./App";
import "./Preview.scss";
import { useEffect, useState } from "react";
import { getHomepageFeaturedNickname } from "services/preview";

const domain = import.meta.env.DEV
  ? "http://localhost:3000"
  : import.meta.env.VITE_APP_URL;

interface Props {
  published?: boolean;
  section?: string;
  preview?: string;
}

const Preview = ({ published = true, section = "", preview = "" }: Props) => {
  const params = section ? `&section=${section}&${preview}#${section}` : "";
  const { previewKey } = useAppContext();
  return (
    <div className="Preview" key={previewKey}>
      <iframe
        width="100%"
        height="100%"
        src={`${domain}/render?published=${published ? 1 : 0}${params}`}
        title="Preview"
        id="preview"
      />
    </div>
  );
};

export const PublicPreview = () => {
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    getHomepageFeaturedNickname().then((account) => setNickname(account));
  }, []);

  if (!nickname) {
    return null;
  }

  return (
    <div className="Preview">
      <iframe
        width="100%"
        height="100%"
        src={`${domain}/${nickname}`}
        title="Preview"
        id="preview"
      />
    </div>
  );
};

export default Preview;
