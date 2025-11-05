package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.dto.LoginResponse;
import com.leafcard.entity.Admin;
import com.leafcard.service.AdminService;
import com.leafcard.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * 管理员控制器
 */
@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;
    
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 管理员登录
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Admin admin = adminService.login(username, password);
        if (admin != null) {
            // 生成JWT token
            String token = jwtUtil.generateToken(admin.getId(), admin.getUsername());
            
            // 创建登录响应
            LoginResponse loginResponse = new LoginResponse(token, admin);
            return Result.success("登录成功", loginResponse);
        } else {
            return Result.error("用户名或密码错误");
        }
    }

    /**
     * 获取管理员信息
     */
    @GetMapping("/{id}")
    public Result<Admin> getAdmin(@PathVariable String id) {
        Admin admin = adminService.getById(id);
        
        if (admin != null) {
            return Result.success(admin);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 创建管理员
     */
    @PostMapping
    public Result<Boolean> createAdmin(@RequestBody Admin admin) {
        // 检查用户名是否已存在
        if (adminService.findByUsername(admin.getUsername()) != null) {
            return Result.error("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (adminService.findByEmail(admin.getEmail()) != null) {
            return Result.error("邮箱已存在");
        }
        
        boolean saved = adminService.save(admin);
        if (saved) {
            return Result.success("管理员创建成功", true);
        } else {
            return Result.error("管理员创建失败");
        }
    }

    /**
     * 重置管理员密码
     */
    @PostMapping("/reset-password")
    public Result<Boolean> resetPassword(@RequestBody Map<String, String> resetRequest) {
        String email = resetRequest.get("email");
        String verificationCode = resetRequest.get("verificationCode");
        String newPassword = resetRequest.get("newPassword");
        
        // 验证码验证逻辑：只要输入"123456"就视为正确
        if (verificationCode == null || verificationCode.trim().isEmpty()) {
            return Result.error("请输入验证码");
        }
        
        if (!"123456".equals(verificationCode.trim())) {
            return Result.error("验证码错误，请输入123456");
        }
        
        // 根据邮箱查找管理员
        Admin admin = adminService.findByEmail(email);
        if (admin == null) {
            return Result.error("该邮箱对应的管理员不存在");
        }
        
        // 更新密码
        admin.setPasswordHash(newPassword);
        boolean updated = adminService.updateById(admin);
        
        if (updated) {
            return Result.success("密码重置成功", true);
        } else {
            return Result.error("密码重置失败");
        }
    }
}