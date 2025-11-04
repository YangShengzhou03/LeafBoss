package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.entity.Specification;
import com.leafcard.service.SpecificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 规格控制器
 */
@RestController
@RequestMapping("/api/specifications")
public class SpecificationController {

    @Autowired
    private SpecificationService specificationService;

    /**
     * 分页查询规格列表
     */
    @GetMapping
    public Page<Specification> getSpecifications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Specification> pageInfo = new Page<>(page, size);
        return specificationService.page(pageInfo);
    }

    /**
     * 根据ID查询规格
     */
    @GetMapping("/{id}")
    public Specification getSpecification(@PathVariable Long id) {
        return specificationService.getById(id);
    }

    /**
     * 根据产品ID查询规格列表
     */
    @GetMapping("/product/{productId}")
    public List<Specification> getSpecificationsByProduct(@PathVariable Long productId) {
        return specificationService.findByProductId(productId);
    }

    /**
     * 根据状态查询规格列表
     */
    @GetMapping("/status/{status}")
    public List<Specification> getSpecificationsByStatus(@PathVariable Integer status) {
        return specificationService.findByStatus(status);
    }

    /**
     * 创建规格
     */
    @PostMapping
    public boolean createSpecification(@RequestBody Specification specification) {
        return specificationService.save(specification);
    }

    /**
     * 更新规格
     */
    @PutMapping("/{id}")
    public boolean updateSpecification(@PathVariable Long id, @RequestBody Specification specification) {
        specification.setId(id);
        return specificationService.updateById(specification);
    }

    /**
     * 删除规格
     */
    @DeleteMapping("/{id}")
    public boolean deleteSpecification(@PathVariable Long id) {
        return specificationService.removeById(id);
    }

    /**
     * 获取规格统计信息
     */
    @GetMapping("/statistics")
    public Object getStatistics() {
        return specificationService.getSpecificationStatistics();
    }
}