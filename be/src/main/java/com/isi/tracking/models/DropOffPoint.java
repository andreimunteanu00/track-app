package com.isi.tracking.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DropOffPoint {
    private Integer id;
    private Double latitude;
    private Double longitude;
    private String carrier;
}
