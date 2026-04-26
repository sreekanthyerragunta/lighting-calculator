"use client";
import { useState } from "react";

export default function Home() {
  // INPUT STATE (user typing)
  const [inputs, setInputs] = useState({
    length: 12,
    width: 10,
    roomType: "living",
    lumensPerLight: 800,
  });

  // APPLIED STATE (used for calculation)
  const [appliedInputs, setAppliedInputs] = useState(inputs);

  // DIRTY FLAG
  const [isDirty, setIsDirty] = useState(false);

  // HANDLE INPUT CHANGE
  const handleChange = (field: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]: field === "roomType" ? value : Number(value),
    }));
    setIsDirty(true);
  };

  // CALCULATE BUTTON
  const handleCalculate = () => {
    setAppliedInputs(inputs);
    setIsDirty(false);
  };

  // ---------------- CALCULATIONS ----------------

  function calculateLayout(length: number, width: number, lights: number) {

    let rows = 0, cols = 0, spacingX = 0, spacingY = 0, wallOffsetX = 0, wallOffsetY = 0;

    if (length >= width) {
      rows = Math.floor(Math.sqrt(lights));
      cols = Math.ceil(lights / rows);

      spacingX = length / cols;
      spacingY = width / rows;
      
      wallOffsetX = spacingX / 2;
      wallOffsetY = spacingY / 2;
    }
    else {
      cols = Math.floor(Math.sqrt(lights));
      rows = Math.ceil(lights / cols);

      spacingX = length / cols;
      spacingY = width / rows;

      wallOffsetX = spacingX / 2;
      wallOffsetY = spacingY / 2;
    }
    
    return { rows, cols, spacingX, spacingY, wallOffsetX, wallOffsetY };
  }

  function calculateWattsAndLumens(
    length: number,
    width: number,
    roomType: string
  ) {
    const area = length * width;

    let wattsPerSqFt = 0.6;
    let lumensPerSqFt = 30;

    if (roomType === "bedroom") lumensPerSqFt = 20;
    else if (roomType === "kitchen") lumensPerSqFt = 40;

    return {
      watts: area * wattsPerSqFt,
      lumens: area * lumensPerSqFt,
    };
  }

  // USE APPLIED VALUES ONLY
  const { length, width, roomType, lumensPerLight } = appliedInputs;

  const lighting = calculateWattsAndLumens(length, width, roomType);

  const recommendedLights =
    Math.ceil(lighting.lumens / lumensPerLight) +
    (Math.ceil(lighting.lumens / lumensPerLight) % 2);

  const result = calculateLayout(length, width, recommendedLights);

  const maxSize = 360;
  const scale = Math.min(maxSize / length, maxSize / width);

  const roomWidthPx = length * scale;
  const roomHeightPx = width * scale;

  // used for disabling the button if fields are empty or 0
  const isInvalid = Object.values(inputs).some(val => val === 0 || val === "");

  // ---------------- UI ----------------

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 360,
        }}
      >
        {/* INPUT CARD */}
        <div
          style={{
            background: "#99c0ea",
            padding: 15,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            color: "black"
          }}
        >
          <h3 style={{ fontSize: 24, fontWeight: "bold" }}>
            Input Room Settings
          </h3>

          <label style = {{fontWeight: "bold"}}>Room Type</label>
          <select
            value={inputs.roomType}
            onChange={(e) => handleChange("roomType", e.target.value)}
            style={{
                border: "2px solid #67a0c4", // Thickness, style, and color
                borderRadius: "4px",      // Rounds the corners
                padding: "8px",           // Adds space inside the box
                outline: "none",           // Removes the default browser glow
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
          >
            <option value="living">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="kitchen">Kitchen</option>
          </select>

          <label style = {{fontWeight: "bold"}}>Length in ft.</label>
          <input
            type="number"
            step="0.01"
            value={inputs.length === 0 ? "" : inputs.length}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              const value = target.value;
              // Regex: up to 3 digits before decimal, optional decimal with up to 2 digits
              const regex = /^\d{0,3}(\.\d{0,2})?$/;
              if (!regex.test(value)) {
                target.value = value.slice(0, -1);
              }
            }}
            onChange={(e) => handleChange("length", Number(e.target.value))}
            style={{
                border: "2px solid #67a0c4", // Thickness, style, and color
                borderRadius: "4px",      // Rounds the corners
                padding: "8px",           // Adds space inside the box
                outline: "none",           // Removes the default browser glow
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
          />

          <label style = {{fontWeight: "bold"}}>Width in ft.</label>
          <input
            type="number"
            step="0.01"
            value={inputs.width === 0 ? "" : inputs.width}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              const value = target.value;

              // Regex: up to 3 digits before decimal, optional decimal with up to 2 digits
              const regex = /^\d{0,3}(\.\d{0,2})?$/;

              if (!regex.test(value)) {
                target.value = value.slice(0, -1);
              }
            }}
            onChange={(e) => handleChange("width", Number(e.target.value))}
            style={{
                border: "2px solid #67a0c4", // Thickness, style, and color
                borderRadius: "4px",      // Rounds the corners
                padding: "8px",           // Adds space inside the box
                outline: "none",           // Removes the default browser glow
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
          />

          <label style = {{fontWeight: "bold"}}>Lumens per light</label>
          <input
            type="number"
            value={inputs.lumensPerLight === 0 ? "": inputs.lumensPerLight}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.value.length > 5) {
                target.value = target.value.slice(0, 5);
              }
            }}
            onChange={(e) => handleChange("lumensPerLight", Number(e.target.value))}
            style={{
                border: "2px solid #67a0c4", // Thickness, style, and color
                borderRadius: "4px",      // Rounds the corners
                padding: "8px",           // Adds space inside the box
                outline: "none",           // Removes the default browser glow
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
          />

          {/* CALCULATE BUTTON */}
          <button
            onClick={handleCalculate}
            disabled={!isDirty || isInvalid}
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: isDirty ? "#007bff" : "#6da5e1",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: isDirty ? "pointer" : "not-allowed",
            }}
          >
            Calculate
          </button>
        </div>

        {/* RIGHT SIDE → Recommended Lighting */}
        {!isDirty && (
          <div
          style={{
            padding: 15,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#a8e485",
            minWidth: 220,
            width: "100%",
            maxWidth: 360,
            color: "black",
          }}>
          <h3 style={{fontWeight: "bold", fontSize: '24px'}}>Recommended Lighting</h3>

          <p>
            <strong>Total Watts:</strong> {lighting.watts.toFixed(1)} W
          </p>

          <p>
            <strong>Total Lumens:</strong> {lighting.lumens.toFixed(0)} lm
          </p>

          <p>
            <strong>Number of Lights:</strong>{" "}
            {recommendedLights}
          </p>
        </div>
        )}
      </div>

      {!isDirty &&(
        <h3 style={{ marginTop: 50, fontWeight: 'bold', fontSize: '24px', maxWidth: 360}}>Lights positioning</h3>
      )}
      
      {/* Room */}
      {!isDirty && (
        <div
          style={{
            marginTop: 10,
            position: "relative",
            width: roomWidthPx,
            maxWidth: 360,
            height: roomHeightPx,
            border: "2px solid black",
            background: "#f9f9f9",
          }}>
            
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
              maxWidth: 360
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
      )}
    </div>
  );
}