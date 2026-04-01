"use client";

import { useEffect, useState } from "react";

export function McpTypeText({
  text,
  speed = 20,
  delay = 0,
  className,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let index = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let startTimer: ReturnType<typeof setTimeout> | null = null;

    setDisplayText("");

    const typeNext = () => {
      index += 1;
      setDisplayText(text.slice(0, index));

      if (index < text.length) {
        timer = setTimeout(typeNext, speed);
      }
    };

    startTimer = setTimeout(typeNext, delay);

    return () => {
      if (timer) clearTimeout(timer);
      if (startTimer) clearTimeout(startTimer);
    };
  }, [delay, speed, text]);

  return <span className={className}>{displayText}</span>;
}
