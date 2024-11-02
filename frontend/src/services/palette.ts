import api from "services/api";

export function generatePalette(
  baseHue: number,
  baseSaturation: number,
  randomComponent: number,
  size: number
) {
  const palette = [];

  for (let i = 0; i < size; i++) {
    const hueIncrement = (size + 1) * (15 + randomComponent * (30 * (i - 1))); // Increase hue contrast with main div's index
    const hue = (baseHue + i * hueIncrement) % 360;
    let saturation = baseSaturation;
    if (i > 1) {
      // Reduce saturation for main divs with an index greater than 2
      //check if the number is even
      if (i % 2 == 0) {
        saturation = Math.max(baseSaturation, 100 - baseSaturation); // Adjust the value as needed
      } else {
        saturation = Math.max(10, baseSaturation / 4); // Adjust the value as needed
      }
    }

    palette.push({
      hue: Math.round(hue),
      saturation: Math.round(saturation),
    });
  }

  return palette;
}

export interface PaletteColor {
  hue: number;
  saturation: number;
}

export interface Palette {
  id: number;
  palette: PaletteColor[];
  balance: number;
  hue: number;
  saturation: number;
  user_palette?: boolean;
  random_component: number;
  r: number;
}

export interface NewPalette {
  id?: number;
  palette: PaletteColor[];
  balance: number;
}

export async function createPalette(data: NewPalette) {
  if (data.id) {
    return await savePalette(data);
  }
  const response = await api.post<{ data: Palette }>(
    "/api/visual/palette/create",
    {
      data,
    }
  );
  return response.data?.data;
}

export async function deletePalette(id: number) {
  await api.delete(`/api/visual/palette/${id}`);
}

export async function getPalette(id: number): Promise<Palette | null> {
  const response = await api.get<{ data: Palette }>(
    `/api/visual/palette/${id}`
  );
  return response.data?.data || null;
}

export async function savePalette(data: NewPalette) {
  await api.put(`/api/visual/palette`, {
    data,
  });
}

const paletteCache: Record<number, string> = {};
export async function previewPalette(id: number) {
  if (paletteCache[id]) {
    return paletteCache[id];
  }
  try {
    const response = await api.get(`/api/visual/palette/preview/${id}`);
    paletteCache[id] = response.data;
    return response.data;
  } catch (error) {
    console.error(error);
  }
  return "";
}
