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

            List<CardKey> todayActivatedCards = getTodayActivatedCardKeys();

            int dailySales = todayActivatedCards.size();

            double dailyRevenue = calculateTodayRevenue(todayActivatedCards);

            Map<String, Object> yesterdayStats = getYesterdayStats();
            int yesterdaySales = (int) yesterdayStats.get("sales");
            double yesterdayRevenue = (double) yesterdayStats.get("revenue");

            stats.put("dailySales", dailySales);
            stats.put("dailyRevenue", Math.round(dailyRevenue * 100.0) / 100.0);
            stats.put("yesterdaySales", yesterdaySales);
            stats.put("yesterdayRevenue", Math.round(yesterdayRevenue * 100.0) / 100.0);

            List<CardKey> allCardKeys = cardKeyService.list();
            List<Specification> allSpecifications = specificationService.list();

            double monthlyRevenue = calculateMonthlyRevenue();

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

    private List<CardKey> getTodayActivatedCardKeys() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        List<CardKey> allCards = cardKeyService.list();
        return allCards.stream()
                .filter(card -> card.getActivateTime() != null &&
                               card.getActivateTime().isAfter(startOfDay) &&
                               card.getActivateTime().isBefore(endOfDay))
                .collect(java.util.stream.Collectors.toList());
    }

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

    private Map<String, Object> getYesterdayStats() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.plusDays(1).atStartOfDay();

        List<CardKey> allCards = cardKeyService.list();
        List<CardKey> yesterdayActivatedCards = allCards.stream()
                .filter(card -> card.getActivateTime() != null &&
                               card.getActivateTime().isAfter(startOfYesterday) &&
                               card.getActivateTime().isBefore(endOfYesterday))
                .collect(java.util.stream.Collectors.toList());

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
            if (card.getActivateTime() != null && card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null && spec.getPrice() != null) {
                    totalRevenue += spec.getPrice();
                }
            }
        }

        return totalRevenue;
    }

    private double calculateMonthlyRevenue() {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = now.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        List<CardKey> allCards = cardKeyService.list();
        List<CardKey> monthlyActivatedCards = allCards.stream()
                .filter(card -> card.getActivateTime() != null &&
                               card.getActivateTime().isAfter(startOfMonth) &&
                               card.getActivateTime().isBefore(endOfMonth))
                .collect(java.util.stream.Collectors.toList());

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

    private double calculateLastMonthRevenue() {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfLastMonth = now.minusMonths(1).withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfLastMonth = now.withDayOfMonth(1).atStartOfDay();

        List<CardKey> allCards = cardKeyService.list();
        List<CardKey> lastMonthActivatedCards = allCards.stream()
                .filter(card -> card.getActivateTime() != null &&
                               card.getActivateTime().isAfter(startOfLastMonth) &&
                               card.getActivateTime().isBefore(endOfLastMonth))
                .collect(java.util.stream.Collectors.toList());

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