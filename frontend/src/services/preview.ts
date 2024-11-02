import { ContentLinkData } from "./content";
import { Type, previewFont } from "./font";
import { previewPalette } from "./palette";
import DOMPurify from "dompurify";
import { DataType } from "helpers/forms";
import api from "services/api";

export function s(input: string) {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

export const getPreview = async (
  section: string | null,
  contentPreview: string[] = []
) => {
  const response = await api.get<string>(
    `${import.meta.env.VITE_APP_URL}/render?published=1&section=${
      section || ""
    }&devPreview=true&${contentPreview.join("&")}`
  );
  if (response.data) {
    return response.data;
  }

  return null;
};

export const getHomepageFeaturedNickname = async () => {
  try {
    const response = await api.get<string>("/api/homepage/featured");
    return response.data || "matyax";
  } catch (e) {
    console.error(e);
  }

  return "matyax";
};

export const getDraftPreview = async (
  section: string | null,
  contentPreview: string[] = []
) => {
  const response = await api.get<string>(
    `${import.meta.env.VITE_APP_URL}/render?published=0&section=${
      section || ""
    }&devPreview=true&${contentPreview.join("&")}`
  );
  if (response.data) {
    return response.data;
  }

  return null;
};

const getIframe = () => {
  const iframe = document.getElementById("preview") as HTMLIFrameElement;
  if (!iframe) {
    console.debug("Awaiting for iframe");
    return;
  }
  const preview = iframe.contentDocument?.getElementById("website-preview");
  if (!preview) {
    console.log("Awaiting for rendered preview");
    return;
  }
  return iframe;
};

const IGNORE_ATTR = ["published"];
export const updateContentBasicPreview = (data: DataType) => {
  const iframe = getIframe();
  if (!iframe || !iframe.contentDocument) {
    return;
  }

  const { profile_image, ...textData } = data;
  const container = iframe.contentDocument.querySelector<HTMLDivElement>(
    '[data-attribute="basic-profile-image-container"]'
  );
  updateImagePreview(
    profile_image
      ? `${import.meta.env.VITE_MEDIA_PREFIX}${profile_image.toString()}`
      : null,
    container
  );

  for (const attribute in textData) {
    if (IGNORE_ATTR.includes(attribute)) {
      continue;
    }

    const element = iframe.contentDocument.querySelector(
      `[data-attribute="basic-${attribute}"]`
    );

    if (element) {
      element.innerHTML = s(`${data[attribute]}`);
    } else {
      console.error(`${attribute} not found in preview`);
    }
  }
};

export const updateContentPhotosPreview = (photos: string[]) => {
  const iframe = getIframe();
  if (!iframe || !iframe.contentDocument) {
    return;
  }

  const container = iframe.contentDocument?.querySelector<HTMLDivElement>(
    '[data-content="photos"]'
  );
  if (container) {
    container.innerHTML = "";
  }

  let count = 0;
  for (let i = 0; i < 6; i++) {
    const container = getNthPhotoContainer(iframe, i + 1);
    if (photos[i]) {
      updateImagePreview(photos[i], container, `photo_${i + 1}`);
      count = i + 1;
    }
  }

  iframe.contentDocument
    ?.querySelector<HTMLDivElement>('[data-content="photos"]')
    ?.setAttribute("class", `photos-content photos-${count}`);
};

const getNthPhotoContainer = (
  iframe: HTMLIFrameElement,
  index: number
): HTMLDivElement | null => {
  let photo = iframe.contentDocument?.querySelector<HTMLDivElement>(
    `[data-content="photo-${index}"]`
  );
  if (photo) {
    return photo;
  }

  photo = iframe.contentDocument
    ?.querySelector<HTMLDivElement>('[data-content="photo"]')
    ?.cloneNode(true) as HTMLDivElement;

  if (!photo) {
    return null;
  }

  photo.setAttribute("data-content", `photo-${index}`);

  const photosContainer = iframe.contentDocument?.querySelector<HTMLDivElement>(
    '[data-content="photos"]'
  );
  if (!photosContainer) {
    console.error("Photos container not found");
    return photo;
  }

  if (index === 1) {
    return photosContainer.appendChild(photo);
  }

  let sibling: HTMLDivElement | null | undefined;
  for (let i = 1; i < index; i++) {
    sibling = iframe.contentDocument?.querySelector<HTMLDivElement>(
      `[data-content="photo-${index}"]`
    );
  }
  if (sibling) {
    return sibling.insertAdjacentElement("afterend", photo) as HTMLDivElement;
  }
  return photosContainer.appendChild(photo);
};

export const updateImagePreview = (
  imagePath: string | null,
  container: HTMLDivElement | null,
  inputId = "image-field"
) => {
  if (!container) {
    console.error("Image container not found");
    return;
  }

  const newFileInput = document.getElementById(inputId) as HTMLInputElement;

  if (!newFileInput) {
    return;
  }

  if (!newFileInput.files?.length && !imagePath) {
    container.innerHTML = "";
    return;
  }

  let preview = container.querySelector<HTMLImageElement>("img");
  if (!preview) {
    preview = document.createElement("img");
    container.appendChild(preview);
  }

  if (newFileInput.files?.length) {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === "string") {
        preview!.src = reader.result;
      } else if (reader.result instanceof ArrayBuffer) {
        const blob = new Blob([]);
        preview!.src = URL.createObjectURL(blob);
      }
    };

    reader.readAsDataURL(newFileInput.files[0]);
  } else if (imagePath) {
    preview.src = imagePath;
  }
};

