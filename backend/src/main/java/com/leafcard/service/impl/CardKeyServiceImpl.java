package com.leafcard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafcard.dto.CardKeyDTO;
import com.leafcard.entity.CardKey;
import com.leafcard.entity.Specification;
import com.leafcard.entity.Product;
import com.leafcard.mapper.CardKeyMapper;
import com.leafcard.service.CardKeyService;
import com.leafcard.service.SpecificationService;
import com.leafcard.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 卡密服务实现类
 */
@Service
public class CardKeyServiceImpl extends ServiceImpl<CardKeyMapper, CardKey> implements CardKeyService {

    @Autowired
    private SpecificationService specificationService;
    
    @Autowired
    private ProductService productService;

    @Override
    public CardKey findByCardKey(String cardKey) {
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("card_key", cardKey);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public List<CardKey> findByStatus(String status) {
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", status);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public List<CardKeyDTO> getCardKeyListWithDetails() {
        return getCardKeyListWithDetails(null, null);
    }
    
    @Override
    public List<CardKeyDTO> getCardKeyListWithDetails(String keyword, Long specificationId) {
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
        
        // 根据规格ID筛选
        if (specificationId != null) {
            queryWrapper.eq("specification_id", specificationId);
        }
        
        // 根据关键词筛选（卡密或用户邮箱）
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.and(wrapper -> wrapper
                .like("card_key", keyword)
                .or()
                .like("user_email", keyword)
            );
        }
        
        List<CardKey> cardKeys = baseMapper.selectList(queryWrapper);
        
        return cardKeys.stream().map(cardKey -> {
            CardKeyDTO dto = new CardKeyDTO();
            dto.setId(cardKey.getId());
            dto.setCardKey(cardKey.getCardKey());
            dto.setSpecificationId(cardKey.getSpecificationId());
            dto.setStatus(cardKey.getStatus());
            dto.setUserEmail(cardKey.getUserEmail());
            dto.setUserId(cardKey.getUserId());
            dto.setActivateTime(cardKey.getActivateTime());
            dto.setExpireTime(cardKey.getExpireTime());
            dto.setCreatedAt(cardKey.getCreatedAt());
            dto.setUpdatedAt(cardKey.getUpdatedAt());
            
            // 获取规格信息
            if (cardKey.getSpecificationId() != null) {
                Specification spec = specificationService.getById(cardKey.getSpecificationId());
                if (spec != null) {
                    dto.setSpecificationName(spec.getName());
                    dto.setProductId(spec.getProductId());
                    
                    // 获取商品信息
                    if (spec.getProductId() != null) {
                        Product product = productService.getById(spec.getProductId());
                        if (product != null) {
                            dto.setProductName(product.getName());
                        }
                    }
                }
            }
            
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean activateCard(String cardKey, String userId, String userEmail) {
        CardKey card = findByCardKey(cardKey);
        if (card == null || !"未使用".equals(card.getStatus())) {
            return false;
        }
        
        card.setStatus("已使用");
        card.setUserId(userId);
        card.setUserEmail(userEmail);
        card.setActivateTime(LocalDateTime.now());
        
        // 设置过期时间（这里需要根据规格的duration_days计算）
        // 实际项目中应该查询规格表获取duration_days
        card.setExpireTime(LocalDateTime.now().plusDays(30));
        
        return updateById(card);
    }

    @Override
    public boolean disableCard(String cardKey) {
        CardKey card = findByCardKey(cardKey);
        if (card == null) {
            return false;
        }
        
        card.setStatus("已禁用");
        return updateById(card);
    }

    @Override
    public Object getCardStatistics() {
        List<CardKey> allCards = baseMapper.selectList(null);
        
        Map<String, Integer> statistics = new HashMap<>();
        statistics.put("total", allCards.size());
        statistics.put("unused", (int) allCards.stream().filter(card -> "未使用".equals(card.getStatus())).count());
        statistics.put("used", (int) allCards.stream().filter(card -> "已使用".equals(card.getStatus())).count());
        statistics.put("disabled", (int) allCards.stream().filter(card -> "已禁用".equals(card.getStatus())).count());
        
        return statistics;
    }
    
    @Override
    public boolean batchGenerateCardKeys(String productId, Integer quantity, String prefix) {
        if (quantity == null || quantity <= 0 || quantity > 1000) {
            return false;
        }
        
        try {
            // 生成指定数量的卡密
            for (int i = 0; i < quantity; i++) {
                CardKey cardKey = new CardKey();
                
                // 生成卡密字符串（前缀 + 随机字符）
                String cardKeyStr = generateCardKeyString(prefix);
                
                cardKey.setCardKey(cardKeyStr);
                cardKey.setSpecificationId(null); // 暂时不关联规格
                cardKey.setStatus("未使用");
                cardKey.setUserId(null);
                cardKey.setUserEmail(null);
                cardKey.setActivateTime(null);
                cardKey.setExpireTime(null);
                cardKey.setCreatedAt(LocalDateTime.now());
                cardKey.setUpdatedAt(LocalDateTime.now());
                
                // 保存卡密
                baseMapper.insert(cardKey);
            }
            
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * 生成卡密字符串
     */
    private String generateCardKeyString(String prefix) {
        StringBuilder sb = new StringBuilder();
        
        if (prefix != null && !prefix.trim().isEmpty()) {
            sb.append(prefix);
        }
        
        // 生成随机字符（数字+大写字母，共16位）
        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int length = 16 - sb.length();
        
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }
        
        return sb.toString();
    }
}