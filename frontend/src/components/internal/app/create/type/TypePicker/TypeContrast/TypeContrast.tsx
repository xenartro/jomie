import { useTypeFlowContext } from "../../../create-flow/CreateTypeFlow";
import "./TypeContrast.scss";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useRef, useCallback, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { getBasicContent } from "services/content";
import {
  baseFontSize,
  calculateFontSize,
  calculateFontWeight,
  calculateLineHeight,
  getFontWeightLevel,
} from "services/font";

function TypeContrast() {
  const {
    ratio,
    weight,
    setRatio,
    setWeight,
    typeCoordinates,
    setTypeCoordinates,
    mainFamily,
  } = useTypeFlowContext();
  const typeContrastRef = useRef<HTMLDivElement | null>(null);
  const [ratioPreview, setRatioPreview] = useState<number>(ratio || 1);
  const [weightPreview, setWeightPreview] = useState<number>(weight || 200);
  const { t } = useTranslation();
  const { isLoading, data: basicsData } = useQuery({
    queryKey: ["getBasicContent"],
    queryFn: getBasicContent,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  // Create state variables for the div that follows the mouse and the clicked div
  const [divFollowsMouse, setDivFollowsMouse] = useState({
    top: 0,
    left: 0,
  });
  const [divStaysOnClick, setDivStaysOnClick] = useState({
    top: typeCoordinates.top,
    left: typeCoordinates.left,
    isClicked: typeCoordinates.top !== 0 && typeCoordinates.left !== 0,
  });

  const handleMouseLeave = useCallback(() => {
    setDivFollowsMouse({
      top: divStaysOnClick.top,
      left: divStaysOnClick.left,
    });
    setRatioPreview(ratio || 1);
    setWeightPreview(weight || 200);
  }, [divStaysOnClick.left, divStaysOnClick.top, ratio, weight]);

  // Handle click event to store the ratio value and set the clicked div's position
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!typeContrastRef.current) {
      return;
    }
    const typeContrastRect = typeContrastRef.current.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    setRatio(ratioPreview);
    setWeight(weightPreview);

    // Update the div that stays at the clicked position
    setDivStaysOnClick({
      top: mouseY,
      left: mouseX - typeContrastRect.left,
      isClicked: true,
    });
    setTypeCoordinates({
      top: mouseY,
      left: mouseX - typeContrastRect.left,
    });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!typeContrastRef.current) {
      return;
    }
    const typeContrastRect = typeContrastRef.current.getBoundingClientRect();
    const mouseY = event.clientY;
    const mouseX = event.clientX;
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    if (
      mouseX > typeContrastRect.left &&
      mouseY >= typeContrastRect.top &&
      mouseY <= typeContrastRect.bottom
    ) {
      // Calculate the scale ratio based on mouse position
      const newScaleRatio = 1 + (1 - mouseY / windowHeight) * 2.0; // Adjust the scaling factor as needed
      setRatioPreview(parseFloat(newScaleRatio.toFixed(2)));

      // Update the font-weight level based on mouse position

      const relativeX =
        (mouseX - typeContrastRect.left) /
        (windowWidth - typeContrastRect.left);
      const newFontWeightLevel = getFontWeightLevel(relativeX);
      setWeightPreview(newFontWeightLevel);

      // Update the div that follows the mouse
      setDivFollowsMouse({
        top: mouseY,
        left: mouseX - typeContrastRect.left,
      });
    }
  };

  return (
    <div
      className="TypeContrast"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      ref={typeContrastRef}
    >
      <div className="Picker-Container">
        {!isLoading && (
          <>
            <div
              className="TypeContrast-Item --title"
              style={{
                fontSize: calculateFontSize(ratioPreview, 2),
                lineHeight: calculateLineHeight(
                  calculateFontSize(ratioPreview, 2)
                ),
                fontWeight: calculateFontWeight(weightPreview),
                fontFamily: mainFamily,
              }}
            >
              {basicsData?.level1 || "Aisha Patel."}
            </div>
            <div
              className="TypeContrast-Item --subtitle"
              style={{
                fontSize: calculateFontSize(ratioPreview, 1),
                lineHeight: calculateLineHeight(
                  calculateFontSize(ratioPreview, 1)
                ),
                fontWeight: calculateFontWeight(weightPreview),
                fontFamily: mainFamily,
              }}
            >
              {basicsData?.level2 ||
                "Multidisciplinary Artist and Visual Storyteller"}
            </div>
            <div
              className="TypeContrast-Item --small"
              style={{
                fontSize: calculateFontSize(ratioPreview, -1),
                lineHeight: calculateLineHeight(
                  calculateFontSize(ratioPreview, -1)
                ),
                fontWeight: calculateFontWeight(weightPreview),
                fontFamily: mainFamily,
              }}
            >
              {basicsData?.level3 || "Based in Berlin, Germany"}
            </div>
            <div
              className="TypeContrast-Item --body"
              style={{
                fontSize: calculateFontSize(baseFontSize, 0),
                lineHeight: calculateLineHeight(
                  calculateFontSize(baseFontSize, 0)
                ),
                fontFamily: mainFamily,
              }}
            >
              {basicsData?.paragraph ||
                `Hello, I'm Aisha, a passionate multidisciplinary artist and visual
            storyteller based in the vibrant city of Berlin. With a background in
            both traditional and digital art, I thrive on blending various
            artistic elements to create captivating narratives that resonate with
            diverse audiences. My work is a reflection of my multicultural
            experiences and an exploration of the connections between art,
            culture, and emotion.`}
            </div>
          </>
        )}
      </div>
      <div className="AxisLegend --top-left">
        {t("High Size Contrast")} <br />
        {t("Low Weight Contrast")}
      </div>
      <div className="AxisLegend --top-right">
        {t("High Size Contrast")} <br />
        {t("High Weight Contrast")}
      </div>
      <div className="AxisLegend --bottom-left">
        Low Size Contrast <br />
        {t("Low Weight Contrast")}
      </div>
      <div className="AxisLegend --bottom-right">
        {t("High Size Contrast")} <br />
        {t("Low Weight Contrast")}
      </div>

      <div
        className="Indicator-Hover"
        style={{ top: divFollowsMouse.top, left: 0 }}
      ></div>

      <div
        className="Indicator-Weight-Hover"
        style={{ left: divFollowsMouse.left, top: 0 }}
      ></div>

      <div
        className="Point-Hover"
        style={{ left: divFollowsMouse.left - 8, top: divFollowsMouse.top - 8 }}
      >
        <div className="Point-Hover__Text">{t("Click to set")}</div>
      </div>

      {divStaysOnClick.isClicked && (
        <div
          className="Indicator-Selected"
          style={{ top: divStaysOnClick.top, left: 0 }}
        ></div>
      )}
      {divStaysOnClick.isClicked && (
        <div
          className="Indicator-Weight-Selected"
          style={{ left: divStaysOnClick.left, top: 0 }}
        ></div>
      )}

      {divStaysOnClick.isClicked && (
        <div
          className="Point-Selected"
          style={{
            left: divStaysOnClick.left - 8,
            top: divStaysOnClick.top - 8,
          }}
        ></div>
      )}
    </div>
  );
}

export default TypeContrast;
