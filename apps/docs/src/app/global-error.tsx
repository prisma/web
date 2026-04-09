"use client";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { DocsLayout } from "@/components/layout/notebook";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <head>
        <style>{`
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            overflow: hidden;
            position: fixed;
            inset: 0;
            color: #e5e5e5;
            background: #131420;
            background-size: 100% 4px;
          }
          .glitch {
            position: relative;
            font-size: 10rem;
            font-weight: 800;
            margin-bottom: 1rem;
            pointer-events: none;
          }
          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            overflow: hidden;
          }
          .glitch::before {
            left: 2px;
            text-shadow: -2px 0 red;
            animation: glitch-1 2s infinite linear alternate-reverse;
          }
          .glitch::after {
            left: -2px;
            text-shadow: -2px 0 cyan;
            animation: glitch-2 1.5s infinite linear alternate-reverse;
          }
          @keyframes glitch-1 {
            0% { clip-path: inset(20% 0 60% 0); }
            20% { clip-path: inset(10% 0 85% 0); }
            40% { clip-path: inset(40% 0 40% 0); }
            60% { clip-path: inset(80% 0 5% 0); }
            80% { clip-path: inset(50% 0 30% 0); }
            100% { clip-path: inset(25% 0 55% 0); }
          }
          @keyframes glitch-2 {
            0% { clip-path: inset(80% 0 5% 0); }
            20% { clip-path: inset(50% 0 30% 0); }
            40% { clip-path: inset(20% 0 60% 0); }
            60% { clip-path: inset(10% 0 85% 0); }
            80% { clip-path: inset(40% 0 40% 0); }
            100% { clip-path: inset(75% 0 15% 0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .glitch::before, .glitch::after { animation: none; }
          }
          .subtitle {
            font-size: 1.5rem;
            font-weight: 600;
            color: white;
            margin-bottom: 1rem;
          }
          a {
            color: #e5e5e5;
            text-decoration: none;
            transition: text-decoration 0.2s;
          }
          a:hover {
            text-decoration: underline;
          }
        `}</style>
      </head>
      <body>
        <h1 className="glitch" data-text="Error">
          Error
        </h1>
        <p className="subtitle">Something went wrong</p>
        <a href="https://www.prisma.io/docs">Go to docs</a>
      </body>
    </html>
  );
}
