package com.leafboss.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafboss.entity.OperationLog;
import com.leafboss.mapper.OperationLogMapper;
import com.leafboss.service.OperationLogService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OperationLogServiceImpl extends ServiceImpl<OperationLogMapper, OperationLog> implements OperationLogService {

    @Override
    public List<OperationLog> findByOperationType(String operationType) {
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("operation_type", operationType);
        queryWrapper.orderByDesc("created_at");
        return this.list(queryWrapper);
    }

    @Override
    public Map<String, Object> getLogStats(String startDate, String endDate) {
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        
        if (startDate != null && !startDate.isEmpty()) {
            queryWrapper.ge("created_at", startDate + " 00:00:00");
        }
        if (endDate != null && !endDate.isEmpty()) {
            queryWrapper.le("created_at", endDate + " 23:59:59");
        }
        
        List<OperationLog> logs = this.list(queryWrapper);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", logs.size());
        
        Map<String, Integer> typeStats = new HashMap<>();
        for (OperationLog log : logs) {
            typeStats.put(log.getOperationType(), typeStats.getOrDefault(log.getOperationType(), 0) + 1);
        }
        stats.put("typeStats", typeStats);
        
        return stats;
    }

    @Override
    public boolean clearLogs() {
        try {
            QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
            return this.remove(queryWrapper);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void logOperation(String operationType, String description, String ipAddress) {
        OperationLog operationLog = new OperationLog();
        operationLog.setOperationType(operationType);
        operationLog.setDescription(description);
        operationLog.setIpAddress(ipAddress);
        operationLog.setCreatedAt(LocalDateTime.now());
        
        this.save(operationLog);
    }
}