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

/**
 * 产品服务实现类
 */
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
    public List<Product> findByCategory(String category) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("category", category);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public List<Product> findByStatus(String status) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", status);
        return baseMapper.selectList(queryWrapper);
    }

    @Override
    public Object getProductStatistics() {
        List<Product> allProducts = baseMapper.selectList(null);
        List<Specification> allSpecifications = specificationMapper.selectList(null);
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalProducts", allProducts.size());
        statistics.put("activeProducts", (int) allProducts.stream().filter(product -> "active".equals(product.getStatus())).count());
        statistics.put("inactiveProducts", (int) allProducts.stream().filter(product -> "inactive".equals(product.getStatus())).count());
        statistics.put("activeSpecifications", (int) allSpecifications.stream().filter(spec -> "active".equals(spec.getStatus())).count());
        
        int totalStock = allSpecifications.stream()
                .filter(spec -> "active".equals(spec.getStatus()))
                .mapToInt(Specification::getStockQuantity)
                .sum();
        statistics.put("totalStock", totalStock);
        
        return statistics;
    }
    
    /**
     * 重写updateById方法，在商品状态更新为"inactive"时，自动禁用所有相关的规格和卡密
     */
    @Override
    @Transactional
    public boolean updateById(Product product) {
        // 获取更新前的商品信息
        Product existingProduct = getById(product.getId());
        if (existingProduct == null) {
            return false;
        }
        
        // 检查商品状态是否从active变为inactive
        boolean isStatusChangedToInactive = "active".equals(existingProduct.getStatus()) && 
                                           "inactive".equals(product.getStatus());
        
        // 执行商品更新
        boolean updated = super.updateById(product);
        
        // 如果商品状态变为inactive，则禁用所有相关规格和卡密
        if (updated && isStatusChangedToInactive) {
            disableRelatedSpecificationsAndCardKeys(product.getId());
        }
        
        return updated;
    }
    
    /**
     * 禁用指定商品的所有相关规格和卡密
     */
    private void disableRelatedSpecificationsAndCardKeys(Integer productId) {
        // 禁用所有相关规格
        QueryWrapper<Specification> specQueryWrapper = new QueryWrapper<>();
        specQueryWrapper.eq("product_id", productId.longValue());
        List<Specification> specifications = specificationService.list(specQueryWrapper);
        
        for (Specification spec : specifications) {
            // 如果规格当前是active状态，则禁用
            if ("active".equals(spec.getStatus())) {
                spec.setStatus("inactive");
                specificationService.updateById(spec);
                
                // 禁用该规格的所有卡密
                disableCardKeysBySpecificationId(spec.getId());
            }
        }
    }
    
    /**
     * 禁用指定规格的所有卡密
     */
    private void disableCardKeysBySpecificationId(Integer specificationId) {
        QueryWrapper<CardKey> cardKeyQueryWrapper = new QueryWrapper<>();
        cardKeyQueryWrapper.eq("specification_id", specificationId);
        List<CardKey> cardKeys = cardKeyService.list(cardKeyQueryWrapper);
        
        for (CardKey cardKey : cardKeys) {
            // 如果卡密当前不是"已禁用"状态，则禁用
            if (!"已禁用".equals(cardKey.getStatus())) {
                cardKey.setStatus("已禁用");
                cardKeyService.updateById(cardKey);
            }
        }
    }
}