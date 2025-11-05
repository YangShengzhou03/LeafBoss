package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.common.Result;
import com.leafcard.entity.OperationLog;
import com.leafcard.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 操作日志控制器
 */
@RestController
@RequestMapping("/api/operation-logs")
public class OperationLogController {

    @Autowired
    private OperationLogService operationLogService;

    /**
     * 分页查询操作日志列表
     */
    @GetMapping
    public Result<IPage<OperationLog>> getOperationLogs(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<OperationLog> pageInfo = new Page<>(page, size);
        QueryWrapper<OperationLog> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("created_at");
        IPage<OperationLog> result = operationLogService.page(pageInfo, queryWrapper);
        return Result.success(result);
    }

    /**
     * 根据用户ID查询操作日志
     */
    @GetMapping("/user/{userId}")
    public Result<List<OperationLog>> getOperationLogsByUser(@PathVariable Long userId) {
        List<OperationLog> logs = operationLogService.findByUserId(userId);
        return Result.success(logs);
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
     * 根据目标查询操作日志
     */
    @GetMapping("/target")
    public Result<List<OperationLog>> getOperationLogsByTarget(
            @RequestParam String targetType,
            @RequestParam String targetId) {
        List<OperationLog> logs = operationLogService.findByTarget(targetType, targetId);
        return Result.success(logs);
    }

    /**
     * 记录操作日志
     */
    @PostMapping
    public Result<Boolean> logOperation(
            @RequestParam Long userId,
            @RequestParam String operationType,
            @RequestParam String targetType,
            @RequestParam String targetId,
            @RequestParam String description,
            @RequestParam String ipAddress) {
        operationLogService.logOperation(userId, operationType, targetType, targetId, description, ipAddress);
        return Result.success("操作日志记录成功", true);
    }
}