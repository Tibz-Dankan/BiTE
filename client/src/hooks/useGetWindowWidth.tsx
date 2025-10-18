import { useEffect, useState } from "react";

export const useGetWindowWidth = () => {
  const getWidth = () => window.innerWidth;
  const [width, setWidth] = useState(getWidth());

  useEffect(() => {
    const widthResizeHandler = () => setWidth(() => getWidth());
    window.addEventListener("resize", widthResizeHandler);

    return () => window.removeEventListener("resize", widthResizeHandler);
  }, [width]);

  return { width };
};
