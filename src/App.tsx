import { useState, useEffect, useRef, ReactHTMLElement, useMemo } from "react";
import "./App.css";
import useOnScreen from "./hooks/IsOnScreen";

const App: React.FC = () => {
  const FRAME_COUNT: number = 200;

  const [currentIndex, setCurrentIndex] = useState<number>(1);

  const container = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen(container);
  const [fullyIntersecting, setFullyIntersecting] = useState(false);
  const [isUpper, setisUpper] = useState(true);

  const currentFrame = (index: number) =>
    `/src/assets/image-set/ezgif-frame-${index
      .toString()
      .padStart(3, "0")}.jpg`;

  useEffect(() => {
    handleScroll();
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [isIntersecting]);

  useEffect(() => {
    console.log("isUpper", isUpper);
  }, [isUpper]);

  const handleScroll = () => {
    if (isIntersecting) {
      // Check if component fully intersecting
      const rect = container.current?.getBoundingClientRect();

      if (rect) {
        setFullyIntersecting(
          rect.top <= 0 && rect.bottom >= window.innerHeight
        );
        setisUpper(rect.top >= 0);
      }
      // height until interested element
      const scrollTop = document.documentElement.scrollTop - window.innerHeight;
      const maxScrollTop =
        container.current?.scrollHeight!! - window.innerHeight;
      console.log(maxScrollTop);

      const scrollFraction = scrollTop / maxScrollTop;

      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.ceil(scrollFraction * FRAME_COUNT)
      );

      if (frameIndex > 0 && frameIndex < FRAME_COUNT)
        setCurrentIndex(frameIndex + 1);
    }
  };

  return (
    <div className="App">
      <div className="content">
        <div className="title">Scroll Down</div>
      </div>
      <div
        ref={container}
        className={`scroll-video ${!isUpper && "image-down"}`}
      >
        <div className={fullyIntersecting ? "image-focus" : "image"}>
          <img src={currentFrame(currentIndex)} />
        </div>
      </div>
      <div className="content">
        <div>Done</div>
      </div>
    </div>
  );
};

export default App;