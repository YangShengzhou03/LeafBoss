package com.leafboss.controller;

import com.leafboss.common.Result;
import com.leafboss.entity.Admin;
import com.leafboss.service.AdminService;
import com.leafboss.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

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

    @PutMapping("/profile")
    public Result<Boolean> updateProfile(@RequestHeader("Authorization") String authorization,
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
    public Result<Boolean> updatePassword(@RequestHeader("Authorization") String authorization,
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
                return Result.success("密码更新成功", true);
            } else {
                return Result.error("密码更新失败");
            }
        } catch (Exception e) {
            return Result.error("Token无效或已过期");
        }
    }
}