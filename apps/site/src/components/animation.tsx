"use client";
import { useRive, Layout, Alignment, Fit } from "@rive-app/react-webgl2";
import { useEffect } from "react";
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
  const [reference, isInView] = useInView({
    threshold: threshold ?? 0.2,
  });

  const { rive, RiveComponent } = useRive({
    src: `/animations/${name}.riv`,
    autoplay: autoplay || false,
    layout: new Layout({
      fit: fit,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (rive) {
      if (isInView) {
        rive.play();
      } else rive.pause();
    }
    return () => rive?.pause();
  }, [isInView, rive]);

  return (
    <div
      ref={reference}
      data-testid="rive-animation"
      className={className}
      style={style}
    >
      <RiveComponent />
    </div>
  );
};
