import { UnpublishedType } from "services/content";
import {
  FrequencyType,
  PersonaType,
  UsageDataType,
} from "services/initialSetup";
import { ThemeOptions } from "services/user";

interface UserData {
  email: string;
  name: string;
  nickname: string;
  nickname_prefix: string;
  preferences?: UserPreferences;
  stats: number;
  meta: UserMeta;
}

type UserPreferences = {
  [key in
    | "basics_enabled"
    | "links_enabled"
    | "posts_enabled"
    | "photos_enabled"
    | string]: boolean | string;
} & {
  theme_name: ThemeOptions;
  setup_skipped: boolean;
  setup_completed: boolean;
  identity: PersonaType;
  site_type: UsageDataType;
  frequency: FrequencyType;
  meta_title: string;
  meta_description: string;
  basics_enabled: boolean;
  links_enabled: boolean;
  posts_enabled: boolean;
  photos_enabled: boolean;
  lang: "es" | "en" | "";
  basics_name: string;
  links_name: string;
  posts_name: string;
  photos_name: string;
};

type CustomizationsType = {
  basics_updated: boolean;
  links_updated: boolean;
  photos_updated: boolean;
  blog_updated: boolean;
};

interface UserMeta {
  unpublished: UnpublishedType;
  profile_image: string;
  customizations: CustomizationsType;
  stats: UserStats;
}

interface UserStats {
  today: number;
  highest: null | {
    date: string;
    count: number;
  };
}

class User {
  email: string;
  name: string;
  nickname: string;
  nickname_prefix: string;
  stats: number;
  preferences: UserPreferences = {
    theme_name: "light",
    setup_skipped: false,
    setup_completed: false,
    identity: "human",
    site_type: "dont-know",
    frequency: "dont-know",
    meta_title: "",
    meta_description: "",
    basics_enabled: true,
    links_enabled: true,
    posts_enabled: true,
    photos_enabled: true,
    basics_name: "",
    links_name: "",
    posts_name: "",
    photos_name: "",
    lang: "en",
  };
  meta: UserMeta;

  constructor(data: UserData) {
    this.email = data.email;
    this.name = data.name;
    this.nickname = data.nickname;
    this.nickname_prefix = data.nickname_prefix;
    this.stats = data.stats;
    if (data.preferences) {
      this.preferences = data.preferences;
    }
    this.meta = data.meta;
  }

  get unpublishedList(): string[] {
    return [...this.meta.unpublished.content, ...this.meta.unpublished.visual];
  }
}

export default User;
