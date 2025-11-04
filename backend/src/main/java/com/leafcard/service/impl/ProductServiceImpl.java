package com.leafcard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafcard.entity.Product;
import com.leafcard.entity.Specification;
import com.leafcard.mapper.ProductMapper;
import com.leafcard.mapper.SpecificationMapper;
import com.leafcard.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}