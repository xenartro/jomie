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
  useRef,
} from "react";
import {
  ContentLinkData,
  EMPTY_LINK,
  SOCIAL_LINKS_TYPE,
  getSocialLinksContent,
  updateLinksContent,
  normalizeSocialLink,
  socialLinkByType,
} from "services/content";
import { updateContentSocialLinksPreview } from "services/preview";

interface Props {
  refreshUnpublishedChanges(): void;
}

const SocialLinksForm = ({ refreshUnpublishedChanges }: Props) => {
  const [data, setData] = useState<ContentLinkData[]>([]);
  const [otherLinks, setOtherLinks] = useState<ContentLinkData[]>([]);
  const focusRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  useLayoutEffect(() => {
    updateContentSocialLinksPreview([...data, ...otherLinks], focusRef.current);
  });

  const onDataLoaded = useCallback(
    (data: ContentLinkData[]) => {
      setOtherLinks(
        data.filter(
          (link) => !SOCIAL_LINKS_TYPE.find(({ type }) => type === link.type)
        )
      );
      setData(
        SOCIAL_LINKS_TYPE.map((linkType) => {
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
      const linkType = socialLinkByType(newData[i].type);
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
    await updateLinksContent(data, 1);
    queryClient.invalidateQueries({ queryKey: ["getSocialLinksContent"] });
  }, [data, queryClient]);

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getSocialLinksContent}
      getDataCallback={onDataLoaded}
      getDataName="getSocialLinksContent"
    >
      <div>
        <div className="Layout --FlexibleGrid --Content LinkFormRow">
          {data.map((link, i) =>
            link.type > 0 && socialLinkByType(link.type) !== undefined ? (
              <div className="Row LinkFormRow__Row" key={link.type}>
                <div className="Col --size12">
                  <FieldLabel
                    htmlFor={`link-${socialLinkByType(link.type)?.name}-url`}
                    label={socialLinkByType(link.type)?.name ?? "Unknown"}
                  >
                    <Input
                      id={`link-${socialLinkByType(link.type)?.name}-url`}
                      name="url"
                      value={link.url}
                      placeholder={
                        link.type !== 6
                          ? `Add your ${
                              socialLinkByType(link.type)?.name
                            } URL or user`
                          : "Phone number with code. E.g. +34600123123"
                      }
                      type="text"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        focusRef.current = link.type;
                        handleChange(i, e);
                      }}
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

export default SocialLinksForm;
