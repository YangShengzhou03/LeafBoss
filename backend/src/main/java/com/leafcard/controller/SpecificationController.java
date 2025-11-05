package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.common.Result;
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
    public Result<IPage<Specification>> getSpecifications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Specification> pageInfo = new Page<>(page, size);
        IPage<Specification> result = specificationService.page(pageInfo);
        return Result.success(result);
    }

    /**
     * 根据ID查询规格
     */
    @GetMapping("/{id}")
    public Result<Specification> getSpecification(@PathVariable String id) {
        Specification specification = specificationService.getById(id);
        if (specification == null) {
            return Result.notFound();
        }
        return Result.success(specification);
    }

    /**
     * 根据产品ID查询规格列表
     */
    @GetMapping("/product/{productId}")
    public Result<List<Specification>> getSpecificationsByProduct(@PathVariable Long productId) {
        List<Specification> specifications = specificationService.findByProductId(productId);
        return Result.success(specifications);
    }

    /**
     * 根据状态查询规格列表
     */
    @GetMapping("/status/{status}")
    public Result<List<Specification>> getSpecificationsByStatus(@PathVariable Integer status) {
        List<Specification> specifications = specificationService.findByStatus(status);
        return Result.success(specifications);
    }

    /**
     * 创建规格
     */
    @PostMapping
    public Result<Boolean> createSpecification(@RequestBody Specification specification) {
        boolean result = specificationService.save(specification);
        return result ? Result.success("规格创建成功", true) : Result.error("规格创建失败");
    }

    /**
     * 更新规格
     */
    @PutMapping("/{id}")
    public Result<Boolean> updateSpecification(@PathVariable String id, @RequestBody Specification specification) {
        specification.setId(id);
        boolean result = specificationService.updateById(specification);
        return result ? Result.success("规格更新成功", true) : Result.error("规格更新失败");
    }

    /**
     * 删除规格
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteSpecification(@PathVariable String id) {
        boolean result = specificationService.removeById(id);
        return result ? Result.success("规格删除成功", true) : Result.error("规格删除失败");
    }

    /**
     * 获取规格统计信息
     */
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        Object statistics = specificationService.getSpecificationStatistics();
        return Result.success(statistics);
    }
}