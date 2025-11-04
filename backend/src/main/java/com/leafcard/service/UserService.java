package com.leafcard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafcard.entity.User;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {
    
    /**
     * 根据用户名查找用户
     */
    User findByUsername(String username);
    
    /**
     * 根据邮箱查找用户
     */
    User findByEmail(String email);
    
    /**
     * 用户登录
     */
    User login(String username, String password);
}