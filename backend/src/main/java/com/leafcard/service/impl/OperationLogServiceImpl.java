package com.leafcard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafcard.entity.OperationLog;
import com.leafcard.mapper.OperationLogMapper;
import com.leafcard.service.OperationLogService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 操作日志服务实现类
 */
@Service
public class OperationLogServiceImpl extends ServiceImpl<OperationLogMapper, OperationLog> implements OperationLogService {

    @Override
    public List<OperationLog> findByAdminId(String adminId) {
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("admin_id", adminId);
        queryWrapper.orderByDesc("created_at");
        return this.list(queryWrapper);
    }

    @Override
    public List<OperationLog> findByOperationType(String operationType) {
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("operation_type", operationType);
        queryWrapper.orderByDesc("created_at");
        return this.list(queryWrapper);
    }

    @Override
    public List<OperationLog> findByTarget(String targetType, String targetId) {
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("target_type", targetType);
        queryWrapper.eq("target_id", targetId);
        queryWrapper.orderByDesc("created_at");
        return this.list(queryWrapper);
    }

    @Override
    public void logOperation(String adminId, String operationType, String targetType, String targetId, String description, String ipAddress) {
        OperationLog operationLog = new OperationLog();
        operationLog.setAdminId(adminId);
        operationLog.setOperationType(operationType);
        operationLog.setTargetType(targetType);
        operationLog.setTargetId(targetId);
        operationLog.setDescription(description);
        operationLog.setIpAddress(ipAddress);
        operationLog.setCreatedAt(LocalDateTime.now());
        
        this.save(operationLog);
    }
}