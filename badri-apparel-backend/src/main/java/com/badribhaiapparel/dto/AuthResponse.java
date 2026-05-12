package com.badribhaiapparel.dto;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String phoneNumber;
    private String gender;
    private String dateOfBirth;
    private String country;
    private String state;
    private String city;
    private String pincode;
    private String addressLine;
    private Boolean isNewsletterSubscribed;

    public AuthResponse() {}

    public AuthResponse(String accessToken, String refreshToken, String firstName, String lastName, String email, String role, String phoneNumber, String gender, String dateOfBirth, String country, String state, String city, String pincode, String addressLine, Boolean isNewsletterSubscribed) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.country = country;
        this.state = state;
        this.city = city;
        this.pincode = pincode;
        this.addressLine = addressLine;
        this.isNewsletterSubscribed = isNewsletterSubscribed;
    }

    // Getters and Setters
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
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

    public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }

    public static class AuthResponseBuilder {
        private String accessToken;
        private String refreshToken;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private String phoneNumber;
        private String gender;
        private String dateOfBirth;
        private String country;
        private String state;
        private String city;
        private String pincode;
        private String addressLine;
        private Boolean isNewsletterSubscribed;

        public AuthResponseBuilder accessToken(String accessToken) { this.accessToken = accessToken; return this; }
        public AuthResponseBuilder refreshToken(String refreshToken) { this.refreshToken = refreshToken; return this; }
        public AuthResponseBuilder firstName(String firstName) { this.firstName = firstName; return this; }
        public AuthResponseBuilder lastName(String lastName) { this.lastName = lastName; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder role(String role) { this.role = role; return this; }
        public AuthResponseBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public AuthResponseBuilder gender(String gender) { this.gender = gender; return this; }
        public AuthResponseBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public AuthResponseBuilder country(String country) { this.country = country; return this; }
        public AuthResponseBuilder state(String state) { this.state = state; return this; }
        public AuthResponseBuilder city(String city) { this.city = city; return this; }
        public AuthResponseBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public AuthResponseBuilder addressLine(String addressLine) { this.addressLine = addressLine; return this; }
        public AuthResponseBuilder isNewsletterSubscribed(Boolean isNewsletterSubscribed) { this.isNewsletterSubscribed = isNewsletterSubscribed; return this; }
        
        public AuthResponse build() {
            return new AuthResponse(accessToken, refreshToken, firstName, lastName, email, role, phoneNumber, gender, dateOfBirth, country, state, city, pincode, addressLine, isNewsletterSubscribed);
        }
    }
}
