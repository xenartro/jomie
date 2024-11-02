import api from "services/api";

export type UsageDataType =
  | "personal-card"
  | "website"
  | "blog"
  | "portfolio"
  | "dont-know"
  | "other";

export type PersonaType =
  | "content-creator"
  | "developer"
  | "designer"
  | "musician"
  | "writer"
  | "model"
  | "sports"
  | "gamer"
  | "human"
  | "alien";

export type FrequencyType =
  | "daily"
  | "weekly"
  | "monthly"
  | "sometimes"
  | "dont-know";

export interface InitialSetupInterface {
  usage?: UsageDataType;
  identity?: PersonaType;
  frequency?: string;
}

export async function storeSetup(data: InitialSetupInterface) {
  try {
    await api.post("/api/user/setup", {
      data,
    });
  } catch (e) {
    console.error("storeSetup", e);
  }
}
