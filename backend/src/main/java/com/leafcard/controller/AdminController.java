package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.dto.LoginResponse;
import com.leafcard.entity.Admin;
import com.leafcard.service.AdminService;
import com.leafcard.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
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
     * 管理员登录（使用邮箱登录）
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        // 根据邮箱查找管理员
        Admin admin = adminService.findByEmail(email);
        if (admin != null && admin.getPasswordHash().equals(password)) {
            // 更新最后登录时间
            admin.setLastLoginTime(java.time.LocalDateTime.now());
            adminService.updateById(admin);
            
            // 生成JWT token
            String token = jwtUtil.generateToken(admin.getId(), admin.getUsername());
            
            // 创建登录响应
            LoginResponse loginResponse = new LoginResponse(token, admin);
            return Result.success("登录成功", loginResponse);
        } else {
            return Result.error("邮箱或密码错误");
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
        // 检查邮箱是否已存在
        if (adminService.findByEmail(admin.getEmail()) != null) {
            return Result.error("邮箱已存在");
        }
        
        // 如果用户名未提供，设置默认值
        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty()) {
            admin.setUsername("leafAdmin");
        }
        
        // 设置默认密码为123456
        if (admin.getPasswordHash() == null || admin.getPasswordHash().trim().isEmpty()) {
            admin.setPasswordHash("123456");
        }
        
        // 设置默认状态为active
        if (admin.getStatus() == null || admin.getStatus().trim().isEmpty()) {
            admin.setStatus("active");
        }
        
        boolean saved = adminService.save(admin);
        if (saved) {
            return Result.success("管理员创建成功", true);
        } else {
            return Result.error("管理员创建失败");
        }
    }

    /**
     * 发送重置密码验证码
     */
    @PostMapping("/send-reset-code")
    public Result<Boolean> sendResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.trim().isEmpty()) {
            return Result.error("邮箱不能为空");
        }
        
        // 检查邮箱是否存在
        Admin admin = adminService.findByEmail(email);
        if (admin == null) {
            return Result.error("该邮箱对应的管理员不存在");
        }
        
        // 在实际项目中，这里应该发送真实的验证码到邮箱
        // 目前返回成功，验证码固定为"123456"
        return Result.success("验证码已发送，请输入123456", true);
    }

    /**
     * 重置管理员密码（需要验证码）
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

    /**
     * 管理员直接重置用户密码（无需验证码）
     */
    @PostMapping("/admin-reset-password")
    public Result<Boolean> adminResetPassword(@RequestBody Map<String, String> resetRequest) {
        String email = resetRequest.get("email");
        String newPassword = resetRequest.get("newPassword");
        
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

    /**
     * 分页查询管理员列表
     */
    @GetMapping
    public Result<Object> getAdmins(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // 使用MyBatis Plus的分页查询
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Admin> pageInfo = 
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(page, size);
        
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Admin> result = adminService.page(pageInfo);
        
        return Result.success("管理员列表查询成功", Map.of(
            "page", result.getCurrent(),
            "size", result.getSize(),
            "total", result.getTotal(),
            "records", result.getRecords()
        ));
    }

    /**
     * 删除管理员
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteAdmin(@PathVariable String id) {
        boolean deleted = adminService.removeById(id);
        
        if (deleted) {
            return Result.success("管理员删除成功", true);
        } else {
            return Result.error("管理员删除失败");
        }
    }

    /**
     * 根据用户名获取管理员
     */
    @GetMapping("/username/{username}")
    public Result<Admin> getAdminByUsername(@PathVariable String username) {
        Admin admin = adminService.findByUsername(username);
        
        if (admin != null) {
            return Result.success(admin);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 更新管理员信息
     */
    @PutMapping("/{id}")
    public Result<Boolean> updateAdmin(@PathVariable String id, @RequestBody Map<String, Object> updateData) {
        try {
            // 获取现有管理员信息
            Admin existingAdmin = adminService.getById(id);
            if (existingAdmin == null) {
                return Result.error("管理员不存在");
            }
            
            // 更新字段
            if (updateData.containsKey("username")) {
                existingAdmin.setUsername((String) updateData.get("username"));
            }
            if (updateData.containsKey("email")) {
                existingAdmin.setEmail((String) updateData.get("email"));
            }
            if (updateData.containsKey("status")) {
                // 处理状态字段，支持字符串和数字类型
                Object statusObj = updateData.get("status");
                if (statusObj instanceof Integer) {
                    // 如果是数字，转换为对应的字符串状态
                    int statusValue = (Integer) statusObj;
                    existingAdmin.setStatus(statusValue == 1 ? "active" : "inactive");
                } else if (statusObj instanceof String) {
                    existingAdmin.setStatus((String) statusObj);
                }
            }
            if (updateData.containsKey("passwordHash")) {
                existingAdmin.setPasswordHash((String) updateData.get("passwordHash"));
            }
            
            boolean updated = adminService.updateById(existingAdmin);
            
            if (updated) {
                return Result.success("管理员更新成功", true);
            } else {
                return Result.error("管理员更新失败");
            }
        } catch (Exception e) {
            return Result.error("更新管理员信息时发生错误: " + e.getMessage());
        }
    }

    /**
     * 获取管理员统计信息
     */
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getAdminStatistics() {
        // 获取管理员总数
        long totalAdmins = adminService.count();
        
        // 获取最近登录的管理员数量（这里简化处理，实际应该根据时间筛选）
        long recentAdmins = totalAdmins; // 简化处理
        
        Map<String, Object> statistics = Map.of(
            "totalAdmins", totalAdmins,
            "recentAdmins", recentAdmins,
            "activeAdmins", totalAdmins // 简化处理
        );
        
        return Result.success("统计信息获取成功", statistics);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    public Result<Admin> getCurrentUserInfo(@RequestHeader("Authorization") String authorization) {
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
     * 更新当前用户信息
     */
    @PutMapping("/info")
    public Result<Boolean> updateCurrentUserInfo(@RequestHeader("Authorization") String authorization, 
                                                 @RequestBody Admin admin) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error("未授权访问");
        }
        
        String token = authorization.substring(7);
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            admin.setId(userId);
            boolean updated = adminService.updateById(admin);
            
            if (updated) {
                return Result.success("用户信息更新成功", true);
            } else {
                return Result.error("用户信息更新失败");
            }
        } catch (Exception e) {
            return Result.error("Token无效或已过期");
        }
    }

    /**
     * 修改当前用户密码
     */
    @PutMapping("/password")
    public Result<Boolean> changePassword(@RequestHeader("Authorization") String authorization, 
                                          @RequestBody Map<String, String> passwordData) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error("未授权访问");
        }
        
        String token = authorization.substring(7);
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");
            
            // 验证旧密码
            Admin admin = adminService.getById(userId);
            if (admin == null) {
                return Result.error("用户不存在");
            }
            
            // 这里应该验证旧密码是否正确（实际项目中需要加密验证）
            // 然后更新密码
            admin.setPasswordHash(newPassword);
            boolean updated = adminService.updateById(admin);
            
            if (updated) {
                return Result.success("密码修改成功", true);
            } else {
                return Result.error("密码修改失败");
            }
        } catch (Exception e) {
            return Result.error("Token无效或已过期");
        }
    }
}