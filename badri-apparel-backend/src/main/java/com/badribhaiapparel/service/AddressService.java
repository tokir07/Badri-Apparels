package com.badribhaiapparel.service;

import com.badribhaiapparel.dto.AddressDto;
import com.badribhaiapparel.dto.AddressRequest;

import java.util.List;
import java.util.UUID;

public interface AddressService {
    List<AddressDto> getUserAddresses(Long userId);
    AddressDto addAddress(Long userId, AddressRequest request);
    AddressDto updateAddress(UUID addressId, Long userId, AddressRequest request);
    void deleteAddress(UUID addressId, Long userId);
    AddressDto setDefaultAddress(UUID addressId, Long userId);
}
