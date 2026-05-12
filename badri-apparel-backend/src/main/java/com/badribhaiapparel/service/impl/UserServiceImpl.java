package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.UpdateProfileRequest;
import com.badribhaiapparel.dto.AuthResponse;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.repository.UserRepository;
import com.badribhaiapparel.service.UserService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AuthResponse updateProfile(String email, UpdateProfileRequest profileData) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setFirstName(profileData.getFirstName());
        user.setLastName(profileData.getLastName());
        user.setPhoneNumber(profileData.getPhoneNumber());
        user.setGender(profileData.getGender());
        user.setDateOfBirth(profileData.getDateOfBirth());
        user.setCountry(profileData.getCountry());
        user.setState(profileData.getState());
        user.setCity(profileData.getCity());
        user.setPincode(profileData.getPincode());
        user.setAddressLine(profileData.getAddressLine());

        User updatedUser = userRepository.save(user);

        return AuthResponse.builder()
                .firstName(updatedUser.getFirstName())
                .lastName(updatedUser.getLastName())
                .email(updatedUser.getEmail())
                .role(updatedUser.getRole().name())
                .phoneNumber(updatedUser.getPhoneNumber())
                .gender(updatedUser.getGender())
                .dateOfBirth(updatedUser.getDateOfBirth())
                .country(updatedUser.getCountry())
                .state(updatedUser.getState())
                .city(updatedUser.getCity())
                .pincode(updatedUser.getPincode())
                .addressLine(updatedUser.getAddressLine())
                .isNewsletterSubscribed(updatedUser.getIsNewsletterSubscribed())
                .build();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
