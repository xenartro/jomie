import "./AnimatedBackground.scss";
import { FC, CSSProperties, useRef, useState, useEffect } from "react";

function getStyles(elementSize: number, height: number) {
  const styles: Record<string, CSSProperties> = {
    horizontal: {
      height: elementSize,
      width: "100%",
    },
    verticalOne: {
      width: elementSize,
      top: elementSize,
      height: height - elementSize,
    },
    verticalTwo: {
      width: elementSize,
      top: elementSize,
      left: elementSize,
      height: height,
    },
    verticalThree: {
      width: elementSize,
      top: elementSize,
      left: elementSize,
      height: elementSize,
    },
    verticalFour: {
      width: elementSize,
      left: elementSize * 2,
      height: height - elementSize / 2,
    },
    verticalFive: {
      width: elementSize,
      left: elementSize * 2,
      top: height - elementSize / 2,
      height: elementSize,
    },
  };

  return styles;
}

const AnimatedBackground: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(600);
  const [elementSize, setElementSize] = useState(0);

  // Listening for the window resize event
  useEffect(() => {
    const resizeHandler = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight);
        setElementSize(containerRef.current.clientWidth / 3);
      }
    };

    window.addEventListener("resize", resizeHandler);

    resizeHandler();

    // Cleanup function
    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const styles = getStyles(elementSize, height);

  return (
    <div className="AnimatedBackground" ref={containerRef}>
      <div className="AnimatedBackground__BottomLayer">
        <div
          className="AnimatedBackground__Element"
          style={styles.horizontal}
        ></div>
      </div>
      <div className="AnimatedBackground__TopLayer">
        <div
          className="AnimatedBackground__Element --vertical1"
          style={styles.verticalOne}
        ></div>
        <div
          className="AnimatedBackground__Element --vertical2"
          style={styles.verticalTwo}
        ></div>
        <div
          className="AnimatedBackground__Element --vertical3"
          style={styles.verticalThree}
        ></div>
        <div
          className="AnimatedBackground__Element --vertical4"
          style={styles.verticalFour}
        ></div>
        <div
          className="AnimatedBackground__Element --vertical5"
          style={styles.verticalFive}
        ></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
