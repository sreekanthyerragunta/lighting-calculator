"use client";
import { useState } from "react";

export default function Home() {
  const [length, setLength] = useState(120);
  const [width, setWidth] = useState(60);
  const [lights, setLights] = useState(6);

  function calculateLayout(length: number, width: number, lights: number) {
    const rows = Math.floor(Math.sqrt(lights));
    const cols = Math.ceil(lights / rows);

    const spacingX = length / cols;
    const spacingY = width / rows;

    const wallOffsetX = spacingX / 2;
    const wallOffsetY = spacingY / 2;

    return {
      rows,
      cols,
      spacingX,
      spacingY,
      wallOffsetX,
      wallOffsetY,
    };
  }

  const result = calculateLayout(length, width, lights);

  const maxSize = 400;
  const scale = Math.min(maxSize / length, maxSize / width);

  const roomWidthPx = length * scale;
  const roomHeightPx = width * scale;

  return (
    <div style={{ padding: 20 }}>
      <h2>Lighting Calculator</h2>

      {/* Inputs */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          placeholder="Length"
        />
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          placeholder="Width"
        />
        <input
          type="number"
          value={lights}
          onChange={(e) => setLights(Number(e.target.value))}
          placeholder="Lights"
        />
      </div>

      {/* Room */}
      <div
        style={{
          marginTop: 40,
          position: "relative",
          width: roomWidthPx,
          height: roomHeightPx,
          border: "2px solid black",
          background: "#f9f9f9",
        }}
      >
        {/* LIGHTS */}
        {Array.from({ length: result.rows }).map((_, row) =>
          Array.from({ length: result.cols }).map((_, col) => {
            const x =
              (result.wallOffsetX + col * result.spacingX) * scale;

            const y =
              (result.wallOffsetY + row * result.spacingY) * scale;

            return (
              <div
                key={`${row}-${col}`}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: 12,
                  height: 12,
                  background: "orange",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            );
          })
        )}

        {/* SVG DIMENSIONS */}
        <svg
          width={roomWidthPx}
          height={roomHeightPx}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="blue" />
            </marker>
          </defs>

          {/* TOP TOTAL LENGTH */}
          <line
            x1={0}
            y1={15}
            x2={roomWidthPx}
            y2={15}
            stroke="blue"
            strokeWidth="1.5"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
          <text
            x={roomWidthPx / 2}
            y={12}
            textAnchor="middle"
            fontSize="12"
            fill="blue"
          >
            {length}
          </text>

          {/* HORIZONTAL SEGMENTS */}
          {Array.from({ length: result.cols }).map((_, i) => {
            const x1 =
              (i === 0
                ? 0
                : result.wallOffsetX + (i - 1) * result.spacingX) *
              scale;

            const x2 =
              (result.wallOffsetX + i * result.spacingX) * scale;

            const value =
              i === 0 || i === result.cols
                ? result.wallOffsetX
                : result.spacingX;

            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={roomHeightPx / 2}
                  x2={x2}
                  y2={roomHeightPx / 2}
                  stroke="blue"
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={roomHeightPx / 2 - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="red"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* VERTICAL SEGMENTS */}
          {Array.from({ length: result.rows }).map((_, i) => {
            const y1 =
              (i === 0
                ? 0
                : result.wallOffsetY + (i - 1) * result.spacingY) *
              scale;

            const y2 =
              (result.wallOffsetY + i * result.spacingY) * scale;

            const value =
              i === 0 || i === result.rows
                ? result.wallOffsetY
                : result.spacingY;

            return (
              <g key={i}>
                <line
                  x1={roomWidthPx - 15}
                  y1={y1}
                  x2={roomWidthPx - 15}
                  y2={y2}
                  stroke="blue"
                  markerStart="url(#arrow)"
                  markerEnd="url(#arrow)"
                />
                <text
                  x={roomWidthPx - 30}
                  y={(y1 + y2) / 2}
                  textAnchor="middle"
                  fontSize="12"
                  fill="red"
                >
                  {value.toFixed(1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}