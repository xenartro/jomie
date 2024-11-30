import "./Links.scss";
import { useQueryClient } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import {
  useState,
  useCallback,
  useLayoutEffect,
  FocusEvent,
  ChangeEvent,
} from "react";
import {
  ContentLinkData,
  EMPTY_LINK,
  STREAMING_LINKS_TYPE,
  updateLinksContent,
  normalizeSocialLink,
  streamingLinkByType,
  getStreamingLinksContent,
} from "services/content";
import { updateContentSocialLinksPreview } from "services/preview";

interface Props {
  refreshUnpublishedChanges(): void;
}

const StreamingLinksForm = ({ refreshUnpublishedChanges }: Props) => {
  const [data, setData] = useState<ContentLinkData[]>([]);
  const queryClient = useQueryClient();

  useLayoutEffect(() => {
    updateContentSocialLinksPreview(data);
  });

  const onDataLoaded = useCallback(
    (data: ContentLinkData[]) => {
      setData(
        STREAMING_LINKS_TYPE.map((linkType) => {
          const link = data.find((link) => link.type === linkType.type);
          if (link) {
            return link;
          }
          return {
            ...EMPTY_LINK,
            title: linkType.name,
            type: linkType.type,
          };
        })
      );
      refreshUnpublishedChanges();
    },
    [refreshUnpublishedChanges]
  );

  const handleChange = useCallback(
    (i: number, e: ChangeEvent<HTMLInputElement>) => {
      const newData = [...data];
      newData[i] = {
        ...newData[i],
        url: e.target.value,
      };
      setData(newData);
    },
    [data]
  );

  const handleSocialLinkBlur = useCallback(
    (i: number, e: FocusEvent<HTMLInputElement>) => {
      const newData = [...data];
      const linkType = streamingLinkByType(newData[i].type);
      if (!linkType) {
        return;
      }
      newData[i] = {
        ...newData[i],
        url: normalizeSocialLink(e.target.value, linkType.type),
      };
      setData(newData);
    },
    [data]
  );

  const handleSubmit = useCallback(async () => {
    await updateLinksContent(data);
    queryClient.invalidateQueries({ queryKey: ["getStreamingLinksContent"] });
  }, [data, queryClient]);

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getStreamingLinksContent}
      getDataCallback={onDataLoaded}
      getDataName="getStreamingLinksContent"
    >
      <div>
        <div className="Layout --FlexibleGrid --Content LinkFormRow">
          {data.map((link, i) =>
            link.type > 0 && streamingLinkByType(link.type) !== undefined ? (
              <div className="Row LinkFormRow__Row" key={link.type}>
                <div className="Col --size12">
                  <FieldLabel
                    htmlFor={`link-${streamingLinkByType(link.type)?.name}-url`}
                    label={streamingLinkByType(link.type)?.name ?? "Unknown"}
                  >
                    <Input
                      id={`link-${streamingLinkByType(link.type)?.name}-url`}
                      name="url"
                      value={link.url}
                      placeholder={`Add your ${
                        streamingLinkByType(link.type)?.name
                      } URL or user`}
                      type="text"
                      onChange={handleChange.bind(null, i)}
                      onBlur={handleSocialLinkBlur.bind(null, i)}
                    />
                  </FieldLabel>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      <div className="Form__Submit">
        <Button variant="link" type="reset" className="Form__Discard">
          Discard changes
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </Form>
  );
};

export default StreamingLinksForm;
