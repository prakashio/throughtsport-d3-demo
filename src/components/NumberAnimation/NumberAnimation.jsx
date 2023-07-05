import React, { useState, useEffect } from "react";

const NumberAnimation = ({ value }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let animationFrameId = null;

    const startAnimation = () => {
      animationFrameId = requestAnimationFrame(animate);
    };

    const animate = () => {
      console.log(animatedValue, parseFloat(value));
      if (animatedValue < parseFloat(value)) {
        const increment = Math.ceil((value - animatedValue) / 10);
        setAnimatedValue((prevValue) => prevValue + increment);
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value, animatedValue]);

  return <span>{animatedValue}</span>;
};

export default NumberAnimation;
