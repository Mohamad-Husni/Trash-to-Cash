"use client";

import { useJsApiLoader, GoogleMap as GoogleMapReact, Circle } from "@react-google-maps/api";
import type { ReactNode } from "react";
import { MAP_DEFAULT_ZOOM } from "@/lib/constants";

const libraries: ("geometry" | "places" | "drawing")[] = ["geometry"];

interface GoogleMapInnerProps {
  center: { lat: number; lng: number };
  zoom?: number;
  apiKey: string;
  children?: ReactNode;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  radiusKm?: number;
  showRadius?: boolean;
}

export function GoogleMapInner({
  center,
  zoom = MAP_DEFAULT_ZOOM,
  apiKey,
  children,
  onMapClick,
  className,
  radiusKm,
  showRadius = false,
}: GoogleMapInnerProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (!isLoaded) {
    return (
      <div className={`flex min-h-[250px] items-center justify-center rounded-lg border bg-muted ${className || "h-[300px] sm:h-[400px] md:h-[500px]"}`}>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={`h-full min-h-[250px] overflow-hidden rounded-lg border ${className || "h-[300px] sm:h-[400px] md:h-[500px]"}`}>
      <GoogleMapReact
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        onClick={(e) => {
          if (onMapClick && e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
          }
        }}
        options={{
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {showRadius && radiusKm && (
          <Circle
            center={center}
            radius={radiusKm * 1000}
            options={{
              fillColor: "#0099FF",
              fillOpacity: 0.08,
              strokeColor: "#0099FF",
              strokeOpacity: 0.4,
              strokeWeight: 2,
              clickable: false,
            }}
          />
        )}
        {children}
      </GoogleMapReact>
    </div>
  );
}
