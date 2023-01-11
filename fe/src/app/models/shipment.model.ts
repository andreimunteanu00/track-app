export class Shipment {
  id: String;
  userId: String;
  start: String;
  dropOffPointId: String;
  startDate: Date;
  endDate: Date | null;
  estimatedDeliveryDate: Date;
  shippingMethod: String; // TODO: check if compatible with backend
  carrier: String;
  trackingNumber: String;
  currentLat: Number;
  currentLong: Number;
}
