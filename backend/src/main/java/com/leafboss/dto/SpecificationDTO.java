package com.leafboss.dto;

import java.time.LocalDateTime;

/**
 * 规格数据传输对象（包含卡密统计信息）
 */
public class SpecificationDTO {
    
    private Integer id;
    private Integer productId;
    private String productName;
    private String name;
    private String description;
    private Integer durationDays;
    private Double price;
    private Integer stockQuantity;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // 卡密统计信息
    private Integer totalKeys;     // 卡密总数
    private Integer usedKeys;      // 已使用卡密数
    private Integer unusedKeys;    // 未使用卡密数
    private Integer disabledKeys;  // 已禁用卡密数

    // 无参构造函数
    public SpecificationDTO() {
    }

    // Getter and Setter methods
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public Integer getTotalKeys() {
        return totalKeys;
    }

    public void setTotalKeys(Integer totalKeys) {
        this.totalKeys = totalKeys;
    }

    public Integer getUsedKeys() {
        return usedKeys;
    }

    public void setUsedKeys(Integer usedKeys) {
        this.usedKeys = usedKeys;
    }

    public Integer getUnusedKeys() {
        return unusedKeys;
    }

    public void setUnusedKeys(Integer unusedKeys) {
        this.unusedKeys = unusedKeys;
    }

    public Integer getDisabledKeys() {
        return disabledKeys;
    }

    public void setDisabledKeys(Integer disabledKeys) {
        this.disabledKeys = disabledKeys;
    }
}