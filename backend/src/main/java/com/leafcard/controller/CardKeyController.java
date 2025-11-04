package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.entity.CardKey;
import com.leafcard.service.CardKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 卡密控制器
 */
@RestController
@RequestMapping("/api/card-keys")
public class CardKeyController {

    @Autowired
    private CardKeyService cardKeyService;

    /**
     * 获取卡密列表（分页）
     */
    @GetMapping
    public Map<String, Object> getCardKeys(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        
        Page<CardKey> pageParam = new Page<>(page, size);
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
        
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        
        IPage<CardKey> cardKeyPage = cardKeyService.page(pageParam, queryWrapper);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("data", cardKeyPage.getRecords());
        result.put("total", cardKeyPage.getTotal());
        result.put("current", cardKeyPage.getCurrent());
        result.put("size", cardKeyPage.getSize());
        
        return result;
    }

    /**
     * 根据卡密查询
     */
    @GetMapping("/search")
    public Map<String, Object> searchCardKey(@RequestParam String cardKey) {
        Map<String, Object> result = new HashMap<>();
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            result.put("success", true);
            result.put("card", card);
        } else {
            result.put("success", false);
            result.put("message", "卡密不存在");
        }
        
        return result;
    }

    /**
     * 激活卡密
     */
    @PostMapping("/{cardKey}/activate")
    public Map<String, Object> activateCard(
            @PathVariable String cardKey,
            @RequestBody Map<String, String> request) {
        
        String userId = request.get("userId");
        String userEmail = request.get("userEmail");
        
        Map<String, Object> result = new HashMap<>();
        boolean success = cardKeyService.activateCard(cardKey, userId, userEmail);
        
        if (success) {
            result.put("success", true);
            result.put("message", "卡密激活成功");
        } else {
            result.put("success", false);
            result.put("message", "卡密激活失败，请检查卡密状态");
        }
        
        return result;
    }

    /**
     * 禁用卡密
     */
    @PostMapping("/{cardKey}/disable")
    public Map<String, Object> disableCard(@PathVariable String cardKey) {
        Map<String, Object> result = new HashMap<>();
        boolean success = cardKeyService.disableCard(cardKey);
        
        if (success) {
            result.put("success", true);
            result.put("message", "卡密禁用成功");
        } else {
            result.put("success", false);
            result.put("message", "卡密禁用失败");
        }
        
        return result;
    }

    /**
     * 获取卡密统计信息
     */
    @GetMapping("/statistics")
    public Map<String, Object> getStatistics() {
        Map<String, Object> result = new HashMap<>();
        Object statistics = cardKeyService.getCardStatistics();
        
        result.put("success", true);
        result.put("statistics", statistics);
        
        return result;
    }

    /**
     * 创建卡密
     */
    @PostMapping
    public Map<String, Object> createCardKey(@RequestBody CardKey cardKey) {
        Map<String, Object> result = new HashMap<>();
        boolean saved = cardKeyService.save(cardKey);
        
        if (saved) {
            result.put("success", true);
            result.put("message", "卡密创建成功");
        } else {
            result.put("success", false);
            result.put("message", "卡密创建失败");
        }
        
        return result;
    }
}