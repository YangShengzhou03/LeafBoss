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

@RestController
@RequestMapping("/api/operation-logs")
public class OperationLogController {

    @Autowired
    private OperationLogService operationLogService;

    @GetMapping
    public Result<IPage<OperationLog>> getOperationLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String operationType) {
        Page<OperationLog> pageInfo = new Page<>(page, size);
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();

        if (startDate != null && !startDate.isEmpty()) {
            queryWrapper.ge("created_at", startDate + " 00:00:00");
        }
        if (endDate != null && !endDate.isEmpty()) {
            queryWrapper.le("created_at", endDate + " 23:59:59");
        }

        if (operationType != null && !operationType.isEmpty()) {
            queryWrapper.eq("operation_type", operationType);
        }

        queryWrapper.orderByDesc("created_at");
        IPage<OperationLog> result = operationLogService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    @GetMapping("/stats")
    public Result<Map<String, Object>> getLogStats(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        Map<String, Object> stats = operationLogService.getLogStats(startDate, endDate);
        return Result.success(stats);
    }

    @GetMapping("/type/{operationType}")
    public Result<List<OperationLog>> getOperationLogsByType(@PathVariable String operationType) {
        List<OperationLog> logs = operationLogService.findByOperationType(operationType);
        return Result.success(logs);
    }

    @GetMapping("/export")
    public void exportLogs(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            HttpServletResponse response) throws IOException {
        operationLogService.exportLogs(startDate, endDate, response);
    }

    @DeleteMapping
    public Result<Boolean> clearLogs() {
        boolean result = operationLogService.clearLogs();
        return result ? Result.success("日志清空成功", true) : Result.error("日志清空失败");
    }

    @PostMapping
    public Result<Boolean> logOperation(
            @RequestParam String operationType,
            @RequestParam String description,
            @RequestParam String ipAddress) {
        operationLogService.logOperation(operationType, description, ipAddress);
        return Result.success("操作日志记录成功", true);
    }
}