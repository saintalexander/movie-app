import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottieAnimation = ({ animationData }) => {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animationData
    });

    // clean-up function
    return () => {
      lottie.destroy();
    };
  }, [animationData]);

  return <div ref={container} />;
};

export default LottieAnimation;
