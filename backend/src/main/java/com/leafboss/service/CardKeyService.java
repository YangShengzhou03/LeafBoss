package com.leafboss.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafboss.dto.CardKeyDTO;
import com.leafboss.entity.CardKey;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * 卡密服务接口
 */
public interface CardKeyService extends IService<CardKey> {
    
    /**
     * 根据卡密查找
     */
    CardKey findByCardKey(String cardKey);
    
    /**
     * 根据状态查找卡密
     */
    List<CardKey> findByStatus(String status);
    
    /**
     * 获取包含商品和规格名称的卡密列表（支持分页）
     */
    IPage<CardKeyDTO> getCardKeyListWithDetails(Page<CardKey> pageParam, String keyword, Long specificationId, String status);
    
    /**
     * 激活卡密
     */
    boolean activateCard(String cardKey, String userId, String userEmail);
    
    /**
     * 禁用卡密
     */
    boolean disableCard(String cardKey);
    
    /**
     * 获取卡密统计信息
     */
    Object getCardStatistics();
    
    /**
     * 批量生成卡密
     */
    boolean batchGenerateCardKeys(String productId, Integer quantity, String prefix);
    
    /**
     * 批量删除已使用卡密
     */
    boolean batchDeleteUsedCardKeys();
}