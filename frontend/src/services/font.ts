import api from "services/api";

export const baseFontSize = 16;
export const minFontSize = 14;
// Define the 3 positions where font-weight changes
export const fontWeightPositions = [0.33, 0.66, 1];
export const fontFamilies = [
  "Switzer, sans-serif",
  "Sentient, serif",
  "Sono, monospace",
  "Telma, cursive",
];

// Calculate font sizes based on the type scale ratio and apply a minimum size
export const calculateFontSize = (scaleRatio: number, level: number) => {
  let fontSize = Math.round(baseFontSize * Math.pow(scaleRatio, level));
  fontSize = Math.floor(fontSize / 4) * 4; // Round to the nearest multiple of 4
  return fontSize < minFontSize ? minFontSize : fontSize;
};

// Calculate line height dynamically based on the font size
export const calculateLineHeight = (fontSize: number) => {
  const lineHeightFactor = 1.5 - (fontSize - baseFontSize) / 200;
  return Math.max(lineHeightFactor, 1);
};

// Calculate font-weight based on the font-weight level
export const calculateFontWeight = (fontWeightLevel: number) => {
  switch (fontWeightLevel) {
    case 0:
      return 500;
    case 1:
      return 700;
    case 2:
      return 900;
    default:
      return 500;
  }
};

export const getFontWeightLevel = (relativeX: number) => {
  if (relativeX < fontWeightPositions[0]) {
    return 0; // Leftmost position
  } else if (relativeX < fontWeightPositions[1]) {
    return 1; // Middle position
  } else {
    return 2; // Rightmost position
  }
};

export interface TypeRender {
  title: {
    font_family: string;
    font_size: string;
    line_height: string;
    font_weight: string;
  };
  subtitle: {
    font_family: string;
    font_size: string;
    line_height: string;
    font_weight: string;
  };
  small: {
    font_family: string;
    font_size: string;
    line_height: string;
    font_weight: string;
  };
  body: {
    font_family: string;
    font_size: string;
    line_height: string;
  };
}

export interface Type extends TypeDesign {
  id?: number;
  user_type: boolean;
  name: string;
  render: TypeRender;
}

export interface TypeDesign {
  ratio: number;
  weight: number;
  main_family: string;
  family: string;
}
export type TypeStyles = {
  title: React.CSSProperties;
  subtitle: React.CSSProperties;
  small: React.CSSProperties;
  body: React.CSSProperties;
};
export function generateStylesFromDesign(design: TypeDesign) {
  return {
    title: {
      fontFamily: design.family,
      fontSize: calculateFontSize(design.ratio, 2),
      lineHeight: calculateLineHeight(calculateFontSize(design.ratio, 2)),
      fontWeight: calculateFontWeight(design.weight),
    },
    subtitle: {
      fontFamily: design.family,
      fontSize: calculateFontSize(design.ratio, 1),
      lineHeight: calculateLineHeight(calculateFontSize(design.ratio, 1)),
      fontWeight: calculateFontWeight(design.weight),
    },
    small: {
      fontFamily: design.main_family,
      fontSize: calculateFontSize(design.ratio, -1),
      lineHeight: calculateLineHeight(calculateFontSize(design.ratio, -1)),
      fontWeight: calculateFontWeight(design.weight),
    },
    body: {
      fontFamily: design.main_family,
      fontSize: calculateFontSize(baseFontSize, 0),
      lineHeight: calculateLineHeight(calculateFontSize(baseFontSize, 0)),
    },
  };
}

export async function createType(
  data: Omit<Type, "user_type" | "name" | "render">
) {
  if (data.id) {
    return await saveType(data);
  }
  const response = await api.post<{ data: Type }>("/api/visual/font/create", {
    data,
  });
  return response.data.data;
}

export async function deleteType(id: number) {
  await api.delete(`/api/visual/font/${id}`);
}

export async function getType(id: number): Promise<Type | null> {
  const response = await api.get<{ data: Type }>(`/api/visual/font/${id}`);
  return response.data?.data || null;
}

export async function saveType(
  data: Omit<Type, "user_type" | "name" | "render">
) {
  const response = await api.put<{ data: Type }>(`/api/visual/font`, {
    data,
  });
  return response.data.data;
}

const fontCache: Record<number, string> = {};
export async function previewFont(id: number) {
  if (fontCache[id]) {
    return fontCache[id];
  }
  try {
    const response = await api.get(`/api/visual/font/preview/${id}`);
    fontCache[id] = response.data;
    return response.data;
  } catch (error) {
    console.error(error);
  }
  return "";
}
