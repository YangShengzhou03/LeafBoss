package com.leafcard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafcard.dto.SpecificationDTO;
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
    
    /**
     * 获取规格DTO列表（包含卡密统计信息）
     * @return 规格DTO列表
     */
    List<SpecificationDTO> getSpecificationDTOs();
    
    /**
     * 根据名称查找规格
     * @param name 规格名称
     * @return 规格对象
     */
    Specification findByName(String name);
    
    /**
     * 分页查询规格列表（支持关键词和产品ID筛选）
     * @param page 分页信息
     * @param keyword 关键词（规格名称或产品名称）
     * @param productId 产品ID
     * @return 分页结果
     */
    com.baomidou.mybatisplus.core.metadata.IPage<Specification> getSpecificationsWithFilters(
            com.baomidou.mybatisplus.extension.plugins.pagination.Page<Specification> page, 
            String keyword, 
            Long productId);
}