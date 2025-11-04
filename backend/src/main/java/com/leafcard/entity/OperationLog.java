package com.leafcard.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 操作日志实体类
 */
@Data
@TableName("operation_logs")
public class OperationLog {
    
    @TableId(type = IdType.ASSIGN_UUID)
    private String id;
    
    @TableField("user_id")
    private String userId;
    
    @TableField("operation_type")
    private String operationType;
    
    @TableField("target_id")
    private String targetId;
    
    @TableField("target_type")
    private String targetType;
    
    @TableField("description")
    private String description;
    
    @TableField("ip_address")
    private String ipAddress;
    
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}