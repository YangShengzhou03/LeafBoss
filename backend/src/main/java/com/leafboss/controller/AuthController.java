package com.leafboss.controller;

import com.leafboss.common.Result;
import com.leafboss.entity.Admin;
import com.leafboss.service.AdminService;
import com.leafboss.utils.JwtUtil;
import com.leafboss.utils.LogUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private LogUtil logUtil;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || email.trim().isEmpty()) {
            return Result.error("邮箱不能为空");
        }
        if (password == null || password.trim().isEmpty()) {
            return Result.error("密码不能为空");
        }

        Admin admin = adminService.findByEmail(email);
        if (admin != null) {
            if ("inactive".equals(admin.getStatus())) {
                logUtil.logLogin(false, "管理员登录失败 - 邮箱: " + email + " (账号已被禁用)", request);
                return Result.error("账号已被禁用，请联系管理员");
            }

            if (password.equals(admin.getPassword())) {
                admin.setLastLoginTime(LocalDateTime.now());
                adminService.updateById(admin);

                String token = jwtUtil.generateToken(admin.getId(), admin.getEmail());

                logUtil.logLogin(true, "管理员登录成功 - 邮箱: " + email, request);

                Map<String, Object> response = Map.of(
                    "token", token,
                    "user", admin
                );
                return Result.success("登录成功", response);
            }
        }

        logUtil.logLogin(false, "管理员登录失败 - 邮箱: " + email + " (密码错误或用户不存在)", request);
        return Result.error("邮箱或密码错误");
    }

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

    @PutMapping("/me")
    public Result<Boolean> updateCurrentUser(@RequestHeader("Authorization") String authorization,
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

    @PutMapping("/password")
    public Result<Boolean> changePassword(@RequestHeader("Authorization") String authorization,
                                          @RequestBody Map<String, String> passwordData) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return Result.error("未授权访问");
        }

        String token = authorization.substring(7);
        try {
            String userId = jwtUtil.getUserIdFromToken(token);
            String newPassword = passwordData.get("newPassword");

            Admin admin = adminService.getById(userId);
            if (admin == null) {
                return Result.error("用户不存在");
            }

            admin.setPassword(newPassword);
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

    @PostMapping("/register")
    public Result<Boolean> register(@RequestBody Admin admin) {
        if (adminService.findByEmail(admin.getEmail()) != null) {
            return Result.error("邮箱已存在");
        }

        if (admin.getUsername() == null || admin.getUsername().trim().isEmpty()) {
            String emailPrefix = admin.getEmail().split("@")[0];
            admin.setUsername(emailPrefix);
        }

        if (admin.getStatus() == null || admin.getStatus().trim().isEmpty()) {
            admin.setStatus("inactive");
        }

        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        boolean saved = adminService.save(admin);

        if (saved) {
            return Result.success("注册成功", true);
        } else {
            return Result.error("注册失败");
        }
    }

    @PostMapping("/logout")
    public Result<Boolean> logout() {
        return Result.success("登出成功", true);
    }
}