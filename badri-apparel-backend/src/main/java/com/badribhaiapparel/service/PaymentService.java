package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.PaymentResponseDTO;
import com.badribhaiapparel.dto.PaymentVerificationRequestDTO;
import com.badribhaiapparel.entity.User;

public interface PaymentService {
    PaymentResponseDTO createOrder(User user) throws Exception;
    boolean verifyPayment(PaymentVerificationRequestDTO verificationRequest, User user) throws Exception;
}
