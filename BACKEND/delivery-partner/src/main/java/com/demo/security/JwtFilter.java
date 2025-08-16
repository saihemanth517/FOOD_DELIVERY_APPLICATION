package com.demo.security;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                // ✅ Extract delivery partner ID from the token
                String partnerId = jwtUtil.extractUserId(token); // previously extractUsername

                // Set authentication manually using the partner ID
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(partnerId, null, List.of(new SimpleGrantedAuthority("USER")) );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                System.out.println("❌ Invalid token");
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        // Skip filtering for these public endpoints
        return path.startsWith("/api/delivery/auth") ||
               path.equals("/api/orders/simulate") ||
               path.equals("/api/orders/pending");
    }
}
