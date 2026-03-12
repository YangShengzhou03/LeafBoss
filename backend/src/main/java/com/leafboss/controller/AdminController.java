package com.leafboss.controller;

import com.leafboss.common.Result;
import com.leafboss.entity.Admin;
import com.leafboss.service.AdminService;
import com.leafboss.utils.JwtUtil;
import com.leafboss.utils.LogUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private LogUtil logUtil;

    @GetMapping("/{id}")
    public Result<Admin> getAdmin(@PathVariable String id) {
        Admin admin = adminService.getById(id);

        if (admin != null) {
            return Result.success(admin);
        } else {
            return Result.notFound();
        }
    }

    @PostMapping
    public Result<Boolean> createAdmin(@RequestBody Admin admin, HttpServletRequest request) {
        if (adminService.findByEmail(admin.getEmail()) != null) {
            return Result.error("邮箱已存在");
        }

        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty()) {
            admin.setUsername("leafAdmin");
        }

        if (admin.getPassword() == null || admin.getPassword().trim().isEmpty()) {
            admin.setPassword("123456");
        }

        if (admin.getStatus() == null || admin.getStatus().trim().isEmpty()) {
            admin.setStatus("active");
        }

        boolean saved = adminService.save(admin);
        if (saved) {
            logUtil.logUserOperation("USER", "创建管理员账户 - 邮箱: " + admin.getEmail(), request);

            return Result.success("管理员创建成功", true);
        } else {
            return Result.error("管理员创建失败");
        }
    }

    @PostMapping("/reset-password")
    public Result<Boolean> resetPassword(@RequestBody Map<String, String> resetRequest, HttpServletRequest request) {
        String email = resetRequest.get("email");
        String verificationCode = resetRequest.get("verificationCode");
        String newPassword = resetRequest.get("newPassword");

        if (verificationCode == null || verificationCode.trim().isEmpty()) {
            return Result.error("请输入验证码");
        }

        if (!"123456".equals(verificationCode.trim())) {
            return Result.error("验证码错误，请输入123456");
        }

        return performPasswordReset(email, newPassword, "通过邮箱验证重置密码", request);
    }

    @PostMapping("/admin-reset-password")
    public Result<Boolean> adminResetPassword(@RequestBody Map<String, String> resetRequest, HttpServletRequest request) {
        String email = resetRequest.get("email");
        String newPassword = resetRequest.get("newPassword");

        return performPasswordReset(email, newPassword, "直接重置其他管理员密码", request);
    }

    private Result<Boolean> performPasswordReset(String email, String newPassword, String logAction, HttpServletRequest request) {
        Admin admin = adminService.findByEmail(email);
        if (admin == null) {
            return Result.error("该邮箱对应的管理员不存在");
        }

        admin.setPassword(newPassword);
        boolean updated = adminService.updateById(admin);

        if (updated) {
            logUtil.logUserOperation("USER", logAction + " - 邮箱: " + email, request);
            return Result.success("密码重置成功", true);
        } else {
            return Result.error("密码重置失败");
        }
    }

    @PostMapping("/send-reset-code")
    public Result<Boolean> sendResetCode(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return Result.error("邮箱不能为空");
        }

        Admin admin = adminService.findByEmail(email);
        if (admin == null) {
            return Result.error("该邮箱对应的管理员不存在");
        }

        return Result.success("验证码已发送，请输入123456", true);
    }

    @GetMapping
    public Result<Object> getAdmins(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {

        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Admin> pageInfo =
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(page, size);

        com.baomidou.mybatisplus.extension.plugins.pagination.Page<Admin> result = adminService.page(pageInfo, keyword, status);

        return Result.success("管理员列表查询成功", Map.of(
            "page", result.getCurrent(),
            "size", result.getSize(),
            "total", result.getTotal(),
            "records", result.getRecords()
        ));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> deleteAdmin(@PathVariable String id) {
        boolean deleted = adminService.removeById(id);

        if (deleted) {
            return Result.success("管理员删除成功", true);
        } else {
            return Result.error("管理员删除失败");
        }
    }

    @PutMapping("/{id}")
    public Result<Boolean> updateAdmin(@PathVariable String id, @RequestBody Admin adminData) {
        try {
            Admin existingAdmin = adminService.getById(id);
            if (existingAdmin == null) {
                return Result.error("管理员不存在");
            }

            adminData.setId(id);
            boolean updated = adminService.updateById(adminData);

            if (updated) {
                return Result.success("管理员更新成功", true);
            } else {
                return Result.error("管理员更新失败");
            }
        } catch (Exception e) {
            return Result.error("更新管理员信息时发生错误: " + e.getMessage());
        }
    }

    @GetMapping("/storage")
    public Result<Map<String, Object>> getStorageInfo(@RequestHeader("Authorization") String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error("未授权访问");
        }

        String token = authorization.substring(7);
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            Admin admin = adminService.getById(userId);

            if (admin != null) {
                Map<String, Object> storageInfo = Map.of(
                    "storageQuota", 1073741824L,
                    "usedStorage", 104857600L,
                    "availableStorage", 1073741824L - 104857600L,
                    "usagePercentage", 10
                );
                return Result.success(storageInfo);
            } else {
                return Result.error("用户不存在");
            }
        } catch (Exception e) {
            return Result.error("Token无效或已过期");
        }
    }
}