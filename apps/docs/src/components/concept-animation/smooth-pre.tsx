"use client";

import { type CustomPreProps, InnerPre, getPreRef } from "codehike/code";
import {
  type TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "codehike/utils/token-transitions";
import React from "react";

const TRANSITION_DURATION = 900;

/**
 * The Code Hike token-transitions pre: snapshots token positions before an
 * update, then animates each token from its old position/color to the new
 * one with the Web Animations API. Class component because the recipe needs
 * getSnapshotBeforeUpdate.
 */
export class SmoothPre extends React.Component<CustomPreProps> {
  ref: React.RefObject<HTMLPreElement | null>;

  constructor(props: CustomPreProps) {
    super(props);
    this.ref = getPreRef(this.props);
  }

  render() {
    return <InnerPre merge={this.props} style={{ position: "relative" }} />;
  }

  getSnapshotBeforeUpdate(): TokenTransitionsSnapshot | null {
    return this.ref.current ? getStartingSnapshot(this.ref.current) : null;
  }

  componentDidUpdate(
    _prevProps: unknown,
    _prevState: unknown,
    snapshot: TokenTransitionsSnapshot | null,
  ) {
    if (!this.ref.current || !snapshot) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const transitions = calculateTransitions(this.ref.current, snapshot);
    for (const { element, keyframes, options } of transitions) {
      const { translateX, translateY, ...rest } = keyframes as Record<
        string,
        [number | string, number | string]
      >;
      const frames: Record<string, [number | string, number | string]> = rest;
      if (translateX && translateY) {
        frames.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ];
      }
      element.animate(frames as PropertyIndexedKeyframes, {
        duration: options.duration * TRANSITION_DURATION,
        delay: options.delay * TRANSITION_DURATION,
        easing: options.easing,
        fill: "both",
      });
    }
  }
}
