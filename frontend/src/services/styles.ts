import { Type } from "./font";
import { Palette } from "./palette";
import api from "services/api";

export async function getPalettes() {
  const response = await api.get<{ data: Palette[] }>("/api/visual/palettes");
  if (response.data?.data) {
    return response.data.data;
  }

  return null;
}

export async function getFonts() {
  const response = await api.get<{ data: Type[] }>("/api/visual/fonts");
  if (response.data?.data) {
    return response.data.data;
  }

  return null;
}

export interface Layout {
  id: number;
  name: string;
}

export async function getLayouts(): Promise<Layout[]> {
  const layouts = [
    {
      id: 1,
      name: "Multi-page layout",
    },
    {
      id: 2,
      name: "Single-page layout 1",
    },
    {
      id: 3,
      name: "Single-page layout 2",
    },
    {
      id: 4,
      name: "Old School",
    },
  ];
  return layouts;
}

export async function getLoadingEffects(): Promise<Layout[]> {
  const layouts = [
    {
      id: 0,
      name: "No loading effect",
    },
    {
      id: 1,
      name: "Fade in",
    },
    {
      id: 2,
      name: "Flip",
    },
  ];
  return layouts;
}

export interface VisualSettings {
  palette_id: number;
  font_id: number;
  layout_id: number;
  loading_effect_id: number;
  published: 0 | 1;
}

export async function getVisualSettings() {
  const response = await api.get<{ data: VisualSettings }>(
    "/api/visual/settings"
  );
  if (response.data?.data) {
    return response.data.data;
  }

  return null;
}

export async function saveVisualSettings(data: Partial<VisualSettings>) {
  await api.post("/api/visual", { data });
}
