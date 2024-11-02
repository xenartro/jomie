interface ColorePreviewProps {
  hue: number;
  saturation: number;
  lightness?: number;
  size: number;
}

const getBaseStyles = (size: number) => {
  return {
    borderRadius: "50%",
    display: "inline-block",
    width: `${size}px`,
    height: `${size}px`,
  };
};

const ColorPreview = ({
  hue,
  saturation,
  lightness = 50,
  size,
}: ColorePreviewProps) => {
  return (
    <span
      style={{
        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        ...getBaseStyles(size),
      }}
    />
  );
};

export default ColorPreview;
