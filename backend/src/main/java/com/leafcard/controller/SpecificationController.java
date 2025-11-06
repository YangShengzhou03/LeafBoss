package com.leafcard.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.common.Result;
import com.leafcard.dto.SpecificationDTO;
import com.leafcard.entity.Specification;
import com.leafcard.entity.Product;
import com.leafcard.service.SpecificationService;
import com.leafcard.service.ProductService;
import com.leafcard.utils.LogUtil;
import jakarta.servlet.http.HttpServletRequest;
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

    @Autowired
    private ProductService productService;

    @Autowired
    private LogUtil logUtil;

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
        Specification specification = specificationService.getById(Integer.parseInt(id));
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
    public Result<Boolean> createSpecification(@RequestBody Specification specification, HttpServletRequest request) {
        if (specificationService.findByName(specification.getName()) != null) {
            return Result.error("规格名称已存在");
        }
        
        if (specification.getStatus() == null || specification.getStatus().trim().isEmpty()) {
            specification.setStatus("active");
        }
        
        boolean saved = specificationService.save(specification);
        
        if (saved) {
            String productName = "未知商品";
            if (specification.getProductId() != null) {
                Product product = productService.getById(specification.getProductId());
                if (product != null) {
                    productName = product.getName();
                }
            }
            
            logUtil.logSpecificationOperation("SPECIFICATION", "创建规格: " + productName + "-" + specification.getName(), request);
            
            return Result.success("规格创建成功", true);
        } else {
            return Result.error("规格创建失败");
        }
    }

    /**
     * 更新规格
     */
    @PutMapping("/{id}")
    public Result<Boolean> updateSpecification(@PathVariable String id, @RequestBody Specification specification, HttpServletRequest request) {
        Specification existingSpecification = specificationService.getById(Integer.parseInt(id));
        if (existingSpecification == null) {
            return Result.error("规格不存在");
        }
        
        Specification specWithSameName = specificationService.findByName(specification.getName());
        if (specWithSameName != null && !specWithSameName.getId().equals(Integer.parseInt(id))) {
            return Result.error("规格名称已存在");
        }
        
        specification.setId(Integer.parseInt(id));
        boolean updated = specificationService.updateById(specification);
        
        if (updated) {
            String productName = "未知商品";
            if (specification.getProductId() != null) {
                Product product = productService.getById(specification.getProductId());
                if (product != null) {
                    productName = product.getName();
                }
            }
            
            logUtil.logSpecificationOperation("SPECIFICATION", "更新规格: " + productName + "-" + specification.getName(), request);
            
            return Result.success("规格更新成功", true);
        } else {
            return Result.error("规格更新失败");
        }
    }

    /**
     * 删除规格
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteSpecification(@PathVariable String id, HttpServletRequest request) {
        Specification specification = specificationService.getById(Integer.parseInt(id));
        if (specification == null) {
            return Result.error("规格不存在");
        }
        
        boolean deleted = specificationService.removeById(Integer.parseInt(id));
        
        if (deleted) {
            String productName = "未知商品";
            if (specification.getProductId() != null) {
                Product product = productService.getById(specification.getProductId());
                if (product != null) {
                    productName = product.getName();
                }
            }
            
            logUtil.logSpecificationOperation("SPECIFICATION", "删除规格: " + productName + "-" + specification.getName(), request);
            
            return Result.success("规格删除成功", true);
        } else {
            return Result.error("规格删除失败");
        }
    }

    /**
     * 获取规格统计信息
     */
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        Object statistics = specificationService.getSpecificationStatistics();
        return Result.success(statistics);
    }

    /**
     * 获取规格DTO列表（包含卡密统计信息）
     */
    @GetMapping("/dto")
    public Result<List<SpecificationDTO>> getSpecificationDTOs() {
        List<SpecificationDTO> specificationDTOs = specificationService.getSpecificationDTOs();
        return Result.success(specificationDTOs);
    }
}