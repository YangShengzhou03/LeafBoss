package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.entity.Admin;
import com.leafcard.service.AdminService;
import com.leafcard.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        if (email == null || email.trim().isEmpty()) {
            return Result.error("邮箱不能为空");
        }
        if (password == null || password.trim().isEmpty()) {
            return Result.error("密码不能为空");
        }
        
        // 根据邮箱查找管理员
        Admin admin = adminService.findByEmail(email);
        if (admin != null) {
            // 验证密码（暂时不加密，直接比较明文）
            if (password.equals(admin.getPasswordHash())) {
                // 更新最后登录时间
                admin.setLastLoginTime(LocalDateTime.now());
                adminService.updateById(admin);
                
                // 生成JWT token
                String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());
                
                // 创建登录响应
                Map<String, Object> response = Map.of(
                    "token", token,
                    "user", admin
                );
                return Result.success("登录成功", response);
            }
        }
        
        return Result.error("邮箱或密码错误");
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    public Result<Admin> getCurrentUser(@RequestHeader("Authorization") String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error("未授权访问");
        }
        
        String token = authorization.substring(7);
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            Admin admin = adminService.getById(userId);
            
            if (admin != null) {
                return Result.success(admin);
            } else {
                return Result.error("用户不存在");
            }
        } catch (Exception e) {
            return Result.error("Token无效或已过期");
        }
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public Result<Boolean> register(@RequestBody Admin admin) {
        boolean saved = adminService.save(admin);
        
        if (saved) {
            return Result.success("注册成功", true);
        } else {
            return Result.error("注册失败");
        }
    }

    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public Result<Boolean> logout() {
        return Result.success("登出成功", true);
    }
}