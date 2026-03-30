"use client";
/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

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
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });
  const isPageVisible = useRef(true);

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

  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;

      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      temp.push({
        t,
        factor,
        speed,
        xFactor,
        yFactor,
        zFactor,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        randomRadiusOffset,
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh || !isPageVisible.current) return;

    const { viewport: v, pointer: m } = state;
    const now = performance.now();

    const mouseDeltaX = m.x - lastMousePos.current.x;
    const mouseDeltaY = m.y - lastMousePos.current.y;
    const mouseDistSq =
      mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY;

    if (mouseDistSq > 0.000001) {
      lastMouseMoveTime.current = now;
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    if (autoAnimate && now - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (v.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;

    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;
    const magnetRadiusSq = magnetRadius * magnetRadius;
    const inverseFieldStrength = 5 / (fieldStrength + 0.1);

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const mx = particle.mx;
      const my = particle.my;
      const mz = particle.mz;
      const cz = particle.cz;
      const randomRadiusOffset = particle.randomRadiusOffset;
      particle.t += particle.speed / 2;
      const t = particle.t;

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const distSq = dx * dx + dy * dy;

      let targetXPos = mx;
      let targetYPos = my;
      let targetZPos = mz * depthFactor;

      if (distSq < magnetRadiusSq) {
        const angle = Math.atan2(dy, dx) + globalRotation;

        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = randomRadiusOffset * inverseFieldStrength;

        const currentRingRadius = ringRadius + wave + deviation;

        targetXPos = projectedTargetX + currentRingRadius * Math.cos(angle);
        targetYPos = projectedTargetY + currentRingRadius * Math.sin(angle);
        targetZPos = mz * depthFactor + Math.sin(t) * waveAmplitude * depthFactor;
      }

      particle.cx += (targetXPos - particle.cx) * lerpSpeed;
      particle.cy += (targetYPos - particle.cy) * lerpSpeed;
      particle.cz += (targetZPos - particle.cz) * lerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.cz);

      dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
      dummy.rotateX(Math.PI / 2);

      const currentDx = particle.cx - projectedTargetX;
      const currentDy = particle.cy - projectedTargetY;
      const currentDistToMouse = Math.sqrt(
        currentDx * currentDx + currentDy * currentDy,
      );

      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      let scaleFactor = 1 - distFromRing / 10;

      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale =
        scaleFactor *
        (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) *
        particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === "capsule" && (
        <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
      )}
      {particleShape === "sphere" && <sphereGeometry args={[0.2, 16, 16]} />}
      {particleShape === "box" && <boxGeometry args={[0.3, 0.3, 0.3]} />}
      {particleShape === "tetrahedron" && <tetrahedronGeometry args={[0.3]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

const Antigravity = (props: any) => {
  const [shouldStart, setShouldStart] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleCallbackId: number | null = null;

    const scheduleStartup = () => {
      const hasIdleCallback =
        typeof window.requestIdleCallback === "function";

      if (hasIdleCallback) {
        idleCallbackId = window.requestIdleCallback(
          () => setShouldStart(true),
          { timeout: 500 },
        );
        return;
      }

      timeoutId = setTimeout(() => setShouldStart(true), 0);
    };

    if (document.readyState === "complete") {
      scheduleStartup();
    } else {
      window.addEventListener("load", scheduleStartup, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleStartup);

      if (
        idleCallbackId !== null &&
        "cancelIdleCallback" in window
      ) {
        window.cancelIdleCallback(idleCallbackId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!shouldStart) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 50], fov: 35 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <AntigravityInner {...props} />
    </Canvas>
  );
};

export default Antigravity;