export const updateContentSocialLinksPreview = (data: ContentLinkData[]) => {
  const iframe = getIframe();
  if (!iframe) {
    return;
  }

  const links = iframe.contentDocument?.querySelector(
    '[data-content="social-links"]'
  );
  if (!links) {
    console.error("Links container not found");
    return;
  }

  links.innerHTML = "";
  const toInsert = document.createDocumentFragment();

  data.forEach((link) => {
    if (link.type === 0) {
      return;
    }
    if (!link.url) {
      return;
    }
    const node = iframe.contentDocument
      ?.querySelector<HTMLDivElement>('[data-content="social-link"]')
      ?.cloneNode(true) as Element;
    if (!node) {
      return;
    }
    node.removeAttribute("data-content");
    const a = node.querySelector<HTMLAnchorElement>("a");
    if (!a) {
      return;
    }
    a.setAttribute("href", s(link.url));
    a.innerHTML = s(link.title);

    node
      .querySelectorAll(
        `svg:not([data-attribute="social-link-logo-${link.type}"])`
      )
      .forEach((n) => {
        n.remove();
      });

    toInsert.appendChild(node);
  });

  links.appendChild(toInsert);
};

export const updateContentLinksPreview = (data: ContentLinkData[]) => {
  const iframe = getIframe();
  if (!iframe) {
    return;
  }

  const links = iframe.contentDocument?.querySelector('[data-content="links"]');
  if (!links) {
    console.error("Links container not found");
    return;
  }

  links.innerHTML = "";
  const toInsert = document.createDocumentFragment();

  data.forEach((link) => {
    if (link.type > 0) {
      return;
    }
    const node = iframe.contentDocument
      ?.querySelector<HTMLDivElement>('[data-content="link"]')
      ?.cloneNode(true) as Element;
    if (!node) {
      return;
    }
    node.removeAttribute("data-content");
    const a = node.querySelector<HTMLAnchorElement>("a");
    if (!a) {
      return;
    }
    a.setAttribute("href", s(link.url));
    a.innerHTML = s(link.title);

    const image = node.querySelector<HTMLImageElement>(
      '[data-attribute="link-image"]'
    );
    if (!image) {
      return;
    }
    if (link.meta_image) {
      image.setAttribute("src", link.meta_image);
    } else {
      image.remove();
    }

    const description = node.querySelector<HTMLImageElement>(
      '[data-attribute="link-description"]'
    );
    if (!description) {
      return;
    }
    if (link.meta_description) {
      description.innerHTML = s(link.meta_description);
    } else {
      description.remove();
    }

    toInsert.appendChild(node);
  });

  links.appendChild(toInsert);
};

export function updatePalettePreview(paletteId: number) {
  const iframe = getIframe();
  if (!iframe) {
    console.error("Iframe not found");
    return;
  }
  const style = iframe.contentDocument?.getElementById(
    "palette-preview"
  ) as HTMLStyleElement;
  if (!style) {
    console.error("Palette style block not found");
  }

  previewPalette(paletteId).then((palette: string) => {
    if (palette) {
      style.innerHTML = palette;
    }
  });
}

export function updateFontPreview(font: Type) {
  const iframe = getIframe();
  if (!iframe) {
    console.error("Iframe not found");
    return;
  }
  if (!font.id) {
    console.error("Missing id in Type");
    return;
  }
  const style = iframe.contentDocument?.getElementById(
    "fonts-preview"
  ) as HTMLStyleElement;
  if (!style) {
    console.error("Font style block not found");
  }

  previewFont(font.id).then((fonts: string) => {
    if (fonts) {
      style.innerHTML = fonts;
    }
  });
}

export const updateSectionNamePreview = (section: string, name: string) => {
  const iframe = getIframe();
  if (!iframe || !iframe.contentDocument) {
    return;
  }

  const elements = iframe.contentDocument.querySelectorAll<HTMLElement>(
    `[data-attribute="${section}-name"]`
  );

  if (!elements) {
    return;
  }

  for (const element of elements) {
    element.innerHTML = name;
  }
};
