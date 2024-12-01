import { AxiosResponse } from "axios";
import api, { postFormData } from "services/api";

/**
 * Abstract representation of the content, where we focus only on the common
 * properties.
 */
export interface AbstractObjectContent {
  [string: string]: string | number;
  published: 0 | 1;
}

export interface ContentBasicData {
  [string: string]: string | number;
  level1: string | number;
  level2: string | number;
  level3: string | number;
  paragraph: string | number;
  published: 0 | 1;
}

export const getBasicContent = async () => {
  const response = await api.get<{ data: ContentBasicData }>(
    "/api/content/basic"
  );
  if (response.data?.data) {
    return response.data.data;
  }

  return null;
};

export const updateBasicContent = async (
  data: Omit<ContentBasicData, "published">,
  imageField: string
) => {
  return await postFormData("/api/content/basic", data, [imageField]);
};

export interface ContentLinkData {
  [string: string]: string | number;
  title: string;
  url: string;
  meta_description: string;
  meta_image: string;
  published: 0 | 1;
  type: number;
}

export const getLinks = async (category: number[]) => {
  const response = await api.get<{ data: ContentLinkData[] }>(
    `/api/content/links?categories=${category.join(",")}`
  );
  if (response.data?.data) {
    return response.data.data;
  }

  return [];
};

export const getLinksContent = async () => {
  return getLinks([0]);
};

export const getSocialLinksContent = async () => {
  return getLinks([1, 2]);
};

export const getStreamingLinksContent = async () => {
  return getLinks([1, 2]);
};

export const SOCIAL_LINKS_TYPE = [
  {
    name: "Bluesky",
    type: 7,
    url: "https://bsky.app/profile",
  },
  {
    name: "Instagram",
    type: 2,
    url: "https://instagram.com",
  },
  {
    name: "LinkedIn",
    type: 5,
    url: "https://www.linkedin.com/in",
  },
  {
    name: "TikTok",
    type: 1,
    url: "https://tiktok.com",
  },
  {
    name: "Threads",
    type: 3,
    url: "https://threads.net",
  },
  {
    name: "Twitter/X",
    type: 4,
    url: "https://x.com",
  },
  {
    name: "WhatsApp",
    type: 6,
    url: "",
  },
  {
    name: "Other",
    type: 0,
    url: "",
  },
];

export const STREAMING_LINKS_TYPE = [
  {
    name: "YouTube",
    type: 8,
    url: "https://www.youtube.com",
  },
  {
    name: "Twitch",
    type: 9,
    url: "https://www.twitch.tv",
  },
  {
    name: "Kick",
    type: 10,
    url: "https://kick.com",
  },
];

export const socialLinkByType = (type: number) => {
  return SOCIAL_LINKS_TYPE.find((link) => link.type === type);
};

export const streamingLinkByType = (type: number) => {
  return STREAMING_LINKS_TYPE.find((link) => link.type === type);
};

const linkByType = (type: number) => {
  return socialLinkByType(type) ?? streamingLinkByType(type);
};

export const normalizeSocialLink = (url: string, type: number) => {
  url = url.toLowerCase();
  const linkType = linkByType(type);
  if (!url || !linkType || !linkType.url) {
    return url;
  }
  try {
    const urlInstance = new URL(url);
    if (
      urlInstance &&
      url.startsWith("http://") &&
      url.startsWith("https://")
    ) {
      return url;
    }
  } catch (e) {
    console.error(e);
  }
  url = url.replace("www.", "");
  url = url.replace("http://", "https://");
  if (url.indexOf("https://") !== 0) {
    url = "https://" + url.replace("https://", "");
  }
  if (url.indexOf(linkType.url) >= 0) {
    return url;
  }
  url = url.replace("https://", "");
  return linkType.url + "/" + url.replace(/^\/+/g, "");
};

export const EMPTY_LINK: ContentLinkData = {
  title: "",
  url: "",
  meta_description: "",
  meta_image: "",
  published: 0,
  type: 0,
};

