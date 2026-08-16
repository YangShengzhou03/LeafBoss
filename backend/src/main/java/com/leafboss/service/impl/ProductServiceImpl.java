package com.leafboss.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafboss.entity.Product;
import com.leafboss.entity.Specification;
import com.leafboss.entity.CardKey;
import com.leafboss.mapper.ProductMapper;
import com.leafboss.mapper.SpecificationMapper;
import com.leafboss.service.ProductService;
import com.leafboss.service.SpecificationService;
import com.leafboss.service.CardKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProductServiceImpl extends ServiceImpl<ProductMapper, Product> implements ProductService {

    @Autowired
    private SpecificationMapper specificationMapper;

    @Autowired
    private SpecificationService specificationService;

    @Autowired
    @Lazy
    private CardKeyService cardKeyService;

    @Override
    public Product findByName(String name) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", name);
        return baseMapper.selectOne(queryWrapper);
    }

    @Override
    public List<Product> findByStatus(String status) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", status);
        return this.list(queryWrapper);
    }

    @Override
    public Object getProductStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        long totalProducts = this.count();
        statistics.put("totalProducts", (int)totalProducts);

        QueryWrapper<Product> activeProductQuery = new QueryWrapper<>();
        activeProductQuery.eq("status", "active");
        statistics.put("activeProducts", (int)this.count(activeProductQuery));

        QueryWrapper<Product> inactiveProductQuery = new QueryWrapper<>();
        inactiveProductQuery.eq("status", "inactive");
        statistics.put("inactiveProducts", (int)this.count(inactiveProductQuery));

        QueryWrapper<Specification> activeSpecQuery = new QueryWrapper<>();
        activeSpecQuery.eq("status", "active");
        statistics.put("activeSpecifications", (int)specificationService.count(activeSpecQuery));

        // 计算总库存 - 这里使用 listMaps 聚合或者简单的 sum
        QueryWrapper<Specification> stockQuery = new QueryWrapper<>();
        stockQuery.eq("status", "active");
        stockQuery.select("SUM(stock_quantity) as totalStock");
        Map<String, Object> stockMap = specificationService.getMap(stockQuery);
        
        Object totalStockObj = stockMap != null ? stockMap.get("totalStock") : 0;
        int totalStock = 0;
        if (totalStockObj instanceof Number) {
            totalStock = ((Number) totalStockObj).intValue();
        }
        statistics.put("totalStock", totalStock);

        return statistics;
    }

    @Override
    @Transactional
    public boolean updateById(Product product) {
        Product existingProduct = getById(product.getId());
        if (existingProduct == null) {
            return false;
        }

        boolean isStatusChangedToInactive = "active".equals(existingProduct.getStatus()) &&
                                           "inactive".equals(product.getStatus());

        boolean updated = super.updateById(product);

        if (updated && isStatusChangedToInactive) {
            disableRelatedSpecificationsAndCardKeys(product.getId());
        }

        return updated;
    }

    private void disableRelatedSpecificationsAndCardKeys(Integer productId) {
        QueryWrapper<Specification> specQueryWrapper = new QueryWrapper<>();
        specQueryWrapper.eq("product_id", productId.longValue());
        List<Specification> specifications = specificationService.list(specQueryWrapper);

        for (Specification spec : specifications) {
            if ("active".equals(spec.getStatus())) {
                spec.setStatus("inactive");
                specificationService.updateById(spec);

                disableCardKeysBySpecificationId(spec.getId());
            }
        }
    }

    private void disableCardKeysBySpecificationId(Integer specificationId) {
        QueryWrapper<CardKey> cardKeyQueryWrapper = new QueryWrapper<>();
        cardKeyQueryWrapper.eq("specification_id", specificationId);
        List<CardKey> cardKeys = cardKeyService.list(cardKeyQueryWrapper);

        for (CardKey cardKey : cardKeys) {
            if (!"已禁用".equals(cardKey.getStatus())) {
                cardKey.setStatus("已禁用");
                cardKeyService.updateById(cardKey);
            }
        }
    }
}