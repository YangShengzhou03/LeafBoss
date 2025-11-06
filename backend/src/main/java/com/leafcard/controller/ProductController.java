package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.common.Result;
import com.leafcard.entity.Product;
import com.leafcard.service.ProductService;
import com.leafcard.utils.LogUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 产品控制器
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private LogUtil logUtil;

    /**
     * 获取产品列表（分页）
     */
    @GetMapping
    public Result<IPage<Product>> getProducts(
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
        return Result.success(productPage);
    }

    /**
     * 根据ID获取产品
     */
    @GetMapping("/{id}")
    public Result<Product> getProduct(@PathVariable String id) {
        Product product = productService.getById(Integer.parseInt(id));
        
        if (product != null) {
            return Result.success(product);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 创建产品
     */
    @PostMapping
    public Result<Boolean> createProduct(@RequestBody Product product, HttpServletRequest request) {
        if (productService.findByName(product.getName()) != null) {
            return Result.error("产品名称已存在");
        }
        
        if (product.getStatus() == null || product.getStatus().trim().isEmpty()) {
            product.setStatus("active");
        }
        
        boolean saved = productService.save(product);
        
        if (saved) {
            logUtil.logProductOperation("PRODUCT", "创建产品: " + product.getName(), request);
            
            return Result.success("产品创建成功", true);
        } else {
            return Result.error("产品创建失败");
        }
    }

    /**
     * 更新产品
     */
    @PutMapping("/{id}")
    public Result<Boolean> updateProduct(@PathVariable String id, @RequestBody Product product, HttpServletRequest request) {
        Product existingProduct = productService.getById(Integer.parseInt(id));
        if (existingProduct == null) {
            return Result.error("产品不存在");
        }
        
        Product productWithSameName = productService.findByName(product.getName());
        if (productWithSameName != null && !productWithSameName.getId().equals(Integer.parseInt(id))) {
            return Result.error("产品名称已存在");
        }
        
        product.setId(Integer.parseInt(id));
        boolean updated = productService.updateById(product);
        
        if (updated) {
            logUtil.logProductOperation("PRODUCT", "更新产品: " + product.getName(), request);
            
            return Result.success("产品更新成功", true);
        } else {
            return Result.error("产品更新失败");
        }
    }

    /**
     * 删除产品
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteProduct(@PathVariable String id, HttpServletRequest request) {
        Product product = productService.getById(Integer.parseInt(id));
        if (product == null) {
            return Result.error("产品不存在");
        }
        
        boolean deleted = productService.removeById(Integer.parseInt(id));
        
        if (deleted) {
            logUtil.logProductOperation("PRODUCT", "删除产品: " + product.getName(), request);
            
            return Result.success("产品删除成功", true);
        } else {
            return Result.error("产品删除失败");
        }
    }

    /**
     * 获取产品统计信息
     */
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        Object statistics = productService.getProductStatistics();
        return Result.success(statistics);
    }

    /**
     * 根据分类获取产品
     */
    @GetMapping("/category/{category}")
    public Result<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.findByCategory(category);
        return Result.success(products);
    }
}