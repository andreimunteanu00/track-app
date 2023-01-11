package com.isi.tracking.models;

import lombok.Getter;
import lombok.Setter;
import proiect.isi.deliverytracker.utils.ShippingMethodEnum;

import java.util.Date;

@Getter
@Setter
public class Shipment {

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
    private Double currentLong;
}
