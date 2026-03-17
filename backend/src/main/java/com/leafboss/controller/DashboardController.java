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

@RestController
@RequestMapping("/api/admin")
public class DashboardController {

    @Autowired
    private CardKeyService cardKeyService;

    @Autowired
    private SpecificationService specificationService;

    @GetMapping("/stats")
    public Result<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();
            
            int dailySales = getActivatedCount(startOfDay, endOfDay);
            double dailyRevenue = getActivatedRevenue(startOfDay, endOfDay);

            LocalDate yesterday = today.minusDays(1);
            LocalDateTime startOfYesterday = yesterday.atStartOfDay();
            LocalDateTime endOfYesterday = today.atStartOfDay();
            
            int yesterdaySales = getActivatedCount(startOfYesterday, endOfYesterday);
            double yesterdayRevenue = getActivatedRevenue(startOfYesterday, endOfYesterday);

            stats.put("dailySales", dailySales);
            stats.put("dailyRevenue", Math.round(dailyRevenue * 100.0) / 100.0);
            stats.put("yesterdaySales", yesterdaySales);
            stats.put("yesterdayRevenue", Math.round(yesterdayRevenue * 100.0) / 100.0);

            long totalOrders = cardKeyService.count();
            double totalRevenue = getActivatedRevenue(null, null);

            LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
            LocalDateTime endOfMonth = today.plusMonths(1).withDayOfMonth(1).atStartOfDay();
            double monthlyRevenue = getActivatedRevenue(startOfMonth, endOfMonth);

            LocalDateTime startOfLastMonth = today.minusMonths(1).withDayOfMonth(1).atStartOfDay();
            LocalDateTime endOfLastMonth = today.withDayOfMonth(1).atStartOfDay();
            double lastMonthRevenue = getActivatedRevenue(startOfLastMonth, endOfLastMonth);

            stats.put("totalOrders", (int)totalOrders);
            stats.put("totalRevenue", Math.round(totalRevenue * 100.0) / 100.0);
            stats.put("monthlyRevenue", Math.round(monthlyRevenue * 100.0) / 100.0);
            stats.put("lastMonthRevenue", Math.round(lastMonthRevenue * 100.0) / 100.0);
            stats.put("conversionRate", 0.0);

            return Result.success(stats);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取仪表盘数据失败");
        }
    }

    private int getActivatedCount(LocalDateTime start, LocalDateTime end) {
        com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<CardKey> queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<>();
        if (start != null) queryWrapper.ge("activate_time", start);
        if (end != null) queryWrapper.lt("activate_time", end);
        return (int) cardKeyService.count(queryWrapper);
    }

    private double getActivatedRevenue(LocalDateTime start, LocalDateTime end) {
        com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<CardKey> queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<>();
        if (start != null) queryWrapper.ge("activate_time", start);
        if (end != null) queryWrapper.lt("activate_time", end);
        queryWrapper.isNotNull("specification_id");
        
        List<CardKey> activatedCards = cardKeyService.list(queryWrapper);
        if (activatedCards.isEmpty()) return 0.0;

        List<Integer> specIds = activatedCards.stream()
                .map(CardKey::getSpecificationId)
                .distinct()
                .collect(java.util.stream.Collectors.toList());
        
        Map<Integer, Specification> specMap = specificationService.listByIds(specIds).stream()
                .collect(java.util.stream.Collectors.toMap(Specification::getId, spec -> spec));

        double revenue = 0.0;
        for (CardKey card : activatedCards) {
            Specification spec = specMap.get(card.getSpecificationId());
            if (spec != null && spec.getPrice() != null) {
                revenue += spec.getPrice();
            }
        }
        return revenue;
    }

    @GetMapping("/today-sales-distribution")
    public Result<List<Map<String, Object>>> getTodaySalesDistribution() {
        try {
            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

            com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<CardKey> queryWrapper = new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<>();
            queryWrapper.ge("activate_time", startOfDay);
            queryWrapper.lt("activate_time", endOfDay);
            queryWrapper.isNotNull("specification_id");
            
            List<CardKey> todayActivatedCards = cardKeyService.list(queryWrapper);
            if (todayActivatedCards.isEmpty()) return Result.success(new java.util.ArrayList<>());

            Map<Integer, Integer> specCountMap = new HashMap<>();
            for (CardKey card : todayActivatedCards) {
                specCountMap.put(card.getSpecificationId(), specCountMap.getOrDefault(card.getSpecificationId(), 0) + 1);
            }
            
            List<Integer> specIds = new java.util.ArrayList<>(specCountMap.keySet());
            List<Specification> specs = specificationService.listByIds(specIds);
            
            List<Map<String, Object>> distribution = new java.util.ArrayList<>();
            for (Specification spec : specs) {
                Map<String, Object> item = new HashMap<>();
                item.put("name", spec.getName());
                item.put("count", specCountMap.get(spec.getId()));
                distribution.add(item);
            }
            
            return Result.success(distribution);
        } catch (Exception e) {
            return Result.error("获取当日售出分布失败");
        }
    }
}