"use client";

import { useEffect, useRef, useState } from "react";
import { Blocks, Database, Heart, Rocket, Sparkles, Star, Sun, X } from "lucide-react";
import { observeAnimationActivity } from "@/lib/animation-activity";

export function AprilFoolsAnnouncement() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <a href="#main-content" className="playtime-skip-link">
        Skip to content
      </a>
      {visible && (
        <div className="playtime-announcement">
          <Star size={16} fill="currentColor" aria-hidden="true" />
          <p>Happy April Fools&apos; Day! The grown-ups left us in charge.</p>
          <Star size={16} fill="currentColor" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setVisible(false)}
            aria-label="Dismiss April Fools announcement"
            className="playtime-dismiss"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}

// CSS owns the small, compositor-only animations. The existing activity helper
// pauses them offscreen, in hidden tabs, and when reduced motion is requested.
export function BuildingBlocks() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    return observeAnimationActivity(element, (active) => {
      element.dataset.motionActive = String(active);
    });
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timeout = window.setTimeout(() => setPlaying(false), 750);
    return () => window.clearTimeout(timeout);
  }, [playing]);

  return (
    <div ref={ref} className={`playtime-illustration${playing ? " is-playing" : ""}`}>
      <div className="playtime-illustration-scene" aria-hidden="true">
        <div className="playtime-sun">
          <Sun size={68} strokeWidth={2.2} />
        </div>
        <Star className="playtime-star playtime-star-pink" size={34} fill="currentColor" />
        <Star className="playtime-star playtime-star-blue" size={26} fill="currentColor" />
        <div className="playtime-cloud playtime-cloud-one" />
        <div className="playtime-cloud playtime-cloud-two" />
        <div className="playtime-toy playtime-toy-app">
          <Rocket size={40} strokeWidth={2.2} />
          <span>Your TypeScript app</span>
          <span className="playtime-toy-sparkle">✦</span>
        </div>
        <div className="playtime-toy playtime-toy-data">
          <Database size={42} strokeWidth={2.2} />
          <div>
            <strong>Prisma Postgres</strong>
            <span>Managed database</span>
          </div>
          <Heart size={21} fill="currentColor" />
        </div>
        <div className="playtime-toy-bottom">
          <div className="playtime-toy playtime-toy-code">
            <Blocks size={29} />
            <span>Prisma ORM</span>
          </div>
          <div className="playtime-toy playtime-toy-host">
            <Sparkles size={28} />
            <span>Compute</span>
          </div>
        </div>
        <div className="playtime-ground" />
      </div>
      <button
        type="button"
        className="playtime-wiggle-button"
        onClick={() => setPlaying(true)}
        aria-label="Animate the building blocks"
      >
        <Sparkles size={16} aria-hidden="true" /> Give it a wiggle
      </button>
    </div>
  );
}
