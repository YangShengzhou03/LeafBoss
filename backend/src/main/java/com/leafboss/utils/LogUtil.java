package com.leafboss.utils;

import com.leafboss.service.OperationLogService;
import com.leafboss.service.AdminService;
import com.leafboss.entity.Admin;
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
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    /**
     * 记录操作日志
     */
    public void logOperation(String operationType, String description, HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        
        // 获取当前管理员信息
        String adminInfo = getCurrentAdminInfo(request);
        
        // 如果描述中不包含管理员信息，则添加
        String finalDescription = description;
        if (!description.contains("管理员") && adminInfo != null) {
            finalDescription = adminInfo + " - " + description;
        }
        
        operationLogService.logOperation(operationType, finalDescription, ipAddress);
    }
    
    /**
     * 记录登录日志
     */
    public void logLogin(boolean success, String description, HttpServletRequest request) {
        String detailedDescription = success ? "登录成功 - " + description : "登录失败 - " + description;
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
     * 获取当前管理员信息
     */
    private String getCurrentAdminInfo(HttpServletRequest request) {
        try {
            String authorization = request.getHeader("Authorization");
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return null;
            }
            
            String token = authorization.substring(7);
            String adminId = jwtUtil.getUserIdFromToken(token);
            
            if (adminId != null) {
                Admin admin = adminService.getById(adminId);
                if (admin != null) {
                    return admin.getUsername() + " (" + admin.getEmail() + ")";
                }
            }
        } catch (Exception e) {
            // 如果获取管理员信息失败，返回null
        }
        
        return null;
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