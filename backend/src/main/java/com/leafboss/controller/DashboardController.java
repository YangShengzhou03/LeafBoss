package com.leafboss.controller;

import com.leafboss.common.Result;
import com.leafboss.entity.CardKey;
import com.leafboss.entity.Specification;
import com.leafboss.service.CardKeyService;
import com.leafboss.service.SpecificationService;
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
            
            // 计算昨日数据
            Map<String, Object> yesterdayStats = getYesterdayStats();
            int yesterdaySales = (int) yesterdayStats.get("sales");
            double yesterdayRevenue = (double) yesterdayStats.get("revenue");
            
            stats.put("dailySales", dailySales);
            stats.put("dailyRevenue", Math.round(dailyRevenue * 100.0) / 100.0);
            stats.put("yesterdaySales", yesterdaySales);
            stats.put("yesterdayRevenue", Math.round(yesterdayRevenue * 100.0) / 100.0);
            
            // 其他统计数据 - 从数据库查询真实数据
            List<CardKey> allCardKeys = cardKeyService.list();
            List<Specification> allSpecifications = specificationService.list();
            
            // 计算月收入（本月激活卡密的总收入）
            double monthlyRevenue = calculateMonthlyRevenue();
            
            // 计算上月收入
            double lastMonthRevenue = calculateLastMonthRevenue();
            
            stats.put("totalOrders", allCardKeys.size());
            stats.put("totalRevenue", Math.round(calculateTotalRevenue(allCardKeys) * 100.0) / 100.0);
            stats.put("monthlyRevenue", Math.round(monthlyRevenue * 100.0) / 100.0);
            stats.put("lastMonthRevenue", Math.round(lastMonthRevenue * 100.0) / 100.0);
            stats.put("conversionRate", 0.0);
            
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
    
    /**
     * 计算月收入（本月激活卡密的总收入）
     */
    private double calculateMonthlyRevenue() {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now.plusMonths(1).withDayOfMonth(1).atStartOfDay();
        
        // 查询本月激活的卡密
        List<CardKey> allCards = cardKeyService.list();
        List<CardKey> monthlyActivatedCards = allCards.stream()
                .filter(card -> card.getActivateTime() != null && 
                               card.getActivateTime().isAfter(startOfMonth) && 
                               card.getActivateTime().isBefore(endOfMonth))
                .collect(java.util.stream.Collectors.toList());
        
        // 计算本月收入
        double monthlyRevenue = 0.0;
        for (CardKey card : monthlyActivatedCards) {
            if (card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null && spec.getPrice() != null) {
                    monthlyRevenue += spec.getPrice();
                }
            }
        }
        
        return monthlyRevenue;
    }
    
    /**
     * 计算上月收入
     */
    private double calculateLastMonthRevenue() {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfLastMonth = now.minusMonths(1).withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfLastMonth = now.withDayOfMonth(1).atStartOfDay();
        
        // 查询上月激活的卡密
        List<CardKey> allCards = cardKeyService.list();
        List<CardKey> lastMonthActivatedCards = allCards.stream()
                .filter(card -> card.getActivateTime() != null && 
                               card.getActivateTime().isAfter(startOfLastMonth) && 
                               card.getActivateTime().isBefore(endOfLastMonth))
                .collect(java.util.stream.Collectors.toList());
        
        // 计算上月收入
        double lastMonthRevenue = 0.0;
        for (CardKey card : lastMonthActivatedCards) {
            if (card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null && spec.getPrice() != null) {
                    lastMonthRevenue += spec.getPrice();
                }
            }
        }
        
        return lastMonthRevenue;
    }
}