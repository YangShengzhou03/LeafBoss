package com.leafboss.dto;

import java.time.LocalDateTime;

/**
 * 卡密数据传输对象
 */
public class CardKeyDTO {
    
    private Integer id;
    private String cardKey;
    private Integer specificationId;
    private String specificationName;
    private Integer productId;
    private String productName;
    private String status;
    private String userEmail;
    private String userId;
    private LocalDateTime activateTime;
    private LocalDateTime expireTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 无参构造函数
    public CardKeyDTO() {
    }

    // 全参构造函数
    public CardKeyDTO(Integer id, String cardKey, Integer specificationId, String specificationName, 
                     Integer productId, String productName, String status, String userEmail, 
                     String userId, LocalDateTime activateTime, LocalDateTime expireTime, 
                     LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.cardKey = cardKey;
        this.specificationId = specificationId;
        this.specificationName = specificationName;
        this.productId = productId;
        this.productName = productName;
        this.status = status;
        this.userEmail = userEmail;
        this.userId = userId;
        this.activateTime = activateTime;
        this.expireTime = expireTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getter and Setter methods
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCardKey() {
        return cardKey;
    }

    public void setCardKey(String cardKey) {
        this.cardKey = cardKey;
    }

    public Integer getSpecificationId() {
        return specificationId;
    }

    public void setSpecificationId(Integer specificationId) {
        this.specificationId = specificationId;
    }

    public String getSpecificationName() {
        return specificationName;
    }

    public void setSpecificationName(String specificationName) {
        this.specificationName = specificationName;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getActivateTime() {
        return activateTime;
    }

    public void setActivateTime(LocalDateTime activateTime) {
        this.activateTime = activateTime;
    }

    public LocalDateTime getExpireTime() {
        return expireTime;
    }

    public void setExpireTime(LocalDateTime expireTime) {
        this.expireTime = expireTime;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}