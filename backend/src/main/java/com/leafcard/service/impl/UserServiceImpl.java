package com.leafcard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafcard.entity.User;
import com.leafcard.mapper.UserMapper;
import com.leafcard.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Override
    public User findByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return this.getOne(queryWrapper);
    }

    @Override
    public User findByEmail(String email) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("email", email);
        return this.getOne(queryWrapper);
    }

    @Override
    public User login(String username, String password) {
        User user = findByUsername(username);
        // 在实际应用中，这里应该使用密码加密验证
        // 例如：BCrypt.checkpw(password, user.getPasswordHash())
        if (user != null && user.getPasswordHash().equals(password)) {
            user.setLastLoginTime(LocalDateTime.now());
            this.updateById(user);
            return user;
        }
        return null;
    }
}