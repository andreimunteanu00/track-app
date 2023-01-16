export interface IShip {
  id?: string | undefined | null;
  userId?: string | undefined | null;
  start?: string | undefined | null;
  dropOffPointId?: string | undefined | null;
  startDate?: Date | undefined | null;
  endDate?: Date | undefined | null;
  eta?: Date | undefined | null;
  shippingMethod?: string | undefined | null;
  carrier?: string | undefined | null;
  trackingNumber?: number | undefined | null;
  currentLat?: number | undefined | null;
  currentLong?: number | undefined | null;
}

/*
private String id;
private String userId;
private String start;
private String dropOffPointId;
private Date startDate;
private Date endDate;
private Date eta;
private ShippingMethodEnum shippingMethod;
private String carrier;
private Long trackingNumber;
private Double currentLat;
private Double currentLong;*/
