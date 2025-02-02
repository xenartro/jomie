import "./Links.scss";
import { useQueryClient } from "@tanstack/react-query";
import Button from "components/common/button/Button";
import FieldLabel from "components/common/field-label/FieldLabel";
import Form from "components/common/form/Form";
import Input from "components/common/input/Input";
import { DataType, handleInputChange } from "helpers/forms";
import { useState, useCallback, useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  ContentLinkData,
  getLinksContent,
  getLinkMetadata,
  updateLinksContent,
} from "services/content";
import { updateContentLinksPreview } from "services/preview";

interface LinkFormRowProps {
  index: number;
  link: ContentLinkData;
  onChange(i: number, l: ContentLinkData): void;
  onRemove(link: ContentLinkData): void;
}

const LinkFormRow = ({ index, link, onChange, onRemove }: LinkFormRowProps) => {
  const { t } = useTranslation();
  const [loadingMetadata, setLoadingMetadata] = useState(false);
  const handleChange = useCallback(
    (data: DataType) => {
      onChange(index, data as ContentLinkData);
    },
    [index, onChange]
  );
  const handleMetadata = useCallback(() => {
    if (link.meta_description && link.meta_image) {
      return;
    }
    try {
      const url = new URL(link.url);
      if (!url) {
        return;
      }
      setLoadingMetadata(true);
      getLinkMetadata(link.url)
        .then((metadata) => {
          const data = {
            ...link,
            meta_description: link.meta_description || metadata.description,
            meta_image: link.meta_image || metadata.image,
          };
          onChange(index, data as ContentLinkData);
          setLoadingMetadata(false);
        })
        .catch((e) => {
          console.error(e);
          setLoadingMetadata(false);
        });
    } catch (e) {
      console.error(e);
      setLoadingMetadata(false);
    }
  }, [index, link, onChange]);

  return (
    <div
      className={`Layout --FlexibleGrid --Content LinkFormRow ${
        loadingMetadata ? "form--loading" : ""
      }`}
    >
      <div className="Row LinkFormRow__Row">
        <div className="Col --size5">
          <FieldLabel htmlFor={`link-${link.id}-title`} label="Title">
            <Input
              id={`link-${link.id}-title`}
              name="title"
              value={link.title}
              type="text"
              onChange={handleInputChange.bind(null, link, handleChange)}
              required
              tabIndex={index * 4 + 1}
            />
            <p className="form__feedback">{t("Please enter a title")}</p>
          </FieldLabel>
          {link.url && (
            <FieldLabel
              htmlFor={`link-${link.id}-description`}
              label="Description"
            >
              <Input
                id={`link-${link.id}-description`}
                name="meta_description"
                value={link.meta_description}
                type="text"
                onChange={handleInputChange.bind(null, link, handleChange)}
                tabIndex={index * 4 + 3}
              />
              <p className="form__feedback">{t("Please enter a title")}</p>
            </FieldLabel>
          )}
        </div>
        <div className="Col --size6">
          <FieldLabel htmlFor={`link-${link.id}-title`} label="URL">
            <Input
              id={`link-${link.id}-url`}
              name="url"
              value={link.url}
              type="text"
              onChange={handleInputChange.bind(null, link, handleChange)}
              onBlur={handleMetadata}
              placeholder="https://..."
              required
              tabIndex={index * 4 + 2}
            />
            <p className="form__feedback">{t("Please enter the URL")}</p>
          </FieldLabel>
          {link.url && (
            <FieldLabel htmlFor={`link-${link.id}-image`} label="Preview image">
              <Input
                id={`link-${link.id}-image`}
                name="meta_image"
                value={link.meta_image}
                type="text"
                onChange={handleInputChange.bind(null, link, handleChange)}
                tabIndex={index * 4 + 4}
              />
              <p className="form__feedback">{t("Please enter a title")}</p>
            </FieldLabel>
          )}
        </div>
        <div className="Col --size1 LinkFormRow__Action">
          <Button
            variant="ghost"
            icon="trash"
            size="small"
            onClick={() => onRemove(link)}
          />
        </div>
      </div>
    </div>
  );
};

interface Props {
  refreshUnpublishedChanges(): void;
}

const LinksForm = ({ refreshUnpublishedChanges }: Props) => {
  const [data, setData] = useState<ContentLinkData[]>([]);
  const focusRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  useLayoutEffect(() => {
    updateContentLinksPreview(data, focusRef.current);
  });

  const onDataLoaded = useCallback(
    (data: ContentLinkData[]) => {
      setData(data);
      refreshUnpublishedChanges();
    },
    [refreshUnpublishedChanges]
  );

  const handleSubmit = useCallback(async () => {
    const result = await updateLinksContent(data, 0);
    queryClient.invalidateQueries({ queryKey: ["getLinksContent"] });
    return result;
  }, [data, queryClient]);

  const handleRemove = useCallback(
    (link: ContentLinkData) => {
      const newData = [...data];
      newData.splice(data.indexOf(link), 1);
      setData(newData);
    },
    [data]
  );

  const handleChange = useCallback(
    (i: number, link: ContentLinkData) => {
      const newData = [...data];
      newData[i] = {
        ...newData[i],
        ...link,
      };
      setData(newData);
    },
    [data]
  );

  const handleAddLink = useCallback(() => {
    setData([
      ...data,
      {
        title: "",
        url: "",
        meta_description: "",
        meta_image: "",
        published: 0,
        type: 0,
      },
    ]);
  }, [data]);

  return (
    <Form
      onSubmit={handleSubmit}
      getData={getLinksContent}
      getDataCallback={onDataLoaded}
      getDataName="getLinksContent"
    >
      <div>
        <Button
          variant="secondary"
          size="small"
          icon="plus"
          onClick={handleAddLink}
        >
          Add another Link
        </Button>
        <br /> <br />
        {data &&
          data.map((link, index) =>
            link.type === 0 ? (
              <LinkFormRow
                link={link}
                key={`${link.id}-${index}`}
                index={index}
                onChange={(i: number, l: ContentLinkData) => {
                  focusRef.current = i;
                  handleChange(i, l);
                }}
                onRemove={handleRemove}
              />
            ) : null
          )}
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

export default LinksForm;
