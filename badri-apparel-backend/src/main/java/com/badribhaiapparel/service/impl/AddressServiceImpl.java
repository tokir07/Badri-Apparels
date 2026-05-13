package com.badribhaiapparel.service.impl;

import com.badribhaiapparel.dto.AddressDto;
import com.badribhaiapparel.dto.AddressRequest;
import com.badribhaiapparel.entity.Address;
import com.badribhaiapparel.entity.User;
import com.badribhaiapparel.exception.ResourceNotFoundException;
import com.badribhaiapparel.repository.AddressRepository;
import com.badribhaiapparel.repository.UserRepository;
import com.badribhaiapparel.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public List<AddressDto> getUserAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressDto addAddress(Long userId, AddressRequest request) {
        if (addressRepository.countByUserId(userId) >= 5) {
            throw new RuntimeException("Maximum of 5 addresses allowed per user");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.isDefault() || addressRepository.countByUserId(userId) == 0) {
            addressRepository.resetDefaultAddressForUser(userId);
            request.setDefault(true);
        }

        Address address = Address.builder()
                .user(user)
                .label(request.getLabel())
                .recipientName(request.getRecipientName())
                .phone(request.getPhone())
                .line1(request.getLine1())
                .line2(request.getLine2())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .country(request.getCountry())
                .isDefault(request.isDefault())
                .build();

        return mapToDto(addressRepository.save(address));
    }

    @Override
    @Transactional
    public AddressDto updateAddress(UUID addressId, Long userId, AddressRequest request) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or unauthorized"));

        if (request.isDefault() && !address.isDefault()) {
            addressRepository.resetDefaultAddressForUser(userId);
        }

        address.setLabel(request.getLabel());
        address.setRecipientName(request.getRecipientName());
        address.setPhone(request.getPhone());
        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setCountry(request.getCountry());
        address.setDefault(request.isDefault());

        return mapToDto(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void deleteAddress(UUID addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or unauthorized"));

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);

        if (wasDefault) {
            addressRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                    .ifPresent(a -> {
                        a.setDefault(true);
                        addressRepository.save(a);
                    });
        }
    }

    @Override
    @Transactional
    public AddressDto setDefaultAddress(UUID addressId, Long userId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or unauthorized"));

        addressRepository.resetDefaultAddressForUser(userId);
        address.setDefault(true);
        
        return mapToDto(addressRepository.save(address));
    }

    private AddressDto mapToDto(Address address) {
        return AddressDto.builder()
                .id(address.getId())
                .label(address.getLabel())
                .recipientName(address.getRecipientName())
                .phone(address.getPhone())
                .line1(address.getLine1())
                .line2(address.getLine2())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .country(address.getCountry())
                .isDefault(address.isDefault())
                .build();
    }
}
