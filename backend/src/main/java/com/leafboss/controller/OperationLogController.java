package com.leafboss.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafboss.common.Result;
import com.leafboss.entity.OperationLog;
import com.leafboss.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作日志控制器
 */
@RestController
@RequestMapping("/api/operation-logs")
public class OperationLogController {

    @Autowired
    private OperationLogService operationLogService;

    /**
     * 分页查询操作日志列表（支持时间范围筛选）
     */
    @GetMapping
    public Result<IPage<OperationLog>> getOperationLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String operationType) {
        Page<OperationLog> pageInfo = new Page<>(page, size);
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        
        // 时间范围筛选
        if (startDate != null && !startDate.isEmpty()) {
            queryWrapper.ge("created_at", startDate + " 00:00:00");
        }
        if (endDate != null && !endDate.isEmpty()) {
            queryWrapper.le("created_at", endDate + " 23:59:59");
        }
        
        // 操作类型筛选
        if (operationType != null && !operationType.isEmpty()) {
            queryWrapper.eq("operation_type", operationType);
        }
        
        queryWrapper.orderByDesc("created_at");
        IPage<OperationLog> result = operationLogService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    /**
     * 获取日志统计信息
     */
    @GetMapping("/stats")
    public Result<Map<String, Object>> getLogStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> stats = operationLogService.getLogStats(startDate, endDate);
        return Result.success(stats);
    }

    /**
     * 根据操作类型查询操作日志
     */
    @GetMapping("/type/{operationType}")
    public Result<List<OperationLog>> getOperationLogsByType(@PathVariable String operationType) {
        List<OperationLog> logs = operationLogService.findByOperationType(operationType);
        return Result.success(logs);
    }

    /**
     * 导出操作日志
     */
    @GetMapping("/export")
    public void exportLogs(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) throws IOException {
        operationLogService.exportLogs(startDate, endDate, response);
    }

    /**
     * 清空操作日志
     */
    @DeleteMapping
    public Result<Boolean> clearLogs() {
        boolean result = operationLogService.clearLogs();
        return result ? Result.success("日志清空成功", true) : Result.error("日志清空失败");
    }

    /**
     * 记录操作日志
     */
    @PostMapping
    public Result<Boolean> logOperation(
            @RequestParam String operationType,
            @RequestParam String description,
            @RequestParam String ipAddress) {
        operationLogService.logOperation(operationType, description, ipAddress);
        return Result.success("操作日志记录成功", true);
    }
}