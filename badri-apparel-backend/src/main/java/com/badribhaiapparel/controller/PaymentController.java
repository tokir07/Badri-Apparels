package com.badribhaiapparel.controller;

import com.badribhaiapparel.dto.PaymentResponseDTO;
import com.badribhaiapparel.dto.PaymentVerificationRequestDTO;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.UserRepository;
import com.badribhaiapparel.response.ApiResponse;
import com.badribhaiapparel.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public PaymentController(PaymentService paymentService, UserRepository userRepository) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> createOrder(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            PaymentResponseDTO response = paymentService.createOrder(user);
            return ResponseEntity.ok(ApiResponse.<PaymentResponseDTO>builder()
                    .success(true)
                    .message("Razorpay order created")
                    .data(response)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<PaymentResponseDTO>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<String>> verifyPayment(
            Authentication authentication,
            @RequestBody PaymentVerificationRequestDTO request) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean isVerified = paymentService.verifyPayment(request, user);

            if (isVerified) {
                return ResponseEntity.ok(ApiResponse.<String>builder()
                        .success(true)
                        .message("Payment verified and order created")
                        .data("SUCCESS")
                        .build());
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                        .success(false)
                        .message("Payment verification failed")
                        .data("FAILURE")
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }
}
