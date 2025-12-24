export type DeliveryType = "delivery" | "pickup";

export type Zone = {
  id: "Z1" | "Z2" | "Z3" | "OUT";
  name: string;
  deliveryFee: number;
  minSubtotal: number;
};

export const ZONES: Record<Zone["id"], Zone> = {
  Z1: { id: "Z1", name: "Zona 1 (cerca)", deliveryFee: 35, minSubtotal: 200 },
  Z2: { id: "Z2", name: "Zona 2 (media)", deliveryFee: 55, minSubtotal: 250 },
  Z3: { id: "Z3", name: "Zona 3 (lejos)", deliveryFee: 75, minSubtotal: 300 },
  OUT: { id: "OUT", name: "Fuera de zona", deliveryFee: 0, minSubtotal: Infinity },
};

function inRange(cp: number, a: number, b: number) {
  return cp >= a && cp <= b;
}

export function detectZoneByCP(cpStr: string): Zone {
  const cp = Number(String(cpStr || "").trim());
  if (!Number.isFinite(cp)) return ZONES.OUT;

  // CDMX heurística: 01000–06999
  if (cp < 1000 || cp > 6999) return ZONES.OUT;

  // Zona 1 (cerca)
  if (inRange(cp, 1000, 1039) || inRange(cp, 1040, 1099) || inRange(cp, 1100, 1299)) return ZONES.Z1;

  // Zona 2 (media)
  if (inRange(cp, 1300, 1699) || inRange(cp, 1700, 1999)) return ZONES.Z2;

  // Zona 3 (lejos) resto CDMX
  if (inRange(cp, 2000, 6999)) return ZONES.Z3;

  return ZONES.OUT;
}

export function calcDelivery(subtotal: number, deliveryType: DeliveryType, cp: string) {
  if (deliveryType === "pickup") {
    return { ok: true, zone: ZONES.Z1, deliveryFee: 0, minSubtotal: 0, message: "" };
  }
  const zone = detectZoneByCP(cp);
  if (zone.id === "OUT") {
    return { ok: false, zone, deliveryFee: 0, minSubtotal: Infinity, message: "Fuera de zona de entrega." };
  }
  if (subtotal < zone.minSubtotal) {
    return {
      ok: false,
      zone,
      deliveryFee: zone.deliveryFee,
      minSubtotal: zone.minSubtotal,
      message: `Mínimo para ${zone.name}: $${zone.minSubtotal}.`,
    };
  }
  return { ok: true, zone, deliveryFee: zone.deliveryFee, minSubtotal: zone.minSubtotal, message: "" };
}
