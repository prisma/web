"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ParticleShape = "capsule" | "sphere" | "box" | "tetrahedron";

type Particle = {
  t: number;
  speed: number;
  mx: number;
  my: number;
  mz: number;
  cx: number;
  cy: number;
  cz: number;
  randomRadiusOffset: number;
  introOffset: number;
};

type AntigravityProps = {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: ParticleShape;
  fieldStrength?: number;
};

const SCENE_HEIGHT = 32;
const INTRO_DURATION_MS = 700;
const INTRO_STAGGER_MS = 1300;

const createParticles = (count: number, width: number, height: number) =>
  Array.from({ length: count }, (_, index) => {
    const x = (Math.random() - 0.5) * width;
    const y = (Math.random() - 0.5) * height;
    const z = (Math.random() - 0.5) * 20;

    return {
      t: Math.random() * 100,
      speed: 0.01 + Math.random() / 200,
      mx: x,
      my: y,
      mz: z,
      cx: x,
      cy: y,
      cz: z,
      randomRadiusOffset: (Math.random() - 0.5) * 2,
      introOffset: (index / Math.max(count - 1, 1)) * INTRO_STAGGER_MS,
    };
  });

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const AntigravityInner = ({
  count = 300,
  magnetRadius = 10,
  ringRadius = 10,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 2,
  lerpSpeed = 0.1,
  color = "#FF9FFC",
  autoAnimate = false,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 10,
}: AntigravityProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<Array<SVGGElement | null>>([]);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef<number | null>(null);
  const introStartTime = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const isPointerInside = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });
  const isPageVisible = useRef(true);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const sceneSize = useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    return {
      width: SCENE_HEIGHT * Math.max(aspect, 1),
      height: SCENE_HEIGHT,
    };
  }, [size.height, size.width]);

  useEffect(() => {
    const onVisibilityChange = () => {
      isPageVisible.current = !document.hidden;
    };

    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setSize({
        width: Math.max(rect.width, 1),
        height: Math.max(rect.height, 1),
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updatePointerPosition = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width;
      const normalizedY = (event.clientY - rect.top) / rect.height;

      pointerRef.current = {
        x: (normalizedX - 0.5) * sceneSize.width,
        y: (normalizedY - 0.5) * sceneSize.height,
      };
    };

    const onPointerEnter = (event: PointerEvent) => {
      isPointerInside.current = true;
      lastMouseMoveTime.current = performance.now();
      updatePointerPosition(event);
    };

    const onPointerMove = (event: PointerEvent) => {
      isPointerInside.current = true;
      updatePointerPosition(event);
    };

    const onPointerLeave = () => {
      isPointerInside.current = false;
    };

    element.addEventListener("pointerenter", onPointerEnter, { passive: true });
    element.addEventListener("pointermove", onPointerMove, { passive: true });
    element.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      element.removeEventListener("pointerenter", onPointerEnter);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [sceneSize.height, sceneSize.width]);

  useEffect(() => {
    particleRefs.current = particleRefs.current.slice(0, count);
    particlesRef.current = createParticles(count, sceneSize.width, sceneSize.height);
    introStartTime.current = null;
  }, [count, sceneSize.height, sceneSize.width]);

  const particleIds = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => `particle-${index}-${count}`),
    [count],
  );

  const viewBox = useMemo(() => {
    const width = Math.max(sceneSize.width, 1);
    const height = Math.max(sceneSize.height, 1);
    return `${-width / 2} ${-height / 2} ${width} ${height}`;
  }, [sceneSize.height, sceneSize.width]);

  useEffect(() => {
    if (!size.width || !size.height) return;

    const magnetRadiusSq = magnetRadius * magnetRadius;
    const inverseFieldStrength = 5 / (fieldStrength + 0.1);

    const tick = (now: number) => {
      if (isPageVisible.current) {
        if (introStartTime.current === null) {
          introStartTime.current = now;
        }

        const particles = particlesRef.current;

        const mouseDeltaX = pointerRef.current.x - lastMousePos.current.x;
        const mouseDeltaY = pointerRef.current.y - lastMousePos.current.y;
        const mouseDistSq =
          mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY;

        if (mouseDistSq > 0.000001) {
          lastMouseMoveTime.current = now;
          lastMousePos.current = { ...pointerRef.current };
        }

        let destX = pointerRef.current.x;
        let destY = pointerRef.current.y;

        if (!isPointerInside.current && autoAnimate) {
          const time = now / 1000;
          destX = Math.sin(time * 0.5) * (sceneSize.width / 4);
          destY = Math.cos(time) * (sceneSize.height / 4);
        }

        virtualMouse.current.x += (destX - virtualMouse.current.x) * 0.05;
        virtualMouse.current.y += (destY - virtualMouse.current.y) * 0.05;

        const targetX = virtualMouse.current.x;
        const targetY = virtualMouse.current.y;
        const globalRotation = (now / 1000) * rotationSpeed;

        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i];
          const element = particleRefs.current[i];

          if (!element) continue;

          particle.t += particle.speed / 2;

          const projectionFactor = 1 - particle.cz / 50;
          const projectedTargetX = targetX * projectionFactor;
          const projectedTargetY = targetY * projectionFactor;

          const dx = particle.mx - projectedTargetX;
          const dy = particle.my - projectedTargetY;
          const distSq = dx * dx + dy * dy;

          let targetXPos = particle.mx;
          let targetYPos = particle.my;
          let targetZPos = particle.mz * depthFactor;

          if (distSq < magnetRadiusSq) {
            const angle = Math.atan2(dy, dx) + globalRotation;
            const wave =
              Math.sin(particle.t * waveSpeed + angle) * (0.5 * waveAmplitude);
            const deviation = particle.randomRadiusOffset * inverseFieldStrength;
            const currentRingRadius = ringRadius + wave + deviation;

            targetXPos =
              projectedTargetX + currentRingRadius * Math.cos(angle);
            targetYPos =
              projectedTargetY + currentRingRadius * Math.sin(angle);
            targetZPos =
              particle.mz * depthFactor +
              Math.sin(particle.t) * waveAmplitude * depthFactor;
          }

          particle.cx += (targetXPos - particle.cx) * lerpSpeed;
          particle.cy += (targetYPos - particle.cy) * lerpSpeed;
          particle.cz += (targetZPos - particle.cz) * lerpSpeed;

          const currentDx = particle.cx - projectedTargetX;
          const currentDy = particle.cy - projectedTargetY;
          const currentDistToMouse = Math.sqrt(
            currentDx * currentDx + currentDy * currentDy,
          );

          const distFromRing = Math.abs(currentDistToMouse - ringRadius);
          const scaleFactor = clamp(1 - distFromRing / 10, 0, 1);
          const finalScale =
            scaleFactor *
            (0.8 + Math.sin(particle.t * pulseSpeed) * 0.2 * particleVariance) *
            particleSize;

          const angleToCenter =
            (Math.atan2(projectedTargetY - particle.cy, projectedTargetX - particle.cx) *
              180) /
            Math.PI;
          const introProgress = clamp(
            (now - introStartTime.current - particle.introOffset) /
              INTRO_DURATION_MS,
            0,
            1,
          );
          const depthOpacity =
            clamp(0.25 + (particle.cz + 20) / 40, 0.25, 1) * introProgress;

          element.setAttribute(
            "transform",
            `translate(${particle.cx} ${particle.cy}) rotate(${angleToCenter}) scale(${finalScale})`,
          );
          element.setAttribute("opacity", depthOpacity.toFixed(3));
        }
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [
    autoAnimate,
    depthFactor,
    fieldStrength,
    lerpSpeed,
    magnetRadius,
    particleSize,
    particleVariance,
    pulseSpeed,
    ringRadius,
    rotationSpeed,
    sceneSize.height,
    sceneSize.width,
    size.height,
    size.width,
    waveAmplitude,
    waveSpeed,
  ]);

  const particleNode = useMemo(() => {
    if (particleShape === "sphere") {
      return <circle r="0.2" fill={color} />;
    }

    if (particleShape === "box") {
      return <rect x="-0.15" y="-0.15" width="0.3" height="0.3" fill={color} />;
    }

    if (particleShape === "tetrahedron") {
      return <polygon points="0,-0.3 0.26,0.15 -0.26,0.15" fill={color} />;
    }

    return (
      <rect
        x="-0.1"
        y="-0.3"
        width="0.2"
        height="0.6"
        rx="0.1"
        fill={color}
      />
    );
  }, [color, particleShape]);

  return (
    <div ref={containerRef} className="h-full w-full pointer-events-none">
      <svg
        aria-hidden="true"
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {particleIds.map((particleId, index) => (
          <g
            key={particleId}
            opacity="0"
            ref={(element) => {
              particleRefs.current[index] = element;
            }}
          >
            {particleNode}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default AntigravityInner;
