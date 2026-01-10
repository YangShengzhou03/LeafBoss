package com.leafboss.dto;

import com.leafboss.entity.Admin;

/**
 * 登录响应DTO
 */
public class LoginResponse {
    
    private String token;
    private Admin user;
    
    public LoginResponse() {
    }
    
    public LoginResponse(String token, Admin user) {
        this.token = token;
        this.user = user;
    }
    
    // Getter and Setter methods
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public Admin getUser() {
        return user;
    }
    
    public void setUser(Admin user) {
        this.user = user;
    }
}