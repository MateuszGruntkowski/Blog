package com.mgrunt.blog.services;

import com.mgrunt.blog.domain.entities.User;

import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
}
