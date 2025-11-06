package com.leafcard.controller;

import com.leafcard.common.Result;
import com.leafcard.entity.CardKey;
import com.leafcard.entity.Specification;
import com.leafcard.entity.Product;
import com.leafcard.service.CardKeyService;
import com.leafcard.service.SpecificationService;
import com.leafcard.service.ProductService;
import com.leafcard.service.OperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

/**
 * 对外卡密验证控制器
 * 无需token即可访问，用于应用程序安装时验证安装卡密
 */
@RestController
@RequestMapping("/api/public/card-keys")
public class PublicCardKeyController {

    @Autowired
    private CardKeyService cardKeyService;
    
    @Autowired
    private SpecificationService specificationService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private OperationLogService operationLogService;

    @GetMapping("/verify/{cardKey}")
    public Result<String> verifyAndActivateInstallationKey(@PathVariable String cardKey, HttpServletRequest request) {
        try {
            CardKey card = cardKeyService.findByCardKey(cardKey);
            
            if (card == null) {
                operationLogService.logOperation("CARD_KEY", "公共接口验证失败 - 卡密不存在: " + cardKey, getClientIpAddress(request));
                return Result.error(404, "卡密不存在，请检查卡密是否正确或获取有效卡密");
            }
            
            String status = card.getStatus();
            
            switch (status) {
                case "未使用":
                    boolean activated = cardKeyService.activateCard(cardKey, "system", "system@leafcard.com");
                    if (!activated) {
                        operationLogService.logOperation("CARD_KEY", "验证安装卡密失败 - 激活失败: " + cardKey, getClientIpAddress(request));
                        return Result.error(500, "卡密验证成功但使用失败，请联系开发者处理");
                    }
                    
                    Specification spec = specificationService.getById(card.getSpecificationId());
                    if (spec != null) {
                        Product product = productService.getById(spec.getProductId());
                        if (product != null) {
                            String productSpecInfo = product.getName() + "-" + spec.getName();
                            operationLogService.logOperation("CARD_KEY", "验证安装卡密成功 - 卡密: " + cardKey + ", 商品规格: " + productSpecInfo, getClientIpAddress(request));
                            return Result.success(productSpecInfo);
                        } else {
                            operationLogService.logOperation("CARD_KEY", "验证安装卡密成功但商品不存在 - 卡密: " + cardKey + ", 规格ID: " + spec.getId(), getClientIpAddress(request));
                            return Result.success("未知商品-" + spec.getName());
                        }
                    } else {
                        operationLogService.logOperation("CARD_KEY", "验证安装卡密成功但规格不存在 - 卡密: " + cardKey + ", 规格ID: " + card.getSpecificationId(), getClientIpAddress(request));
                        return Result.success("未知商品规格");
                    }
                    
                case "已使用":
                    operationLogService.logOperation("CARD_KEY", "验证安装卡密失败 - 卡密已被使用: " + cardKey, getClientIpAddress(request));
                    return Result.error(400, "该卡密已被使用，请确认是否已在其他设备使用");
                    
                case "已禁用":
                    operationLogService.logOperation("CARD_KEY", "验证安装卡密失败 - 卡密被禁用: " + cardKey, getClientIpAddress(request));
                    return Result.error(400, "该卡密已被禁用，请联系开发者了解原因");
                    
                default:
                    operationLogService.logOperation("CARD_KEY", "验证安装卡密失败 - 卡密状态异常: " + cardKey + ", 状态: " + status, getClientIpAddress(request));
                    return Result.error(400, "卡密状态异常，请联系开发者处理");
            }
            
        } catch (Exception e) {
            operationLogService.logOperation("CARD_KEY", "验证安装卡密过程中发生系统异常: " + cardKey + ", 错误: " + e.getMessage(), getClientIpAddress(request));
            return Result.error(500, "验证过程中发生系统错误，请稍后重试");
        }
    }
    
    /**
     * 获取客户端IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // 对于多个IP的情况，取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        return ip;
    }
}