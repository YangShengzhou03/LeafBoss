package com.leafboss.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafboss.dto.CardKeyDTO;
import com.leafboss.entity.CardKey;
import com.leafboss.entity.Specification;
import com.leafboss.entity.Product;
import com.leafboss.mapper.CardKeyMapper;
import com.leafboss.service.CardKeyService;
import com.leafboss.service.SpecificationService;
import com.leafboss.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public IPage<CardKeyDTO> getCardKeyListWithDetails(Page<CardKey> pageParam, String keyword, Long specificationId, String status) {
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();

        if (status != null && !status.trim().isEmpty()) {
            queryWrapper.eq("status", status);
        }

        if (specificationId != null) {
            queryWrapper.eq("specification_id", specificationId);
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.and(wrapper -> wrapper
                .like("card_key", keyword)
                .or()
                .like("user_email", keyword)
            );
        }

        Page<CardKey> cardKeyPage = baseMapper.selectPage(pageParam, queryWrapper);
        List<CardKey> records = cardKeyPage.getRecords();

        if (records.isEmpty()) {
            Page<CardKeyDTO> resultPage = new Page<>(cardKeyPage.getCurrent(), cardKeyPage.getSize(), cardKeyPage.getTotal());
            resultPage.setRecords(new java.util.ArrayList<>());
            return resultPage;
        }

        // 批量获取规格信息，避免 N+1
        List<Integer> specIds = records.stream()
                .map(CardKey::getSpecificationId)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        Map<Integer, Specification> specMap = new HashMap<>();
        Map<Integer, Product> productMap = new HashMap<>();

        if (!specIds.isEmpty()) {
            List<Specification> specs = specificationService.listByIds(specIds);
            specMap = specs.stream().collect(Collectors.toMap(Specification::getId, s -> s));

            List<Integer> productIds = specs.stream()
                    .map(Specification::getProductId)
                    .filter(java.util.Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            if (!productIds.isEmpty()) {
                List<Product> products = productService.listByIds(productIds);
                productMap = products.stream().collect(Collectors.toMap(Product::getId, p -> p));
            }
        }

        Map<Integer, Specification> finalSpecMap = specMap;
        Map<Integer, Product> finalProductMap = productMap;

        List<CardKeyDTO> dtoList = records.stream().map(cardKey -> {
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

            if (cardKey.getSpecificationId() != null) {
                Specification spec = finalSpecMap.get(cardKey.getSpecificationId());
                if (spec != null) {
                    dto.setSpecificationName(spec.getName());
                    dto.setProductId(spec.getProductId());

                    if (spec.getProductId() != null) {
                        Product product = finalProductMap.get(spec.getProductId());
                        if (product != null) {
                            dto.setProductName(product.getName());
                        }
                    }
                }
            }

            return dto;
        }).collect(Collectors.toList());

        Page<CardKeyDTO> resultPage = new Page<>(cardKeyPage.getCurrent(), cardKeyPage.getSize(), cardKeyPage.getTotal());
        resultPage.setRecords(dtoList);

        return resultPage;
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
        Map<String, Long> statistics = new HashMap<>();
        
        statistics.put("total", this.count());
        
        QueryWrapper<CardKey> unusedQuery = new QueryWrapper<>();
        unusedQuery.eq("status", "未使用");
        statistics.put("unused", this.count(unusedQuery));
        
        QueryWrapper<CardKey> usedQuery = new QueryWrapper<>();
        usedQuery.eq("status", "已使用");
        statistics.put("used", this.count(usedQuery));
        
        QueryWrapper<CardKey> disabledQuery = new QueryWrapper<>();
        disabledQuery.eq("status", "已禁用");
        statistics.put("disabled", this.count(disabledQuery));

        return statistics;
    }

    @Override
    public boolean batchGenerateCardKeys(String productId, Integer specificationId, Integer quantity, String prefix) {
        if (quantity == null || quantity <= 0 || quantity > 1000) {
            return false;
        }

        try {
            java.util.List<CardKey> cardKeys = new java.util.ArrayList<>();
            LocalDateTime now = LocalDateTime.now();
            
            for (int i = 0; i < quantity; i++) {
                CardKey cardKey = new CardKey();
                String cardKeyStr = generateCardKeyString(prefix);

                cardKey.setCardKey(cardKeyStr);
                cardKey.setSpecificationId(specificationId);
                cardKey.setStatus("未使用");
                cardKey.setUserId(null);
                cardKey.setUserEmail(null);
                cardKey.setActivateTime(null);
                cardKey.setExpireTime(null);
                cardKey.setCreatedAt(now);
                cardKey.setUpdatedAt(now);

                cardKeys.add(cardKey);
            }

            return this.saveBatch(cardKeys);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private String generateCardKeyString(String prefix) {
        StringBuilder sb = new StringBuilder();

        if (prefix != null && !prefix.trim().isEmpty()) {
            sb.append(prefix);
        }

        String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int length = 16 - sb.length();

        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            sb.append(chars.charAt(index));
        }

        return sb.toString();
    }

    @Override
    public boolean batchDeleteUsedCardKeys() {
        try {
            QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("status", "已使用");

            List<CardKey> usedCardKeys = baseMapper.selectList(queryWrapper);

            if (usedCardKeys.isEmpty()) {
                return true;
            }

            boolean deleted = baseMapper.delete(queryWrapper) > 0;

            return deleted;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}