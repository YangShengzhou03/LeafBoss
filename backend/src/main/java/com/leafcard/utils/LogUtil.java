package com.leafcard.utils;

import com.leafcard.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;

/**
 * 日志工具类 - 用于记录关键操作日志
 */
@Component
public class LogUtil {
    
    @Autowired
    private OperationLogService operationLogService;
    
    /**
     * 记录操作日志
     */
    public void logOperation(String operationType, String description, HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        operationLogService.logOperation(operationType, description, ipAddress);
    }
    
    /**
     * 记录登录日志
     */
    public void logLogin(boolean success, String description, HttpServletRequest request) {
        String detailedDescription = success ? "管理员登录成功 - " + description : "管理员登录失败 - " + description;
        logOperation("LOGIN", detailedDescription, request);
    }
    
    /**
     * 记录卡密操作日志
     */
    public void logCardKeyOperation(String operationType, String description, HttpServletRequest request) {
        logOperation(operationType, description, request);
    }
    
    /**
     * 记录产品操作日志
     */
    public void logProductOperation(String operationType, String description, HttpServletRequest request) {
        logOperation(operationType, description, request);
    }
    
    /**
     * 记录规格操作日志
     */
    public void logSpecificationOperation(String operationType, String description, HttpServletRequest request) {
        logOperation(operationType, description, request);
    }
    
    /**
     * 记录用户操作日志
     */
    public void logUserOperation(String operationType, String description, HttpServletRequest request) {
        logOperation(operationType, description, request);
    }
    
    /**
     * 记录系统配置操作日志
     */
    public void logSystemConfigOperation(String operationType, String description, HttpServletRequest request) {
        logOperation(operationType, description, request);
    }
    
    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 对于多个IP的情况，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
    

}