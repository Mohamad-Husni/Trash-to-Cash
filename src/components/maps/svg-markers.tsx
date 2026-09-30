"use client";

import { useMapContext } from "./svg-fallback-map";
import { getFillColor } from "@/lib/constants";

interface SvgBinMarkerProps {
  lat: number;
  lng: number;
  fillPct: number;
  label?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function SvgBinMarker({ lat, lng, fillPct, label, onClick, selected }: SvgBinMarkerProps) {
  const { project } = useMapContext();
  const { x, y } = project(lat, lng);
  const color = getFillColor(fillPct);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {selected && <circle r={18} fill={color} opacity={0.3} className="animate-pulse" />}
      <path
        d="M0 -14 L-10 4 L10 4 Z"
        fill={color}
        stroke="white"
        strokeWidth={selected ? 2.5 : 1.5}
      />
      <circle cx={0} cy={-2} r={3} fill="white" />
      {label && (
        <text x={0} y={18} textAnchor="middle" fontSize={10} fill="rgba(224,224,224,0.8)" className="dark:fill-white">
          {label.length > 12 ? label.slice(0, 10) + "…" : label}
        </text>
      )}
    </g>
  );
}

interface SvgJobMarkerProps {
  lat: number;
  lng: number;
  label?: string;
  onClick?: () => void;
}

export function SvgJobMarker({ lat, lng, label, onClick }: SvgJobMarkerProps) {
  const { project } = useMapContext();
  const { x, y } = project(lat, lng);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <circle r={14} fill="#f97316" opacity={0.2} className="animate-pulse" />
      <path
        d="M0 -16 L-12 6 L12 6 Z"
        fill="#f97316"
        stroke="white"
        strokeWidth={2}
      />
      <text x={0} y={2} textAnchor="middle" fontSize={9} fill="white" fontWeight="bold">
        🗑
      </text>
      {label && (
        <text x={0} y={20} textAnchor="middle" fontSize={10} fill="rgba(224,224,224,0.8)" className="dark:fill-white">
          {label.length > 12 ? label.slice(0, 10) + "…" : label}
        </text>
      )}
    </g>
  );
}

interface SvgCollectorMarkerProps {
  lat: number;
  lng: number;
  draggable?: boolean;
  onDrag?: (lat: number, lng: number) => void;
}

export function SvgCollectorMarker({ lat, lng, draggable, onDrag }: SvgCollectorMarkerProps) {
  const { project, unproject, width, height } = useMapContext();
  const { x, y } = project(lat, lng);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggable || !onDrag) return;
    e.stopPropagation();
    const svg = (e.currentTarget.closest("svg") as SVGSVGElement);
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const onMove = (ev: MouseEvent) => {
      const px = (ev.clientX - rect.left) * scaleX;
      const py = (ev.clientY - rect.top) * scaleY;
      const { lat: newLat, lng: newLng } = unproject(
        Math.max(0, Math.min(width, px)),
        Math.max(0, Math.min(height, py))
      );
      onDrag(newLat, newLng);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseDown={handleMouseDown}
      style={{ cursor: draggable ? "grab" : "default" }}
    >
      <circle r={20} fill="#0099FF" opacity={0.15} />
      <circle r={10} fill="#0099FF" stroke="white" strokeWidth={2.5} />
      <circle r={4} fill="white" />
      <text x={0} y={-16} textAnchor="middle" fontSize={11} fill="#0099FF" fontWeight="bold">
        🚚
      </text>
    </g>
  );
}
