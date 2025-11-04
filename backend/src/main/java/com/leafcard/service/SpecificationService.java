package com.leafcard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafcard.entity.Specification;

import java.util.List;

/**
 * 规格服务接口
 */
public interface SpecificationService extends IService<Specification> {
    
    /**
     * 根据产品ID查询规格列表
     * @param productId 产品ID
     * @return 规格列表
     */
    List<Specification> findByProductId(Long productId);
    
    /**
     * 根据状态查询规格列表
     * @param status 状态
     * @return 规格列表
     */
    List<Specification> findByStatus(Integer status);
    
    /**
     * 根据产品ID和状态查询规格列表
     * @param productId 产品ID
     * @param status 状态
     * @return 规格列表
     */
    List<Specification> findByProductIdAndStatus(Long productId, Integer status);
    
    /**
     * 获取规格统计信息
     * @return 统计信息
     */
    Object getSpecificationStatistics();
}