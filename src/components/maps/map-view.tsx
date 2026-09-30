"use client";

import { GoogleMapView } from "./google-map-view";
import { SvgFallbackMap } from "./svg-fallback-map";
import { MAP_DEFAULT_ZOOM, COLLECTOR_RADIUS_KM } from "@/lib/constants";
import type { Bin, PickupRequest } from "@/types";
import { SvgBinMarker, SvgJobMarker, SvgCollectorMarker } from "./svg-markers";
import { GoogleBinMarker, GoogleJobMarker } from "./google-markers";
import { Marker as GoogleMarker } from "@react-google-maps/api";

interface MapViewProps {
  center: { lat: number; lng: number };
  bins?: Bin[];
  requests?: PickupRequest[];
  onBinClick?: (bin: Bin) => void;
  onRequestClick?: (req: PickupRequest) => void;
  showRadius?: boolean;
  radiusKm?: number;
  collectorMarker?: { lat: number; lng: number; draggable?: boolean; onDrag?: (lat: number, lng: number) => void };
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  filterBinsByRadius?: boolean;
  fillThreshold?: number;
}

export function MapView({
  center,
  bins = [],
  requests = [],
  onBinClick,
  onRequestClick,
  showRadius = false,
  radiusKm = COLLECTOR_RADIUS_KM,
  collectorMarker,
  onMapClick,
  className,
  filterBinsByRadius = false,
  fillThreshold,
}: MapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const useGoogle = !!apiKey;

  // Filter bins by radius if needed
  const visibleBins = filterBinsByRadius
    ? bins.filter((b) => {
        const dx = b.lat - center.lat;
        const dy = b.lng - center.lng;
        const distKm = Math.sqrt(dx * dx * 111 * 111 + dy * dy * 111 * 111 * Math.cos((center.lat * Math.PI) / 180));
        return distKm <= radiusKm;
      })
    : bins;

  const thresholdBins = fillThreshold !== undefined ? visibleBins.filter((b) => b.fillPct >= fillThreshold) : visibleBins;

  // Filter requests by radius if needed
  const visibleRequests = filterBinsByRadius
    ? requests.filter((r) => {
        const bin = bins.find((b) => b.id === r.binId);
        if (!bin) return false;
        const dx = bin.lat - center.lat;
        const dy = bin.lng - center.lng;
        const distKm = Math.sqrt(dx * dx * 111 * 111 + dy * dy * 111 * 111 * Math.cos((center.lat * Math.PI) / 180));
        return distKm <= radiusKm;
      })
    : requests;

  if (useGoogle) {
    return (
      <GoogleMapView center={center} zoom={MAP_DEFAULT_ZOOM} onMapClick={onMapClick} className={className}>
        {showRadius && (
          <></>
        )}
        {collectorMarker && (
          <GoogleMarker
            position={{ lat: collectorMarker.lat, lng: collectorMarker.lng }}
            draggable={collectorMarker.draggable}
            onDrag={(e) => collectorMarker.onDrag?.(e.latLng?.lat() || 0, e.latLng?.lng() || 0)}
            icon={{
              path: 0,
              scale: 0,
            }}
            label="🚚"
          />
        )}
        {thresholdBins.map((bin) => (
          <GoogleMarker
            key={bin.id}
            position={{ lat: bin.lat, lng: bin.lng }}
            onClick={() => onBinClick?.(bin)}
            icon={{
              path: 0,
              scale: 0,
            }}
          >
            <GoogleBinMarker
              lat={bin.lat}
              lng={bin.lng}
              fillPct={bin.fillPct}
              label={bin.label}
              onClick={() => onBinClick?.(bin)}
            />
          </GoogleMarker>
        ))}
        {visibleRequests.map((req) => {
          const bin = bins.find((b) => b.id === req.binId);
          if (!bin) return null;
          return (
            <GoogleMarker
              key={req.id}
              position={{ lat: bin.lat, lng: bin.lng }}
              onClick={() => onRequestClick?.(req)}
              icon={{
                path: 0,
                scale: 0,
              }}
            >
              <GoogleJobMarker
                lat={bin.lat}
                lng={bin.lng}
                fillPct={0}
                label={bin.label}
                onClick={() => onRequestClick?.(req)}
              />
            </GoogleMarker>
          );
        })}
      </GoogleMapView>
    );
  }

  return (
    <SvgFallbackMap
      center={center}
      radiusKm={showRadius ? radiusKm : undefined}
      showRadius={showRadius}
      onMapClick={onMapClick}
      className={className}
    >
      {collectorMarker && (
        <SvgCollectorMarker
          lat={collectorMarker.lat}
          lng={collectorMarker.lng}
          draggable={collectorMarker.draggable}
          onDrag={collectorMarker.onDrag}
        />
      )}
      {thresholdBins.map((bin) => (
        <SvgBinMarker
          key={bin.id}
          lat={bin.lat}
          lng={bin.lng}
          fillPct={bin.fillPct}
          label={bin.label}
          onClick={() => onBinClick?.(bin)}
        />
      ))}
      {visibleRequests.map((req) => {
        const bin = bins.find((b) => b.id === req.binId);
        if (!bin) return null;
        return (
          <SvgJobMarker
            key={req.id}
            lat={bin.lat}
            lng={bin.lng}
            label={bin.label}
            onClick={() => onRequestClick?.(req)}
          />
        );
      })}
    </SvgFallbackMap>
  );
}
