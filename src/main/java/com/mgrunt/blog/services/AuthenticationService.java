package com.mgrunt.blog.services;

import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {
    UserDetails authenticate(String email, String password);
    UserDetails register(String email, String password, String name);
    String generateToken(UserDetails userDetails);
    UserDetails validateToken(String token);
}