export const getLinkMetadata = async (url: string) => {
  const response = await api.post<{
    data: { description: string; image: string };
  }>("/api/content/link/metadata", { url });
  if (response.data?.data) {
    return response.data.data;
  }

  return { image: "", description: "" };
};

export const updateLinksContent = async (
  data: ContentLinkData[],
  category: number
) => {
  const cleanData = data.filter((data) => data.url !== "");
  return await api.post(`/api/content/links/${category}`, { data: cleanData });
};

/**
 * Contents
 */
export type UnpublishedType = { content: string[]; visual: string[] };

export const getUnpublishedContents = async (): Promise<UnpublishedType> => {
  const response = await api.get<{ data: UnpublishedType }>("/api/unpublished");
  if (response.data?.data) {
    return response.data.data;
  }

  return { content: [], visual: [] };
};

export const publishContents = async () => {
  await api.post("/api/changes/publish");
};

export const discardContents = async () => {
  await api.post("/api/changes/discard");
};

/**
 * Photos
 */
export interface ContentPhotoData {
  description: string;
  position: number;
  image: string;
}

export const getPhotosContent = async (): Promise<ContentPhotoData[]> => {
  const response = await api.get<{ data: ContentPhotoData[] }>(
    "/api/content/photos"
  );
  if (response.data?.data) {
    return response.data.data;
  }
  return [];
};

export const updatePhotosContent = async (): Promise<
  AxiosResponse<{ data: ContentPhotoData[] }>
> => {
  const response = await postFormData<{ data: ContentPhotoData[] }>(
    "/api/content/photos",
    {},
    ["photo_1", "photo_2", "photo_3", "photo_4", "photo_5", "photo_6"]
  );
  return response;
};

export const removePhoto = async (
  index: number
): Promise<AxiosResponse<{ data: ContentPhotoData[] }>> => {
  const response = await api.delete<{ data: ContentPhotoData[] }>(
    `/api/content/photos/${index}`
  );
  return response;
};

/**
 * Posts
 */
export interface BlogPost {
  id?: number;
  created_at?: string;
  updated_at?: string;
  title: string;
  content: string;
  published: 0 | 1;
  deleted?: 0 | 1;
  edited_id?: number;
  expanded?: boolean;
  image?: string;
}

export const getBlogPosts = async () => {
  const response = await api.get<{ data: BlogPost[] }>("/api/content/posts");

  if (response.data?.data) {
    return response.data.data;
  }

  return null;
};

export const getBlogPost = async (id: number): Promise<BlogPost | null> => {
  const response = await api.get(`/api/content/post/${id}`);

  if (response.data?.data) {
    if (response.data.data.content) {
      response.data.data.content = response.data.data.content.replace(
        /\\"/g,
        '"'
      );
    }
    return response.data.data;
  }

  return null;
};

export const discardPostChanges = async () => {
  await api.delete("/api/content/posts/changes");
};

export const saveBlogPost = async (
  data: Omit<BlogPost, "published" | "expanded">,
  imageField: string
): Promise<BlogPost | null> => {
  const response = await postFormData<{ data: BlogPost | null }>(
    "/api/content/post",
    data,
    [imageField]
  );
  return response.data?.data;
};

export const deleteBlogPost = async (
  data: Omit<BlogPost, "published" | "expanded">
) => {
  await api.delete(`/api/content/post/${data.id}`);
};

export const restoreBlogPost = async (
  data: Omit<BlogPost, "published" | "expanded">
) => {
  await api.patch(`/api/content/post/${data.id}/restore`);
};

export async function postImageUploadHandler(
  postId: number | undefined,
  image: File
): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);
  if (postId) {
    formData.append("post_id", postId.toString());
  }

  const response = await api.post<{ data: string | undefined }>(
    "/api/content/post/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data ? response.data.data : "";
}
