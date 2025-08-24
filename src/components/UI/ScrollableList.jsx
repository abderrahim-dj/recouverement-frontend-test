import { animate, motion, useMotionValue, useMotionValueEvent, useScroll } from "motion/react";
import { useRef } from "react";


import useIsMobile from "../../hooks/useIsMobile";

const ScrollableList = ({ children }) => {

  const isMobile = useIsMobile();

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ container: ref, axis: "y" });
  const maskImage = useScrollOverflowMask(scrollYProgress);

  return (
    <div className="scroll-container">
      
      
      <svg className="progress pb-4 opacity-0" width="80" height="80" viewBox="0 0 100 100" >
        <circle cx="50" cy="50" r="30" pathLength="1" className="bg"  />
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          className="indicator"
          style={{ pathLength: scrollYProgress }}
        />
      </svg>

      
      <motion.ul ref={ref} //style={{ maskImage }}
        style={{
          maskImage,
          height: '750px',
          overflowY: 'scroll',
          display: 'flex',
          flexDirection: 'column',
          listStyle: 'none',
          padding: '40px 0',
          margin: '0 auto',
          gap: '20px',
          paddingRight: '1rem',
        }}
      >
        {children}
      </motion.ul>
      <StyleSheet />
    </div>
  );
};

const top = `0%`;
const bottom = `100%`;
const topInset = `20%`;
const bottomInset = `80%`;
const transparent = `#0000`;
const opaque = `#000`;

function useScrollOverflowMask(scrollYProgress) {
  const maskImage = useMotionValue(
    `linear-gradient(0deg, ${opaque}, ${opaque} ${top}, ${opaque} ${bottomInset}, ${transparent})`
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(0deg, ${opaque}, ${opaque} ${top}, ${opaque} ${bottomInset}, ${transparent})`
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(0deg, ${transparent}, ${opaque} ${topInset}, ${opaque} ${bottom}, ${opaque})`
      );
    } else if (
      scrollYProgress.getPrevious() === 0 ||
      scrollYProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(0deg, ${transparent}, ${opaque} ${topInset}, ${opaque} ${bottomInset}, ${transparent})`
      );
    }
  });

  return maskImage;
}

function StyleSheet() {
  return (
    <style>{`
      .scroll-container {
        width: 100%;
        max-width: 400px;
        position: relative;
        margin: 0 auto;
      }

      .scroll-container .progress {
        position: absolute;
        top: -65px;
        left: 50%;
        transform: translateX(-50%);
      }

      .scroll-container .bg {
        stroke: #0b1011;
      }

      .scroll-container .progress circle {
        stroke-dashoffset: 0;
        stroke-width: 10%;
        fill: none;
      }

      .scroll-container .progress .indicator {
        stroke: var(--accent, #0d63f8);
      }

      .scroll-container ul {
        display: flex;
        flex-direction: column;
        list-style: none;
        height: '750px';
        overflow-y: scroll;
        padding: 40px 0;
        margin: 0 auto;
        gap: 20px;

        padding-right:1rem

        
      }

      .scroll-container ::-webkit-scrollbar {
        width: 5px;
        background: #fff3;
        -webkit-border-radius: 1ex;
        
      }

      .scroll-container ::-webkit-scrollbar-thumb {
        background: var(--accent, #858585);
        -webkit-border-radius: 1ex;

        
      }

      .scroll-container ::-webkit-scrollbar-corner {
        background: #fff3;
      }

      .scroll-container li {
        flex: 0 0 150px;
        height: 150px;
        // background: var(--accent, #0d63f8);
      }
    `}</style>
  );
}

export default ScrollableList;