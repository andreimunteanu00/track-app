package com.isi.tracking.models;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class User {
    private String id;
    private String email;
    private String password;
    // TODO: roles
}
