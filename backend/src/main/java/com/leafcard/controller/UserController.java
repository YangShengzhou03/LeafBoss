package com.leafcard.controller;

import com.leafcard.entity.User;
import com.leafcard.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户控制器
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        Map<String, Object> result = new HashMap<>();
        
        User user = userService.login(username, password);
        if (user != null) {
            result.put("success", true);
            result.put("message", "登录成功");
            result.put("user", user);
        } else {
            result.put("success", false);
            result.put("message", "用户名或密码错误");
        }
        
        return result;
    }

    /**
     * 获取用户信息
     */
    @GetMapping("/{id}")
    public Map<String, Object> getUser(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        User user = userService.getById(id);
        
        if (user != null) {
            result.put("success", true);
            result.put("user", user);
        } else {
            result.put("success", false);
            result.put("message", "用户不存在");
        }
        
        return result;
    }

    /**
     * 创建用户
     */
    @PostMapping
    public Map<String, Object> createUser(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        
        // 检查用户名是否已存在
        if (userService.findByUsername(user.getUsername()) != null) {
            result.put("success", false);
            result.put("message", "用户名已存在");
            return result;
        }
        
        // 检查邮箱是否已存在
        if (userService.findByEmail(user.getEmail()) != null) {
            result.put("success", false);
            result.put("message", "邮箱已存在");
            return result;
        }
        
        boolean saved = userService.save(user);
        if (saved) {
            result.put("success", true);
            result.put("message", "用户创建成功");
        } else {
            result.put("success", false);
            result.put("message", "用户创建失败");
        }
        
        return result;
    }
}