"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRequests, useBins, useCollectors } from "@/lib/hooks/queries";
import { useClaimJob } from "@/lib/hooks/mutations";
import { MapView } from "@/components/maps/map-view";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Trash2, User, Clock, Hand, Navigation } from "lucide-react";
import { WASTAGE_META, COLLECTOR_RADIUS_KM, HIGH_FILL_THRESHOLD } from "@/lib/constants";
import { haversineKm } from "@/lib/points";
import type { Bin, PickupRequest } from "@/types";

export default function CollectorDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const { data: requests = [] } = useRequests();
  const { data: bins = [] } = useBins();
  const { data: collectors = [] } = useCollectors();
  const claimJob = useClaimJob();

  const collector = collectors.find((c) => c.userId === user?.id);
  const collectorLat = collector?.lat || 6.9271;
  const collectorLng = collector?.lng || 79.8612;

  const [mockLocation, setMockLocation] = useState(false);
  const [mockLat, setMockLat] = useState(collectorLat);
  const [mockLng, setMockLng] = useState(collectorLng);
  const [selectedItem, setSelectedItem] = useState<{ type: "job" | "bin"; req?: PickupRequest; bin?: Bin } | null>(null);

  const center = mockLocation ? { lat: mockLat, lng: mockLng } : { lat: collectorLat, lng: collectorLng };

  // Active pending requests (jobs available to claim)
  const availableJobs = requests.filter((r) => r.status === "pending");

  // Public bins >= 80% fill
  const highFillBins = bins.filter((b) => b.isPublic && b.fillPct >= HIGH_FILL_THRESHOLD);

  const handleClaim = (req: PickupRequest) => {
    if (!collector) return;
    claimJob(req.id, collector.id);
    setSelectedItem(null);
    router.push(`/collector/active-job/${req.id}`);
  };

  const jobBin = selectedItem?.req ? bins.find((b) => b.id === selectedItem.req!.binId) : null;
  const jobCitizen = selectedItem?.req ? selectedItem.req.citizenId : null;

  return (
    <div className="w-full space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Collector Dashboard</h1>
          <p className="text-muted-foreground">Nearby pickup requests and high-fill bins</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Switch
            id="mock-loc"
            checked={mockLocation}
            onCheckedChange={setMockLocation}
          />
          <Label htmlFor="mock-loc" className="text-sm">Mock Location</Label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#0099FF]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#003B73] to-[#0055A4] shadow-md">
                <Trash2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableJobs.length}</p>
                <p className="text-xs text-muted-foreground">Available Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#0099FF]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-500 shadow-md">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{highFillBins.length}</p>
                <p className="text-xs text-muted-foreground">Critical Bins (≥80%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#0099FF]/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sapphire-gradient shadow-md glow-primary">
                <Navigation className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{COLLECTOR_RADIUS_KM}km</p>
                <p className="text-xs text-muted-foreground">Search Radius</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MapView
        center={center}
        bins={bins}
        requests={availableJobs}
        onBinClick={(bin) => setSelectedItem({ type: "bin", bin })}
        onRequestClick={(req) => setSelectedItem({ type: "job", req })}
        showRadius
        radiusKm={COLLECTOR_RADIUS_KM}
        filterBinsByRadius
        fillThreshold={HIGH_FILL_THRESHOLD}
        collectorMarker={
          mockLocation
            ? { lat: mockLat, lng: mockLng, draggable: true, onDrag: (lat, lng) => { setMockLat(lat); setMockLng(lng); } }
            : undefined
        }
        className="h-[300px] sm:h-[400px] md:h-[500px]"
      />

      {mockLocation && (
        <p className="text-xs text-muted-foreground text-center">
          Drag the blue marker to simulate driving. Pins update based on your 5km radius.
        </p>
      )}

      <Sheet open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {selectedItem?.type === "job" && selectedItem.req && jobBin && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-orange-500" /> Pickup Job
                </SheetTitle>
                <SheetDescription>Review and claim this collection job</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{jobBin.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{jobBin.address}</p>
                  <div className="flex items-center gap-2 text-sm pl-6">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                    <span>{WASTAGE_META[selectedItem.req.wastageType].icon} {selectedItem.req.wastageType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm pl-6">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Preferred: {selectedItem.req.preferredSlot}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm pl-6">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Citizen: {jobCitizen}</span>
                  </div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bin Size</span>
                    <span className="font-medium">{jobBin.sizeL}L</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Fill Level</span>
                    <span className={`font-bold ${jobBin.fillPct >= 80 ? "text-red-500" : "text-yellow-500"}`}>
                      {jobBin.fillPct}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Distance</span>
                    <span className="font-medium">
                      {haversineKm(center.lat, center.lng, jobBin.lat, jobBin.lng).toFixed(2)} km
                    </span>
                  </div>
                </div>
                <Button onClick={() => handleClaim(selectedItem.req!)} className="w-full gap-2 glow-primary" size="lg">
                  <Hand className="h-4 w-4" /> Claim Job
                </Button>
              </div>
            </>
          )}
          {selectedItem?.type === "bin" && selectedItem.bin && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" /> High-Fill Smart Bin
                </SheetTitle>
                <SheetDescription>This bin needs urgent collection</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">{selectedItem.bin.label}</p>
                  <p className="text-sm text-muted-foreground">{selectedItem.bin.address}</p>
                </div>
                <div className="rounded-lg border p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fill Level</span>
                    <Badge variant="destructive">{selectedItem.bin.fillPct}% Full</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bin Size</span>
                    <span>{selectedItem.bin.sizeL}L</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Device ID</span>
                    <span className="font-mono text-xs">{selectedItem.bin.deviceId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Distance</span>
                    <span>{haversineKm(center.lat, center.lng, selectedItem.bin.lat, selectedItem.bin.lng).toFixed(2)} km</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  This bin has exceeded the 80% fill threshold. No active pickup request is associated with it yet.
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
