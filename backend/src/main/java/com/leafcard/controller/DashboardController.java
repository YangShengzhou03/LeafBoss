package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.service.CardKeyService;
import com.leafcard.service.ProductService;
import com.leafcard.service.SpecificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 仪表盘控制器
 */
@RestController
@RequestMapping("/api/admin")
public class DashboardController {

    @Autowired
    private CardKeyService cardKeyService;

    @Autowired
    private ProductService productService;

    @Autowired
    private SpecificationService specificationService;

    /**
     * 获取仪表盘统计数据
     */
    @GetMapping("/dashboard")
    public Result<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // 获取卡密统计数据
            long cardKeyCount = cardKeyService.count();
            long unusedCardKeys = cardKeyService.countUnusedCardKeys();
            long usedCardKeys = cardKeyService.countUsedCardKeys();
            
            // 获取商品统计数据
            long productCount = productService.count();
            
            // 获取规格统计数据
            long specificationCount = specificationService.count();
            
            // 模拟销售数据（实际项目中应该从订单服务获取）
            int dailySales = (int) (Math.random() * 100) + 10; // 10-110之间的随机数
            double dailyRevenue = dailySales * 9.9; // 假设每个商品9.9元
            
            // 模拟增长率（实际项目中应该计算真实增长率）
            double cardKeyGrowth = Math.random() * 20; // 0-20%的随机增长率
            double productGrowth = Math.random() * 15; // 0-15%的随机增长率
            double dailySalesGrowth = Math.random() * 25; // 0-25%的随机增长率
            double dailyGrowth = Math.random() * 30; // 0-30%的随机增长率
            
            // 构建统计数据
            stats.put("cardKeyCount", cardKeyCount);
            stats.put("productCount", productCount);
            stats.put("dailySales", dailySales);
            stats.put("dailyRevenue", dailyRevenue);
            stats.put("cardKeyGrowth", Math.round(cardKeyGrowth * 100.0) / 100.0);
            stats.put("productGrowth", Math.round(productGrowth * 100.0) / 100.0);
            stats.put("dailySalesGrowth", Math.round(dailySalesGrowth * 100.0) / 100.0);
            stats.put("dailyGrowth", Math.round(dailyGrowth * 100.0) / 100.0);
            
            // 添加详细统计数据
            stats.put("unusedCardKeys", unusedCardKeys);
            stats.put("usedCardKeys", usedCardKeys);
            stats.put("specificationCount", specificationCount);
            
            return Result.success("仪表盘数据获取成功", stats);
        } catch (Exception e) {
            return Result.error("获取仪表盘数据失败: " + e.getMessage());
        }
    }
}