import { useTypeFlowContext } from "../../../create-flow/CreateTypeFlow";
import "./TypeComplexity.scss";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getBasicContent } from "services/content";
import {
  TypeStyles,
  fontFamilies,
  generateStylesFromDesign,
} from "services/font";

type TypeStyleOption = TypeStyles & {
  _meta: {
    family: string;
  };
};

function TypeComplexity() {
  const { mainFamily, ratio, weight, family, setFamily } = useTypeFlowContext();
  const { t } = useTranslation();
  const { isLoading, data: basicsData } = useQuery({
    queryKey: ["getBasicContent"],
    queryFn: getBasicContent,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const handleItemClick = useCallback(
    (newFamily: string) => {
      setFamily(newFamily);
    },
    [setFamily]
  );

  const fontStyles = useMemo(() => {
    if (!mainFamily || ratio === undefined || weight === undefined) {
      return [];
    }
    const styles: TypeStyleOption[] = [];
    fontFamilies.forEach((family) => {
      styles.push({
        _meta: {
          family,
        },
        ...generateStylesFromDesign({
          main_family: mainFamily,
          ratio,
          weight,
          family,
        }),
      });
    });
    return styles;
  }, [mainFamily, ratio, weight]);

  return (
    <div className="TypeComplexity">
      <div className="Picker-Container">
        {fontStyles.map((styles, index) => (
          <div
            className={`TypeComplexity-Item-Container ${
              styles._meta.family === family ? "--selected" : ""
            }`}
            key={index}
            onClick={() => handleItemClick(styles._meta.family)}
          >
            {styles._meta.family === family && (
              <div className="TypeComplexity-SelectedBadge">Selected</div>
            )}

            {!isLoading && (
              <>
                <div
                  className="TypeComplexity-Item --title"
                  style={styles.title}
                >
                  {basicsData?.level1 || "Aisha Patel."}
                </div>
                <div
                  className="TypeComplexity-Item --subtitle"
                  style={styles.subtitle}
                >
                  {basicsData?.level2 ||
                    "Multidisciplinary Artist and Visual Storyteller"}
                </div>
                <div
                  className="TypeComplexity-Item --small"
                  style={styles.small}
                >
                  {basicsData?.level3 || "Based in Berlin, Germany"}
                </div>
                <div className="TypeComplexity-Item --body" style={styles.body}>
                  {basicsData?.paragraph ||
                    t(`Hello, I'm Aisha, a passionate multidisciplinary artist and visual
                  storyteller based in the vibrant city of Berlin. With a background
                  in both traditional and digital art, I thrive on blending various
                  artistic elements to create captivating narratives that resonate
                  with diverse audiences. My work is a reflection of my
                  multicultural experiences and an exploration of the connections
                  between art, culture, and emotion.`)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TypeComplexity;
