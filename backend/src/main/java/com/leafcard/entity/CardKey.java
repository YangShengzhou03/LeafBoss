package com.leafcard.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 卡密实体类
 */
@Data
@TableName("card_keys")
public class CardKey {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    @TableField("card_key")
    private String cardKey;
    
    @TableField("specification_id")
    private String specificationId;
    
    @TableField("status")
    private String status;
    
    @TableField("user_id")
    private String userId;
    
    @TableField("user_email")
    private String userEmail;
    
    @TableField("activate_time")
    private LocalDateTime activateTime;
    
    @TableField("expire_time")
    private LocalDateTime expireTime;
    
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    @TableField("deleted")
    private Integer deleted;
}