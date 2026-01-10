package com.leafboss.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafboss.entity.OperationLog;
import com.leafboss.mapper.OperationLogMapper;
import com.leafboss.service.OperationLogService;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作日志服务实现类
 */
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
        
        // 时间范围筛选
        if (startDate != null && !startDate.isEmpty()) {
            queryWrapper.ge("created_at", startDate + " 00:00:00");
        }
        if (endDate != null && !endDate.isEmpty()) {
            queryWrapper.le("created_at", endDate + " 23:59:59");
        }
        
        List<OperationLog> logs = this.list(queryWrapper);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCount", logs.size());
        
        // 按操作类型统计
        Map<String, Integer> typeStats = new HashMap<>();
        for (OperationLog log : logs) {
            typeStats.put(log.getOperationType(), typeStats.getOrDefault(log.getOperationType(), 0) + 1);
        }
        stats.put("typeStats", typeStats);
        
        return stats;
    }

    @Override
    public void exportLogs(String startDate, String endDate, HttpServletResponse response) throws IOException {
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        
        // 时间范围筛选
        if (startDate != null && !startDate.isEmpty()) {
            queryWrapper.ge("created_at", startDate + " 00:00:00");
        }
        if (endDate != null && !endDate.isEmpty()) {
            queryWrapper.le("created_at", endDate + " 23:59:59");
        }
        
        queryWrapper.orderByDesc("created_at");
        List<OperationLog> logs = this.list(queryWrapper);
        
        // 设置响应头
        response.setContentType("text/csv;charset=UTF-8");
        response.setHeader("Content-Disposition", 
            "attachment; filename=\"operation_logs_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".csv\"");
        
        // 写入CSV数据
        PrintWriter writer = response.getWriter();
        writer.write("ID,操作类型,描述,IP地址,创建时间\n");
        
        for (OperationLog log : logs) {
            writer.write(String.format("%d,%s,%s,%s,%s\n",
                log.getId(),
                log.getOperationType(),
                escapeCsv(log.getDescription()),
                log.getIpAddress(),
                log.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            ));
        }
        
        writer.flush();
        writer.close();
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
    
    /**
     * 转义CSV字段中的特殊字符
     */
    private String escapeCsv(String field) {
        if (field == null) {
            return "";
        }
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }
}