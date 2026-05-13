package com.badribhaiapparel.repository;

import com.badribhaiapparel.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUserIdOrderByIsDefaultDescCreatedAtDesc(Long userId);
    Optional<Address> findByIdAndUserId(UUID id, Long userId);
    int countByUserId(Long userId);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId")
    void resetDefaultAddressForUser(Long userId);
    
    Optional<Address> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
