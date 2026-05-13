package com.badribhaiapparel.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(name = "two_factor_secret")
    @JsonIgnore
    private String twoFactorSecret;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "provider")
    private String provider; // e.g., "google", "local"

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "profile_image")
    private String profileImage;

    @Column(name = "cloudinary_public_id")
    private String cloudinaryPublicId;

    // New profile fields
    @Column(name = "gender")
    private String gender;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "country")
    private String country;

    @Column(name = "state")
    private String state;

    @Column(name = "city")
    private String city;

    @Column(name = "pincode")
    private String pincode;

    @Column(name = "address_line")
    private String addressLine;
    
    @Column(name = "is_newsletter_subscribed")
    private Boolean isNewsletterSubscribed = false;

    private boolean isActive = true;
    
    @Column(name = "two_fa_enabled", nullable = false)
    @JsonIgnore
    private boolean two_fa_enabled = false;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public User() {}

    public User(String firstName, String lastName, String email, String password, String phoneNumber, Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
    }


    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getTwoFactorSecret() { return twoFactorSecret; }
    public void setTwoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public String getCloudinaryPublicId() { return cloudinaryPublicId; }
    public void setCloudinaryPublicId(String cloudinaryPublicId) { this.cloudinaryPublicId = cloudinaryPublicId; }
    
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    
    public Boolean getIsNewsletterSubscribed() { return isNewsletterSubscribed; }
    public void setIsNewsletterSubscribed(Boolean newsletterSubscribed) { isNewsletterSubscribed = newsletterSubscribed; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public boolean isTwo_fa_enabled() { return two_fa_enabled; }
    public void setTwo_fa_enabled(boolean two_fa_enabled) { this.two_fa_enabled = two_fa_enabled; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() { return email; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return isActive; }

    public static UserBuilder builder() { return new UserBuilder(); }

    public static class UserBuilder {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String phoneNumber;
        private Role role;
        private boolean isActive = true;
        private String gender;
        private String dateOfBirth;
        private String country;
        private String state;
        private String city;
        private String pincode;
        private String addressLine;
        private Boolean isNewsletterSubscribed = false;
        private String provider;
        private String providerId;
        private String profileImage;
        private String cloudinaryPublicId;
        private boolean two_fa_enabled = false;
        private String twoFactorSecret;

        public UserBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public UserBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public UserBuilder gender(String gender) { this.gender = gender; return this; }
        public UserBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public UserBuilder country(String country) { this.country = country; return this; }
        public UserBuilder state(String state) { this.state = state; return this; }
        public UserBuilder city(String city) { this.city = city; return this; }
        public UserBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public UserBuilder addressLine(String addressLine) { this.addressLine = addressLine; return this; }
        public UserBuilder isNewsletterSubscribed(Boolean isNewsletterSubscribed) { this.isNewsletterSubscribed = isNewsletterSubscribed; return this; }
        public UserBuilder provider(String provider) { this.provider = provider; return this; }
        public UserBuilder providerId(String providerId) { this.providerId = providerId; return this; }
        public UserBuilder profileImage(String profileImage) { this.profileImage = profileImage; return this; }
        public UserBuilder cloudinaryPublicId(String cloudinaryPublicId) { this.cloudinaryPublicId = cloudinaryPublicId; return this; }
        public UserBuilder two_fa_enabled(boolean two_fa_enabled) { this.two_fa_enabled = two_fa_enabled; return this; }
        public UserBuilder twoFactorSecret(String twoFactorSecret) { this.twoFactorSecret = twoFactorSecret; return this; }
        
        public User build() {
            User user = new User();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(password);
            user.setPhoneNumber(phoneNumber);
            user.setRole(role);
            user.setActive(isActive);
            user.setGender(gender);
            user.setDateOfBirth(dateOfBirth);
            user.setCountry(country);
            user.setState(state);
            user.setCity(city);
            user.setPincode(pincode);
            user.setAddressLine(addressLine);
            user.setIsNewsletterSubscribed(isNewsletterSubscribed);
            user.setProvider(provider);
            user.setProviderId(providerId);
            user.setProfileImage(profileImage);
            user.setCloudinaryPublicId(cloudinaryPublicId);
            user.setTwo_fa_enabled(two_fa_enabled);
            user.setTwoFactorSecret(twoFactorSecret);
            return user;
        }
    }
}
