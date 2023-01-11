package com.isi.tracking.services;


import com.isi.tracking.models.User;

public interface UserService {
    User getUserById(String id);

    User storeUser(User user);

    User updateUser(User user);

    void deleteUser(Integer id);
}
