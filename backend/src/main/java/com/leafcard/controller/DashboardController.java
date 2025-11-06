package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.entity.CardKey;
import com.leafcard.entity.Specification;
import com.leafcard.service.CardKeyService;
import com.leafcard.service.SpecificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
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
    private SpecificationService specificationService;

    /**
     * 获取仪表盘统计数据
     */
    @GetMapping("/stats")
    public Result<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            
            // 获取今天激活的卡密列表
            List<CardKey> todayActivatedCards = getTodayActivatedCardKeys();
            
            // 计算日销售数量（今天激活的卡密数量）
            int dailySales = todayActivatedCards.size();
            
            // 计算日收入（今天激活卡密的价格总和）
            double dailyRevenue = calculateTodayRevenue(todayActivatedCards);
            
            // 计算昨日数据用于比较
            Map<String, Object> yesterdayStats = getYesterdayStats();
            int yesterdaySales = (int) yesterdayStats.get("sales");
            double yesterdayRevenue = (double) yesterdayStats.get("revenue");
            
            // 计算变化百分比
            double dailySalesChange = calculatePercentageChange(dailySales, yesterdaySales);
            double dailyRevenueChange = calculatePercentageChange(dailyRevenue, yesterdayRevenue);
            
            stats.put("dailySales", dailySales);
            stats.put("dailyRevenue", dailyRevenue);
            stats.put("dailySalesChange", Math.round(dailySalesChange * 100.0) / 100.0);
            stats.put("dailyRevenueChange", Math.round(dailyRevenueChange * 100.0) / 100.0);
            
            // 其他统计数据 - 从数据库查询真实数据
            List<CardKey> allCardKeys = cardKeyService.list();
            List<Specification> allSpecifications = specificationService.list();
            
            stats.put("totalOrders", allCardKeys.size());  // 卡密总数
            stats.put("totalRevenue", calculateTotalRevenue(allCardKeys));  // 总收入
            stats.put("activeUsers", allSpecifications.size());  // 商品总数
            stats.put("conversionRate", 0.0);  // 转化率暂时设为0
            
            return Result.success(stats);
        } catch (Exception e) {
            return Result.error("获取仪表盘数据失败");
        }
    }
    
    /**
     * 获取今天激活的卡密列表
     */
    private List<CardKey> getTodayActivatedCardKeys() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
        
        // 查询今天激活的卡密
        List<CardKey> allCards = cardKeyService.list();
        return allCards.stream()
                .filter(card -> card.getActivateTime() != null && 
                               card.getActivateTime().isAfter(startOfDay) && 
                               card.getActivateTime().isBefore(endOfDay))
                .collect(java.util.stream.Collectors.toList());
    }
    
    /**
     * 计算今天激活卡密的总收入
     */
    private double calculateTodayRevenue(List<CardKey> todayActivatedCards) {
        double totalRevenue = 0.0;
        
        for (CardKey card : todayActivatedCards) {
            if (card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null && spec.getPrice() != null) {
                    totalRevenue += spec.getPrice();
                }
            }
        }
        
        return totalRevenue;
    }
    
    /**
     * 获取昨日统计数据
     */
    private Map<String, Object> getYesterdayStats() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.plusDays(1).atStartOfDay();
        
        // 查询昨日激活的卡密
        List<CardKey> allCards = cardKeyService.list();
        List<CardKey> yesterdayActivatedCards = allCards.stream()
                .filter(card -> card.getActivateTime() != null && 
                               card.getActivateTime().isAfter(startOfYesterday) && 
                               card.getActivateTime().isBefore(endOfYesterday))
                .collect(java.util.stream.Collectors.toList());
        
        // 计算昨日销售数量和收入
        int yesterdaySales = yesterdayActivatedCards.size();
        double yesterdayRevenue = calculateTodayRevenue(yesterdayActivatedCards);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("sales", yesterdaySales);
        stats.put("revenue", yesterdayRevenue);
        
        return stats;
    }
    
    /**
     * 计算变化百分比
     */
    private double calculatePercentageChange(double current, double previous) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return ((current - previous) / previous) * 100.0;
    }
    
    /**
     * 计算所有已激活卡密的总收入
     */
    private double calculateTotalRevenue(List<CardKey> allCardKeys) {
        double totalRevenue = 0.0;
        
        for (CardKey card : allCardKeys) {
            // 只计算已激活的卡密
            if (card.getActivateTime() != null && card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null && spec.getPrice() != null) {
                    totalRevenue += spec.getPrice();
                }
            }
        }
        
        return totalRevenue;
    }
}