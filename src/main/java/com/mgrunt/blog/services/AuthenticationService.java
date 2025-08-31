package com.mgrunt.blog.services;

import com.mgrunt.blog.security.BlogUserDetails;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationService {
    BlogUserDetails authenticate(String email, String password);
    BlogUserDetails register(String email, String password, String name);
    String generateToken(BlogUserDetails userDetails);
    UserDetails validateToken(String token);
}
