package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.AuthResponse;
import com.badribhaiapparel.dto.LoginRequest;
import com.badribhaiapparel.dto.SignupRequest;
import com.badribhaiapparel.entity.RefreshToken;
import com.badribhaiapparel.entity.Role;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.RefreshTokenRepository;
import com.badribhaiapparel.repository.UserRepository;
import com.badribhaiapparel.security.JwtService;
import com.badribhaiapparel.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .phoneNumber(request.phoneNumber())
                .role(request.role() != null ? request.role() : Role.CUSTOMER)
                .isActive(true)
                .gender(request.gender())
                .dateOfBirth(request.dateOfBirth())
                .country(request.country())
                .state(request.state())
                .city(request.city())
                .pincode(request.pincode())
                .addressLine(request.addressLine())
                .isNewsletterSubscribed(request.newsletterSubscribed())
                .build();

        userRepository.save(user);
        var accessToken = jwtService.generateToken(user);
        var refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .country(user.getCountry())
                .state(user.getState())
                .city(user.getCity())
                .pincode(user.getPincode())
                .addressLine(user.getAddressLine())
                .isNewsletterSubscribed(user.getIsNewsletterSubscribed())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );
        var user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow();
        var accessToken = jwtService.generateToken(user);
        var refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .country(user.getCountry())
                .state(user.getState())
                .city(user.getCity())
                .pincode(user.getPincode())
                .addressLine(user.getAddressLine())
                .isNewsletterSubscribed(user.getIsNewsletterSubscribed())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String token) {
        if (token == null || token.isBlank()) {
            throw new org.springframework.security.authentication.BadCredentialsException("Refresh token is required");
        }
        
        String tokenHash = hashToken(token);
        RefreshToken refreshTokenEntity = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Refresh token not found or invalid"));

        if (refreshTokenEntity.getRevokedAt() != null) {
            throw new org.springframework.security.authentication.BadCredentialsException("Refresh token has been revoked");
        }

        if (refreshTokenEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new org.springframework.security.authentication.BadCredentialsException("Refresh token has expired");
        }

        User user = refreshTokenEntity.getUser();
        if (user == null || !user.isActive()) {
            throw new org.springframework.security.authentication.BadCredentialsException("User is no longer active");
        }

        // Revoke old token
        refreshTokenEntity.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(refreshTokenEntity);

        // Generate new pair
        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .country(user.getCountry())
                .state(user.getState())
                .city(user.getCity())
                .pincode(user.getPincode())
                .addressLine(user.getAddressLine())
                .isNewsletterSubscribed(user.getIsNewsletterSubscribed())
                .build();
    }

    @Override
    @Transactional
    public void logout(String token) {
        if (token == null || token.isBlank()) {
            return;
        }
        
        String tokenHash = hashToken(token);
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(t -> {
            t.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(t);
        });
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanExpiredTokens() {
        refreshTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now().minusDays(1));
    }

    private String createRefreshToken(User user) {
        String rawToken = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(rawToken))
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    @Override
    @Transactional
    public void setup2FA(String email, String secret) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTwoFactorSecret(secret);
        user.setTwo_fa_enabled(true);
        userRepository.save(user);
    }

    private String hashToken(String token) {
        if (token == null) return "";
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}
