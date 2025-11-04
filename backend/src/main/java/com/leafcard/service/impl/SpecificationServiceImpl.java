package com.leafcard.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leafcard.entity.Specification;
import com.leafcard.mapper.SpecificationMapper;
import com.leafcard.service.SpecificationService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 规格服务实现类
 */
@Service
public class SpecificationServiceImpl extends ServiceImpl<SpecificationMapper, Specification> implements SpecificationService {

    @Override
    public List<Specification> findByProductId(Long productId) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("product_id", productId);
        return this.list(queryWrapper);
    }

    @Override
    public List<Specification> findByStatus(Integer status) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", status);
        return this.list(queryWrapper);
    }

    @Override
    public List<Specification> findByProductIdAndStatus(Long productId, Integer status) {
        QueryWrapper<Specification> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("product_id", productId);
        queryWrapper.eq("status", status);
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
        queryWrapper.eq("status", 1);
        long activeCount = this.count(queryWrapper);
        statistics.put("activeCount", activeCount);
        
        queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("status", 0);
        long inactiveCount = this.count(queryWrapper);
        statistics.put("inactiveCount", inactiveCount);
        
        return statistics;
    }
}