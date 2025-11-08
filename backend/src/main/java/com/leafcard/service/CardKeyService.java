package com.leafcard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafcard.dto.CardKeyDTO;
import com.leafcard.entity.CardKey;

import java.util.List;

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
     * 获取包含商品和规格名称的卡密列表
     */
    List<CardKeyDTO> getCardKeyListWithDetails();
    
    /**
     * 获取包含商品和规格名称的卡密列表（支持筛选）
     */
    List<CardKeyDTO> getCardKeyListWithDetails(String keyword, Long specificationId);
    
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
}