package com.leafcard.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 规格实体类
 */
@Data
@TableName("specifications")
public class Specification {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    @TableField("product_id")
    private String productId;
    
    @TableField("name")
    private String name;
    
    @TableField("description")
    private String description;
    
    @TableField("duration_days")
    private Integer durationDays;
    
    @TableField("price")
    private BigDecimal price;
    
    @TableField("currency")
    private String currency;
    
    @TableField("stock_quantity")
    private Integer stockQuantity;
    
    @TableField("status")
    private String status;
    
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    @TableField("deleted")
    private Integer deleted;
}