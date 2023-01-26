import { useState, useEffect, useRef } from "react";
import "./App.css";
import useImagePreloader from "./hooks/useImagePreloader";
import useOnScreen from "./hooks/useOnScreen";

const App: React.FC = () => {
  const FRAME_COUNT: number = 200;

  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const preloadSrcList: string[] = [];
  const container = useRef<HTMLDivElement>(null);
  const isIntersecting = useOnScreen(container);
  const [fullyIntersecting, setFullyIntersecting] = useState(false);
  const [isUpper, setisUpper] = useState(true);
  const { imagesPreloaded } = useImagePreloader(preloadSrcList);

  useEffect(() => {
    for (let i = 1; i <= FRAME_COUNT; i++) {
      preloadSrcList.push(currentFrame(i));
    }
    handleScroll();
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [isIntersecting]);

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
  const currentFrame = (index: number) =>
    `/static/images/image-set/ezgif-frame-${index
      .toString()
      .padStart(3, "0")}.jpg`;

  return (
    <div className="App">
      <div className="content">
        <div className="author">
          Made with love by{" "}
          <a href="https://github.com/FloatKasemtan">FloatyKT</a>
        </div>
        <div className="title">
          {imagesPreloaded ? "Scroll Down" : "Please wait"}
        </div>
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
