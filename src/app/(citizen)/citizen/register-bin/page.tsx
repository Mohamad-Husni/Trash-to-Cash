"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store/auth-store";
import { useBins } from "@/lib/hooks/queries";
import { useSubmitBin } from "@/lib/hooks/mutations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapView } from "@/components/maps/map-view";
import { MapPin, Crosshair, Plus, Info, Navigation, CheckCircle2, Clock } from "lucide-react";
import { BIN_SIZES, MAP_CENTER, WASTAGE_TYPES, WASTAGE_META } from "@/lib/constants";
import { format } from "date-fns";
import type { BinSize, WastageType } from "@/types";

export default function CitizenRegisterBinPage() {
  const user = useAuthStore((s) => s.user);
  const { data: bins = [] } = useBins();
  const submitBin = useSubmitBin();

  const [deviceId, setDeviceId] = useState("");
  const [label, setLabel] = useState("");
  const [sizeL, setSizeL] = useState<BinSize>(100);
  const [wasteType, setWasteType] = useState<WastageType>("Plastic");
  const [lat, setLat] = useState(MAP_CENTER.lat);
  const [lng, setLng] = useState(MAP_CENTER.lng);
  const [address, setAddress] = useState("");
  const [region, setRegion] = useState("Colombo 07");
  const [deviceIdError, setDeviceIdError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [locating, setLocating] = useState(false);

  const myBins = bins.filter((b) => b.submittedBy === user?.id);

  const handleMapClick = (clickedLat: number, clickedLng: number) => {
    setLat(clickedLat);
    setLng(clickedLng);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        alert(`Could not get your location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = () => {
    if (!deviceId.trim()) {
      setDeviceIdError("Device ID is required");
      return;
    }
    if (bins.some((b) => b.deviceId === deviceId)) {
      setDeviceIdError("Device ID already exists in the system");
      return;
    }
    if (!label.trim()) return;

    submitBin({
      deviceId,
      label,
      lat,
      lng,
      address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      sizeL,
      fillPct: 0,
      isPublic: true,
      region,
      wasteType,
      submittedBy: user!.id,
    });

    setSubmitted(true);
    setDeviceId("");
    setLabel("");
    setAddress("");
    setWasteType("Plastic");
    setLat(MAP_CENTER.lat);
    setLng(MAP_CENTER.lng);
    setDeviceIdError("");

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Register a Smart Bin</h1>
        <p className="text-muted-foreground">
          Submit a new smart bin for admin approval. Pin the location on the map or enter coordinates manually.
        </p>
      </div>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-[#0099FF]/30 bg-gradient-to-r from-[#003B73]/8 to-[#0099FF]/5 p-4"
        >
          <CheckCircle2 className="h-5 w-5 text-[#0099FF]" />
          <div>
            <p className="font-medium text-foreground">Bin submitted for approval!</p>
            <p className="text-sm text-muted-foreground">An admin will review your registration. You&apos;ll see it on the map once approved.</p>
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-[#0099FF]" /> Bin Details
            </CardTitle>
            <CardDescription>Fill in the ESP32 device info and bin specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deviceId">ESP32 Device ID *</Label>
              <Input
                id="deviceId"
                value={deviceId}
                onChange={(e) => { setDeviceId(e.target.value); setDeviceIdError(""); }}
                placeholder="ESP32-XXXXXX"
              />
              {deviceIdError && <p className="text-xs text-destructive">{deviceIdError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">Bin Label *</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Cinnamon Gardens Bin #13"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Bin Size</Label>
                <Select value={String(sizeL)} onValueChange={(v) => v && setSizeL(Number(v) as BinSize)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BIN_SIZES.map((s) => (
                      <SelectItem key={s} value={String(s)}>{s}L</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Colombo 07"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Waste Type</Label>
              <Select value={wasteType} onValueChange={(v) => v && setWasteType(v as WastageType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WASTAGE_TYPES.map((wt) => (
                    <SelectItem key={wt} value={wt}>
                      {WASTAGE_META[wt].icon} {wt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address (optional)</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address — defaults to coordinates"
              />
            </div>

            <div className="space-y-2">
              <Label>GPS Coordinates</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  placeholder="Latitude"
                  className="flex-1"
                />
                <Input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  placeholder="Longitude"
                  className="flex-1"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="w-full gap-2"
              >
                <Crosshair className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
                {locating ? "Locating..." : "Use My Current Location"}
              </Button>
            </div>

            <Button onClick={handleSubmit} className="w-full gap-2 glow-primary" size="lg">
              <Plus className="h-4 w-4" /> Submit for Approval
            </Button>
          </CardContent>
        </Card>

        {/* Map + Info */}
        <div className="space-y-4">
          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-[#0099FF]" /> Pin Bin Location
              </CardTitle>
              <CardDescription>Click on the map to set the bin&apos;s GPS coordinates</CardDescription>
            </CardHeader>
            <CardContent>
              <MapView
                center={{ lat, lng }}
                onMapClick={handleMapClick}
                className="h-[250px] sm:h-[300px] w-full"
              />
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation className="h-4 w-4 text-[#0099FF]" />
                Selected: <span className="font-mono font-medium text-foreground">{lat.toFixed(4)}, {lng.toFixed(4)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full overflow-hidden border-[#0099FF]/15 bg-gradient-to-br from-[#003B73]/5 to-[#0099FF]/5">
            <CardContent className="flex items-start gap-3 p-4">
              <Info className="h-5 w-5 shrink-0 text-[#0099FF] mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">How it works</p>
                <p className="mt-1 text-muted-foreground">
                  Your bin registration will be reviewed by an admin. Once approved, it will appear on the
                  collector and admin maps. You can track the approval status below.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* My submitted bins */}
      {myBins.length > 0 && (
        <Card className="w-full overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">My Submitted Bins</CardTitle>
            <CardDescription>Track the approval status of your bin registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myBins.map((bin) => (
                <div
                  key={bin.id}
                  className="flex flex-col gap-2 rounded-xl border border-[#0099FF]/8 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{bin.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {bin.deviceId} • {bin.sizeL}L • {(WASTAGE_META[bin.wasteType] || WASTAGE_META.Plastic).icon} {bin.wasteType || "Plastic"} • {bin.region}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {bin.approvalStatus === "pending" && (
                      <Badge variant="outline" className="text-amber-600 border-amber-500/40">
                        <Clock className="h-3 w-3 mr-1" /> Pending Approval
                      </Badge>
                    )}
                    {bin.approvalStatus === "approved" && (
                      <Badge variant="outline" className="text-green-600 border-green-500/40">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
                      </Badge>
                    )}
                    {bin.approvalStatus === "rejected" && (
                      <Badge variant="outline" className="text-red-600 border-red-500/40">
                        Rejected
                      </Badge>
                    )}
                    {bin.submittedAt && (
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {format(new Date(bin.submittedAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
