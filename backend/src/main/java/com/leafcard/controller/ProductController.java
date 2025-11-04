package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.entity.Product;
import com.leafcard.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 产品控制器
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    /**
     * 获取产品列表（分页）
     */
    @GetMapping
    public Map<String, Object> getProducts(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        
        Page<Product> pageParam = new Page<>(page, size);
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        
        if (category != null && !category.isEmpty()) {
            queryWrapper.eq("category", category);
        }
        
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        
        IPage<Product> productPage = productService.page(pageParam, queryWrapper);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", productPage.getRecords());
        result.put("total", productPage.getTotal());
        result.put("current", productPage.getCurrent());
        result.put("size", productPage.getSize());
        
        return result;
    }

    /**
     * 根据ID获取产品
     */
    @GetMapping("/{id}")
    public Map<String, Object> getProduct(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        Product product = productService.getById(id);
        
        if (product != null) {
            result.put("success", true);
            result.put("product", product);
        } else {
            result.put("success", false);
            result.put("message", "产品不存在");
        }
        
        return result;
    }

    /**
     * 创建产品
     */
    @PostMapping
    public Map<String, Object> createProduct(@RequestBody Product product) {
        Map<String, Object> result = new HashMap<>();
        boolean saved = productService.save(product);
        
        if (saved) {
            result.put("success", true);
            result.put("message", "产品创建成功");
        } else {
            result.put("success", false);
            result.put("message", "产品创建失败");
        }
        
        return result;
    }

    /**
     * 更新产品
     */
    @PutMapping("/{id}")
    public Map<String, Object> updateProduct(@PathVariable String id, @RequestBody Product product) {
        Map<String, Object> result = new HashMap<>();
        product.setId(id);
        boolean updated = productService.updateById(product);
        
        if (updated) {
            result.put("success", true);
            result.put("message", "产品更新成功");
        } else {
            result.put("success", false);
            result.put("message", "产品更新失败");
        }
        
        return result;
    }

    /**
     * 删除产品
     */
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteProduct(@PathVariable String id) {
        Map<String, Object> result = new HashMap<>();
        boolean deleted = productService.removeById(id);
        
        if (deleted) {
            result.put("success", true);
            result.put("message", "产品删除成功");
        } else {
            result.put("success", false);
            result.put("message", "产品删除失败");
        }
        
        return result;
    }

    /**
     * 获取产品统计信息
     */
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> result = new HashMap<>();
        Object statistics = productService.getProductStatistics();
        
        result.put("success", true);
        result.put("statistics", statistics);
        
        return result;
    }

    /**
     * 根据分类获取产品
     */
    @GetMapping("/category/{category}")
    public Map<String, Object> getProductsByCategory(@PathVariable String category) {
        Map<String, Object> result = new HashMap<>();
        List<Product> products = productService.findByCategory(category);
        
        result.put("success", true);
        result.put("data", products);
        
        return result;
    }
}