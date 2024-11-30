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
  LINKS_TYPE,
  updateLinksContent,
  normalizeSocialLink,
  linkByType,
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
        LINKS_TYPE.map((linkType) => {
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
      const linkType = linkByType(newData[i].type);
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
    queryClient.invalidateQueries({ queryKey: ["getLinksContent"] });
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
            link.type > 0 && linkByType(link.type) !== undefined ? (
              <div className="Row LinkFormRow__Row" key={link.type}>
                <div className="Col --size12">
                  <FieldLabel
                    htmlFor={`link-${linkByType(link.type)?.name}-url`}
                    label={linkByType(link.type)?.name ?? "Unknown"}
                  >
                    <Input
                      id={`link-${linkByType(link.type)?.name}-url`}
                      name="url"
                      value={link.url}
                      placeholder={
                        link.type !== 6
                          ? `Add your ${
                              linkByType(link.type)?.name
                            } URL or user`
                          : "Phone number with code. E.g. +34600123123"
                      }
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
