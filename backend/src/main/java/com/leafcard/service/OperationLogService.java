package com.leafcard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafcard.entity.OperationLog;

import java.util.List;

/**
 * 操作日志服务接口
 */
public interface OperationLogService extends IService<OperationLog> {
    
    /**
     * 根据管理员ID查询操作日志
     * @param adminId 管理员ID
     * @return 操作日志列表
     */
    List<OperationLog> findByAdminId(String adminId);
    
    /**
     * 根据操作类型查询操作日志
     * @param operationType 操作类型
     * @return 操作日志列表
     */
    List<OperationLog> findByOperationType(String operationType);
    
    /**
     * 根据目标类型和目标ID查询操作日志
     * @param targetType 目标类型
     * @param targetId 目标ID
     * @return 操作日志列表
     */
    List<OperationLog> findByTarget(String targetType, String targetId);
    
    /**
     * 记录操作日志
     * @param adminId 管理员ID
     * @param operationType 操作类型
     * @param targetType 目标类型
     * @param targetId 目标ID
     * @param description 描述
     * @param ipAddress IP地址
     */
    void logOperation(String adminId, String operationType, String targetType, String targetId, String description, String ipAddress);
}