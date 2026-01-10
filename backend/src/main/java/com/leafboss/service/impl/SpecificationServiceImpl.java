package com.leafboss.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafboss.dto.SpecificationDTO;
import com.leafboss.entity.CardKey;
import com.leafboss.entity.Specification;
import com.leafboss.mapper.SpecificationMapper;
import com.leafboss.service.CardKeyService;
import com.leafboss.service.SpecificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 规格服务实现类
 */
@Service
public class SpecificationServiceImpl extends ServiceImpl<SpecificationMapper, Specification> implements SpecificationService {

    @Autowired
    @Lazy
    private CardKeyService cardKeyService;

    @Override
    public List<Specification> findByProductId(Long productId) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("product_id", productId);
        return this.list(queryWrapper);
    }

    @Override
    public List<Specification> findByStatus(Integer status) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        // 将数字状态转换为字符串ENUM值：1=active, 0=inactive
        String statusStr = status == 1 ? "active" : "inactive";
        queryWrapper.eq("status", statusStr);
        return this.list(queryWrapper);
    }

    @Override
    public List<Specification> findByProductIdAndStatus(Long productId, Integer status) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("product_id", productId);
        // 将数字状态转换为字符串ENUM值：1=active, 0=inactive
        String statusStr = status == 1 ? "active" : "inactive";
        queryWrapper.eq("status", statusStr);
        return this.list(queryWrapper);
    }

    @Override
    public Object getSpecificationStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 统计总规格数量
        long totalCount = this.count();
        statistics.put("totalCount", totalCount);
        
        // 统计不同状态的规格数量
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "active");
        long activeCount = this.count(queryWrapper);
        statistics.put("activeCount", activeCount);
        
        queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", "inactive");
        long inactiveCount = this.count(queryWrapper);
        statistics.put("inactiveCount", inactiveCount);
        
        return statistics;
    }

    @Override
    public List<SpecificationDTO> getSpecificationDTOs() {
        // 获取所有规格
        List<Specification> specifications = this.list();
        
        // 转换为DTO并添加卡密统计信息
        return specifications.stream().map(spec -> {
            SpecificationDTO dto = new SpecificationDTO();
            dto.setId(spec.getId());
            dto.setProductId(spec.getProductId());
            dto.setProductName(""); // 需要从产品表查询，暂时设为空
            dto.setName(spec.getName());
            dto.setDescription(spec.getDescription());
            dto.setDurationDays(spec.getDurationDays());
            dto.setPrice(spec.getPrice());
            dto.setStockQuantity(spec.getStockQuantity());
            // 直接返回数据库中的英文状态值，前端负责显示映射
            dto.setStatus(spec.getStatus());
            dto.setCreatedAt(spec.getCreatedAt());
            dto.setUpdatedAt(spec.getUpdatedAt());
            
            // 统计该规格的卡密信息
            QueryWrapper<CardKey> cardKeyQuery = new QueryWrapper<>();
            cardKeyQuery.eq("specification_id", spec.getId());
            
            List<CardKey> cardKeys = cardKeyService.list(cardKeyQuery);
            
            // 计算各种状态的卡密数量
            int totalKeys = cardKeys.size();
            int usedKeys = (int) cardKeys.stream().filter(card -> "已使用".equals(card.getStatus())).count();
            int unusedKeys = (int) cardKeys.stream().filter(card -> "未使用".equals(card.getStatus())).count();
            int disabledKeys = (int) cardKeys.stream().filter(card -> "已禁用".equals(card.getStatus())).count();
            
            dto.setTotalKeys(totalKeys);
            dto.setUsedKeys(usedKeys);
            dto.setUnusedKeys(unusedKeys);
            dto.setDisabledKeys(disabledKeys);
            
            return dto;
        }).collect(Collectors.toList());
    }
    
    @Override
    public IPage<SpecificationDTO> getSpecificationDTOsWithPagination(Page<Specification> page, String keyword, Long productId) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        
        // 添加产品ID筛选条件
        if (productId != null) {
            queryWrapper.eq("product_id", productId);
        }
        
        // 添加关键词筛选条件（规格名称）
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("name", keyword.trim());
        }
        
        // 执行分页查询
        IPage<Specification> specificationPage = this.page(page, queryWrapper);
        
        // 获取当前页规格的ID列表
        List<Integer> specificationIds = specificationPage.getRecords().stream()
                .map(Specification::getId)
                .collect(Collectors.toList());
        
        // 如果当前页没有规格数据，直接返回空结果
        if (specificationIds.isEmpty()) {
            Page<SpecificationDTO> resultPage = new Page<>(specificationPage.getCurrent(), specificationPage.getSize(), specificationPage.getTotal());
            resultPage.setRecords(new ArrayList<>());
            return resultPage;
        }
        
        // 一次性查询所有规格的卡密统计信息（避免N+1查询）
        Map<Integer, CardKeyStatistics> statisticsMap = getCardKeyStatisticsBySpecificationIds(specificationIds);
        
        // 转换为DTO并添加卡密统计信息
        List<SpecificationDTO> dtoList = specificationPage.getRecords().stream().map(spec -> {
            SpecificationDTO dto = new SpecificationDTO();
            dto.setId(spec.getId());
            dto.setProductId(spec.getProductId());
            dto.setProductName(""); // 需要从产品表查询，暂时设为空
            dto.setName(spec.getName());
            dto.setDescription(spec.getDescription());
            dto.setDurationDays(spec.getDurationDays());
            dto.setPrice(spec.getPrice());
            dto.setStockQuantity(spec.getStockQuantity());
            // 直接返回数据库中的英文状态值，前端负责显示映射
            dto.setStatus(spec.getStatus());
            dto.setCreatedAt(spec.getCreatedAt());
            dto.setUpdatedAt(spec.getUpdatedAt());
            
            // 从统计Map中获取卡密统计信息
            CardKeyStatistics stats = statisticsMap.get(spec.getId());
            if (stats != null) {
                dto.setTotalKeys(stats.getTotalKeys());
                dto.setUsedKeys(stats.getUsedKeys());
                dto.setUnusedKeys(stats.getUnusedKeys());
                dto.setDisabledKeys(stats.getDisabledKeys());
            } else {
                // 如果没有统计信息，设为0
                dto.setTotalKeys(0);
                dto.setUsedKeys(0);
                dto.setUnusedKeys(0);
                dto.setDisabledKeys(0);
            }
            
            return dto;
        }).collect(Collectors.toList());
        
        // 创建分页结果
        Page<SpecificationDTO> resultPage = new Page<>(specificationPage.getCurrent(), specificationPage.getSize(), specificationPage.getTotal());
        resultPage.setRecords(dtoList);
        
        return resultPage;
    }
    
    /**
     * 根据规格ID列表获取卡密统计信息
     */
    private Map<Integer, CardKeyStatistics> getCardKeyStatisticsBySpecificationIds(List<Integer> specificationIds) {
        Map<Integer, CardKeyStatistics> statisticsMap = new HashMap<>();
        
        // 使用SQL查询一次性获取所有规格的卡密统计
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
        queryWrapper.in("specification_id", specificationIds);
        queryWrapper.select("specification_id", "status", "COUNT(*) as count");
        queryWrapper.groupBy("specification_id", "status");
        
        List<Map<String, Object>> statisticsList = cardKeyService.listMaps(queryWrapper);
        
        // 初始化所有规格的统计信息
        for (Integer specId : specificationIds) {
            statisticsMap.put(specId, new CardKeyStatistics());
        }
        
        // 填充统计信息
        for (Map<String, Object> stat : statisticsList) {
            Integer specId = (Integer) stat.get("specification_id");
            String status = (String) stat.get("status");
            Long count = (Long) stat.get("count");
            
            CardKeyStatistics stats = statisticsMap.get(specId);
            if (stats != null) {
                switch (status) {
                    case "未使用":
                        stats.setUnusedKeys(count.intValue());
                        break;
                    case "已使用":
                        stats.setUsedKeys(count.intValue());
                        break;
                    case "已禁用":
                        stats.setDisabledKeys(count.intValue());
                        break;
                }
                // 计算总数
                stats.setTotalKeys(stats.getUnusedKeys() + stats.getUsedKeys() + stats.getDisabledKeys());
            }
        }
        
        return statisticsMap;
    }
    
    /**
     * 卡密统计信息内部类
     */
    private static class CardKeyStatistics {
        private int totalKeys = 0;
        private int usedKeys = 0;
        private int unusedKeys = 0;
        private int disabledKeys = 0;
        
        public int getTotalKeys() { return totalKeys; }
        public void setTotalKeys(int totalKeys) { this.totalKeys = totalKeys; }
        public int getUsedKeys() { return usedKeys; }
        public void setUsedKeys(int usedKeys) { this.usedKeys = usedKeys; }
        public int getUnusedKeys() { return unusedKeys; }
        public void setUnusedKeys(int unusedKeys) { this.unusedKeys = unusedKeys; }
        public int getDisabledKeys() { return disabledKeys; }
        public void setDisabledKeys(int disabledKeys) { this.disabledKeys = disabledKeys; }
    }
    
    @Override
    public Specification findByName(String name) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", name);
        return baseMapper.selectOne(queryWrapper);
    }
    
    @Override
    public IPage<Specification> getSpecificationsWithFilters(Page<Specification> page, String keyword, Long productId) {
        
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        
        // 添加产品ID筛选条件
        if (productId != null) {
            queryWrapper.eq("product_id", productId);
        }
        
        // 添加关键词筛选条件（规格名称）
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.like("name", keyword.trim());
        }
        
        return this.page(page, queryWrapper);
    }
}