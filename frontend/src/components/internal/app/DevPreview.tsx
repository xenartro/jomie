import "./DevPreview.scss";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPreview, getDraftPreview } from "services/preview";

const DevPreview = () => {
  const [params] = useSearchParams();
  function fetch() {
    const contentPreview = [];
    if (params.get("layout")) {
      contentPreview.push(`layout=${params.get("layout")}`);
    }
    if (params.get("effect")) {
      contentPreview.push(`effect=${params.get("effect")}`);
    }
    if (params.get("published") === "0") {
      return getDraftPreview(params.get("section"), contentPreview);
    }

    return getPreview(params.get("section"), contentPreview);
  }
  const {
    isFetching,
    error,
    data: preview,
  } = useQuery({
    queryKey: ["preview"],
    queryFn: fetch,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000,
  });

  if (isFetching) {
    return <div>Loading</div>;
  }

  // TODO: log
  if (error || !preview) {
    return <div>Error loading preview</div>;
  }

  return (
    <div id="preview-reset" dangerouslySetInnerHTML={{ __html: preview }} />
  );
};

export default DevPreview;
