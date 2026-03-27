"use client";
import { useRive, Layout, Alignment, Fit } from "@rive-app/react-webgl2";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface AnimationProps {
  name: string;
  className?: string;
  fit?: Fit;
  threshold?: number;
  style?: React.CSSProperties;
  autoplay?: boolean;
}

export const Animation = ({
  name,
  className,
  fit,
  threshold,
  style,
  autoplay,
}: AnimationProps) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  const [reference, isInView] = useInView({
    threshold: threshold ? threshold : 0.2,
  });

  const { rive, RiveComponent } = useRive({
    src: `/animations/${name}.riv`,
    autoplay: autoplay || false,
    onLoad: () => console.log("Rive loaded successfully"),
    onLoadError: (e) => console.error("Rive load error:", e),
    layout: new Layout({
      fit: fit,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (isInView) setVisible(true);
    else setVisible(false);
  }, [isInView]);

  useEffect(() => {
    if (rive) {
      if (isVisible) {
        rive.play();
      } else rive.pause();
    }
    return () => rive?.pause(); // <- this
  }, [isVisible, rive]);

  return (
    <div
      ref={reference}
      data-testid="rive-animation"
      className={className}
      {...{ style: style }}
    >
      <RiveComponent />
    </div>
  );
};
