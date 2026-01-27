package com.leafboss.controller;

import com.leafboss.common.Result;
import com.leafboss.dto.LoginResponse;
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

    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Admin admin = adminService.findByEmail(email);
        if (admin != null) {
            if ("inactive".equals(admin.getStatus())) {
                logUtil.logLogin(false, "管理员登录失败 - 邮箱: " + email + " (账号已被禁用)", request);
                return Result.error("账号已被禁用，请联系管理员");
            }

            if (admin.getPasswordHash().equals(password)) {
                admin.setLastLoginTime(java.time.LocalDateTime.now());
                adminService.updateById(admin);

                String token = jwtUtil.generateToken(admin.getId(), admin.getUsername());

                logUtil.logLogin(true, "管理员登录成功 - 邮箱: " + email, request);

                LoginResponse loginResponse = new LoginResponse(token, admin);
                return Result.success("登录成功", loginResponse);
            }
        }

        logUtil.logLogin(false, "管理员登录失败 - 邮箱: " + email + " (密码错误或用户不存在)", request);

        return Result.error("邮箱或密码错误");
    }

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

        if (admin.getPasswordHash() == null || admin.getPasswordHash().trim().isEmpty()) {
            admin.setPasswordHash("123456");
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

        Admin admin = adminService.findByEmail(email);
        if (admin == null) {
            return Result.error("该邮箱对应的管理员不存在");
        }

        admin.setPasswordHash(newPassword);
        boolean updated = adminService.updateById(admin);

        if (updated) {
            logUtil.logUserOperation("USER", "通过邮箱验证重置密码 - 邮箱: " + email, request);

            return Result.success("密码重置成功", true);
        } else {
            return Result.error("密码重置失败");
        }
    }

    @PostMapping("/admin-reset-password")
    public Result<Boolean> adminResetPassword(@RequestBody Map<String, String> resetRequest, HttpServletRequest request) {
        String email = resetRequest.get("email");
        String newPassword = resetRequest.get("newPassword");

        Admin admin = adminService.findByEmail(email);
        if (admin == null) {
            return Result.error("该邮箱对应的管理员不存在");
        }

        admin.setPasswordHash(newPassword);
        boolean updated = adminService.updateById(admin);

        if (updated) {
            logUtil.logUserOperation("USER", "直接重置其他管理员密码 - 邮箱: " + email, request);

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

    @GetMapping("/username/{username}")
    public Result<Admin> getAdminByUsername(@PathVariable String username) {
        Admin admin = adminService.findByUsername(username);

        if (admin != null) {
            return Result.success(admin);
        } else {
            return Result.notFound();
        }
    }

    @PutMapping("/{id}")
    public Result<Boolean> updateAdmin(@PathVariable String id, @RequestBody Map<String, Object> updateData) {
        try {
            Admin existingAdmin = adminService.getById(id);
            if (existingAdmin == null) {
                return Result.error("管理员不存在");
            }

            if (updateData.containsKey("username")) {
                existingAdmin.setUsername((String) updateData.get("username"));
            }
            if (updateData.containsKey("email")) {
                existingAdmin.setEmail((String) updateData.get("email"));
            }
            if (updateData.containsKey("status")) {
                Object statusObj = updateData.get("status");
                if (statusObj instanceof Integer) {
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

    @GetMapping("/statistics")
    public Result<Map<String, Object>> getAdminStatistics() {
        long totalAdmins = adminService.count();
        long recentAdmins = totalAdmins;

        Map<String, Object> statistics = Map.of(
            "totalAdmins", totalAdmins,
            "recentAdmins", recentAdmins,
            "activeAdmins", totalAdmins
        );

        return Result.success("统计信息获取成功", statistics);
    }

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

    @PutMapping("/info")
    public Result<Boolean> updateCurrentUserInfo(@RequestHeader("Authorization") String authorization,
                                                 @RequestBody Map<String, Object> updateData) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error("未授权访问");
        }

        String token = authorization.substring(7);
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            Admin existingAdmin = adminService.getById(userId);
            if (existingAdmin == null) {
                return Result.error("用户不存在");
            }

            if (updateData.containsKey("username")) {
                existingAdmin.setUsername((String) updateData.get("username"));
            }
            if (updateData.containsKey("email")) {
                existingAdmin.setEmail((String) updateData.get("email"));
            }
            if (updateData.containsKey("password")) {
                existingAdmin.setPasswordHash((String) updateData.get("password"));
            }

            boolean updated = adminService.updateById(existingAdmin);

            if (updated) {
                return Result.success("用户信息更新成功", true);
            } else {
                return Result.error("用户信息更新失败");
            }
        } catch (Exception e) {
            return Result.error("Token无效或已过期");
        }
    }

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

            Admin admin = adminService.getById(userId);
            if (admin == null) {
                return Result.error("用户不存在");
            }

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