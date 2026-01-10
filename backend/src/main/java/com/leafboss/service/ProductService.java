package com.leafboss.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafboss.entity.Product;

import java.util.List;

/**
 * 产品服务接口
 */
public interface ProductService extends IService<Product> {
    
    /**
     * 根据名称查找产品
     */
    Product findByName(String name);
    
    /**
     * 根据分类查找产品
     */
    List<Product> findByCategory(String category);
    
    /**
     * 根据状态查找产品
     */
    List<Product> findByStatus(String status);
    
    /**
     * 获取产品统计信息
     */
    Object getProductStatistics();
}