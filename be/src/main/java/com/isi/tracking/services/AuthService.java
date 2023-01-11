package com.isi.tracking.services;

import com.isi.tracking.models.User;

import java.util.concurrent.ExecutionException;

public interface AuthService {

    void register(User user) throws ExecutionException, InterruptedException;

    void login(User user) throws ExecutionException, InterruptedException;

}
