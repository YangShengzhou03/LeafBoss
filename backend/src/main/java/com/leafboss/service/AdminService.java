package com.leafboss.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.leafboss.entity.Admin;

/**
 * 管理员服务接口
 */
public interface AdminService extends IService<Admin> {
    
    /**
     * 根据用户名查找管理员
     */
    Admin findByUsername(String username);
    
    /**
     * 根据邮箱查找管理员
     */
    Admin findByEmail(String email);
    
    /**
     * 分页查询管理员列表（支持搜索和筛选）
     */
    Page<Admin> page(Page<Admin> pageInfo, String keyword, String status);
}