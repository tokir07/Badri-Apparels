package com.badribhaiapparel.dto;

public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String gender;
    private String dateOfBirth;
    private String country;
    private String state;
    private String city;
    private String pincode;
    private String addressLine;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String firstName, String lastName, String phoneNumber, String gender, String dateOfBirth, String country, String state, String city, String pincode, String addressLine) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.country = country;
        this.state = state;
        this.city = city;
        this.pincode = pincode;
        this.addressLine = addressLine;
    }

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
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
}
