package com.leafboss.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafboss.common.Result;
import com.leafboss.entity.User;
import com.leafboss.service.UserService;
import com.leafboss.utils.LogUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class CustomerUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private LogUtil logUtil;

    @GetMapping
    public Result<Object> getUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        
        Page<User> pageInfo = new Page<>(page, size);
        Page<User> result = userService.page(pageInfo, keyword, status);
        
        return Result.success("用户列表查询成功", java.util.Map.of(
            "page", result.getCurrent(),
            "size", result.getSize(),
            "total", result.getTotal(),
            "records", result.getRecords()
        ));
    }

    @GetMapping("/{id}")
    public Result<User> getUser(@PathVariable String id) {
        User user = userService.getById(id);
        if (user != null) {
            return Result.success(user);
        } else {
            return Result.notFound();
        }
    }

    @PostMapping
    public Result<Boolean> createUser(@RequestBody User user, HttpServletRequest request) {
        if (userService.findByUsername(user.getUsername()) != null) {
            return Result.error("用户名已存在");
        }
        if (user.getEmail() != null && userService.findByEmail(user.getEmail()) != null) {
            return Result.error("邮箱已存在");
        }
        
        if (user.getStatus() == null || user.getStatus().trim().isEmpty()) {
            user.setStatus("active");
        }
        
        boolean saved = userService.save(user);
        if (saved) {
            logUtil.logOperation("USER", "创建用户: " + user.getUsername(), request);
            return Result.success("用户创建成功", true);
        } else {
            return Result.error("用户创建失败");
        }
    }

    @PutMapping("/{id}")
    public Result<Boolean> updateUser(@PathVariable String id, @RequestBody User user, HttpServletRequest request) {
        User existingUser = userService.getById(id);
        if (existingUser == null) {
            return Result.error("用户不存在");
        }
        
        if (user.getUsername() != null && !user.getUsername().equals(existingUser.getUsername())) {
            if (userService.findByUsername(user.getUsername()) != null) {
                return Result.error("用户名已存在");
            }
        }
        
        if (user.getEmail() != null && !user.getEmail().equals(existingUser.getEmail())) {
            if (userService.findByEmail(user.getEmail()) != null) {
                return Result.error("邮箱已存在");
            }
        }
        
        user.setId(id);
        boolean updated = userService.updateById(user);
        if (updated) {
            logUtil.logOperation("USER", "更新用户: " + (user.getUsername() != null ? user.getUsername() : existingUser.getUsername()), request);
            return Result.success("用户更新成功", true);
        } else {
            return Result.error("用户更新失败");
        }
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> deleteUser(@PathVariable String id, HttpServletRequest request) {
        User user = userService.getById(id);
        boolean deleted = userService.removeById(id);
        if (deleted) {
            logUtil.logOperation("USER", "删除用户: " + (user != null ? user.getUsername() : id), request);
            return Result.success("用户删除成功", true);
        } else {
            return Result.error("用户删除失败");
        }
    }

    @PostMapping("/reset-password")
    public Result<Boolean> resetPassword(@RequestBody java.util.Map<String, String> resetRequest, HttpServletRequest request) {
        String email = resetRequest.get("email");
        String newPassword = resetRequest.get("newPassword");
        
        if (email == null || email.trim().isEmpty()) {
            return Result.error("邮箱不能为空");
        }
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            return Result.error("新密码不能为空");
        }
        
        User user = userService.findByEmail(email);
        if (user == null) {
            return Result.error("该邮箱对应的用户不存在");
        }
        
        user.setPasswordHash(newPassword);
        boolean updated = userService.updateById(user);
        
        if (updated) {
            logUtil.logOperation("USER", "重置用户密码 - 邮箱: " + email, request);
            return Result.success("密码重置成功", true);
        } else {
            return Result.error("密码重置失败");
        }
    }
}
