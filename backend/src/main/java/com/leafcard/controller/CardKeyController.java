package com.leafcard.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafcard.common.Result;
import com.leafcard.dto.CardKeyDTO;
import com.leafcard.entity.CardKey;
import com.leafcard.entity.Specification;
import com.leafcard.entity.Product;
import com.leafcard.service.CardKeyService;
import com.leafcard.service.SpecificationService;
import com.leafcard.service.ProductService;
import com.leafcard.utils.LogUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * 卡密控制器
 */
@RestController
@RequestMapping("/api/card-keys")
public class CardKeyController {

    @Autowired
    private CardKeyService cardKeyService;
    
    @Autowired
    private SpecificationService specificationService;
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private LogUtil logUtil;

    /**
     * 获取卡密列表（分页）
     */
    @GetMapping
    public Result<IPage<CardKey>> getCardKeys(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        
        Page<CardKey> pageParam = new Page<>(page, size);
        QueryWrapper<CardKey> queryWrapper = new QueryWrapper<>();
        
        if (status != null && !status.isEmpty()) {
            queryWrapper.eq("status", status);
        }
        
        IPage<CardKey> cardKeyPage = cardKeyService.page(pageParam, queryWrapper);
        return Result.success(cardKeyPage);
    }

    /**
     * 获取包含商品和规格名称的卡密列表
     */
    @GetMapping("/with-details")
    public Result<IPage<CardKeyDTO>> getCardKeysWithDetails(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long specificationId) {
        Page<CardKey> pageParam = new Page<>(page, size);
        IPage<CardKeyDTO> cardKeyPage = cardKeyService.getCardKeyListWithDetails(pageParam, keyword, specificationId);
        return Result.success(cardKeyPage);
    }

    /**
     * 根据卡密查询
     */
    @GetMapping("/search")
    public Result<CardKey> searchCardKey(@RequestParam String cardKey) {
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            return Result.success(card);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 验证卡密
     */
    @GetMapping("/verify/{cardKey}")
    public Result<Map<String, Object>> verifyCardKey(@PathVariable String cardKey) {
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", card.getId());
            response.put("cardKey", card.getCardKey());
            response.put("specificationId", card.getSpecificationId());
            response.put("status", card.getStatus());
            response.put("userEmail", card.getUserEmail());
            response.put("userId", card.getUserId());
            response.put("activateTime", card.getActivateTime());
            response.put("expireTime", card.getExpireTime());
            response.put("createdAt", card.getCreatedAt());
            response.put("updatedAt", card.getUpdatedAt());
            
            if (card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null) {
                    response.put("specificationName", spec.getName());
                    response.put("price", spec.getPrice());
                    response.put("durationDays", spec.getDurationDays());
                    
                    Product product = productService.getById(spec.getProductId());
                    if (product != null) {
                        response.put("productName", product.getName());
                        response.put("productSpec", product.getName() + "-" + spec.getName());
                    }
                }
            }
            
            return Result.success(response);
        } else {
            return Result.notFound();
        }
    }

    /**
     * 激活卡密
     */
    @PostMapping("/activate")
    public Result<Boolean> activateCardKey(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String cardKey = requestBody.get("cardKey");
        
        if (cardKey == null || cardKey.trim().isEmpty()) {
            return Result.error("卡密不能为空");
        }
        
        CardKey cardKeyEntity = cardKeyService.findByCardKey(cardKey);
        if (cardKeyEntity == null) {
            return Result.error("卡密不存在");
        }
        
        if ("已使用".equals(cardKeyEntity.getStatus())) {
            return Result.error("卡密已经是激活状态");
        }
        
        cardKeyEntity.setStatus("已使用");
        boolean updated = cardKeyService.updateById(cardKeyEntity);
        
        if (updated) {
            String productSpecName = "未知商品-未知规格";
            if (cardKeyEntity.getSpecificationId() != null) {
                Specification spec = specificationService.getById(cardKeyEntity.getSpecificationId());
                if (spec != null) {
                    String productName = "未知商品";
                    if (spec.getProductId() != null) {
                        Product product = productService.getById(spec.getProductId());
                        if (product != null) {
                            productName = product.getName();
                        }
                    }
                    productSpecName = productName + "-" + spec.getName();
                }
            }
            
            logUtil.logCardKeyOperation("CARD_KEY", "激活卡密: " + cardKeyEntity.getCardKey() + " - " + productSpecName, request);
            
            return Result.success("卡密激活成功", true);
        } else {
            return Result.error("卡密激活失败");
        }
    }

    /**
     * 禁用卡密
     */
    @PostMapping("/disable")
    public Result<Boolean> disableCardKey(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String cardKey = requestBody.get("cardKey");
        
        if (cardKey == null || cardKey.trim().isEmpty()) {
            return Result.error("卡密不能为空");
        }
        
        CardKey cardKeyEntity = cardKeyService.findByCardKey(cardKey);
        if (cardKeyEntity == null) {
            return Result.error("卡密不存在");
        }
        
        if ("已禁用".equals(cardKeyEntity.getStatus())) {
            return Result.error("卡密已经是禁用状态");
        }
        
        cardKeyEntity.setStatus("已禁用");
        boolean updated = cardKeyService.updateById(cardKeyEntity);
        
        if (updated) {
            String productSpecName = "未知商品-未知规格";
            if (cardKeyEntity.getSpecificationId() != null) {
                Specification spec = specificationService.getById(cardKeyEntity.getSpecificationId());
                if (spec != null) {
                    String productName = "未知商品";
                    if (spec.getProductId() != null) {
                        Product product = productService.getById(spec.getProductId());
                        if (product != null) {
                            productName = product.getName();
                        }
                    }
                    productSpecName = productName + "-" + spec.getName();
                }
            }
            
            logUtil.logCardKeyOperation("CARD_KEY", "禁用卡密: " + cardKeyEntity.getCardKey() + " - " + productSpecName, request);
            
            return Result.success("卡密禁用成功", true);
        } else {
            return Result.error("卡密禁用失败");
        }
    }

    /**
     * 删除卡密（通过ID）
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteCardKeyById(@PathVariable String id, HttpServletRequest request) {
        CardKey cardKey = cardKeyService.getById(Integer.parseInt(id));
        if (cardKey == null) {
            return Result.error("卡密不存在");
        }
        
        boolean deleted = cardKeyService.removeById(Integer.parseInt(id));
        
        if (deleted) {
            String productSpecName = "未知商品-未知规格";
            if (cardKey.getSpecificationId() != null) {
                Specification spec = specificationService.getById(cardKey.getSpecificationId());
                if (spec != null) {
                    String productName = "未知商品";
                    if (spec.getProductId() != null) {
                        Product product = productService.getById(spec.getProductId());
                        if (product != null) {
                            productName = product.getName();
                        }
                    }
                    productSpecName = productName + "-" + spec.getName();
                }
            }
            
            logUtil.logCardKeyOperation("CARD_KEY", "删除卡密: " + cardKey.getCardKey() + " - " + productSpecName, request);
            
            return Result.success("卡密删除成功", true);
        } else {
            return Result.error("卡密删除失败");
        }
    }

    /**
     * 删除卡密（通过卡密字符串）
     */
    @DeleteMapping("/by-card-key/{cardKey}")
    public Result<Boolean> deleteCardKey(@PathVariable String cardKey, HttpServletRequest request) {
        CardKey cardKeyEntity = cardKeyService.findByCardKey(cardKey);
        if (cardKeyEntity == null) {
            return Result.error("卡密不存在");
        }
        
        boolean deleted = cardKeyService.removeById(cardKeyEntity.getId());
        
        if (deleted) {
            String productSpecName = "未知商品-未知规格";
            if (cardKeyEntity.getSpecificationId() != null) {
                Specification spec = specificationService.getById(cardKeyEntity.getSpecificationId());
                if (spec != null) {
                    String productName = "未知商品";
                    if (spec.getProductId() != null) {
                        Product product = productService.getById(spec.getProductId());
                        if (product != null) {
                            productName = product.getName();
                        }
                    }
                    productSpecName = productName + "-" + spec.getName();
                }
            }
            
            logUtil.logCardKeyOperation("CARD_KEY", "删除卡密: " + cardKeyEntity.getCardKey() + " - " + productSpecName, request);
            
            return Result.success("卡密删除成功", true);
        } else {
            return Result.error("卡密删除失败");
        }
    }

    /**
     * 批量生成卡密
     */
    @PostMapping("/batch-generate")
    public Result<Boolean> batchGenerateCardKeys(@RequestBody Map<String, Object> requestBody, HttpServletRequest request) {
        String productId = (String) requestBody.get("productId");
        Integer quantity = (Integer) requestBody.get("quantity");
        String prefix = (String) requestBody.get("prefix");
        
        if (productId == null || productId.trim().isEmpty()) {
            return Result.error("产品ID不能为空");
        }
        
        if (quantity == null || quantity <= 0) {
            return Result.error("生成数量必须大于0");
        }
        
        if (quantity > 1000) {
            return Result.error("单次生成数量不能超过1000");
        }
        
        boolean success = cardKeyService.batchGenerateCardKeys(productId, quantity, prefix);
        
        if (success) {
            String productName = "未知商品";
            if (productId != null) {
                Product product = productService.getById(productId);
                if (product != null) {
                    productName = product.getName();
                }
            }
            
            logUtil.logCardKeyOperation("CARD_KEY", "批量生成卡密 - 商品: " + productName + " 数量: " + quantity, request);
            
            return Result.success("批量生成卡密成功", true);
        } else {
            return Result.error("批量生成卡密失败");
        }
    }

    /**
     * 获取卡密统计信息
     */
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        Object statistics = cardKeyService.getCardStatistics();
        return Result.success(statistics);
    }

    /**
     * 创建卡密
     */
    @PostMapping
    public Result<Boolean> createCardKey(@RequestBody CardKey cardKey) {
        boolean saved = cardKeyService.save(cardKey);
        
        if (saved) {
            return Result.success("卡密创建成功", true);
        } else {
            return Result.error("卡密创建失败");
        }
    }



    /**
     * 切换卡密状态
     */
    @PostMapping("/{cardKey}/status")
    public Result<Boolean> toggleCardKeyStatus(
            @PathVariable String cardKey,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpRequest) {
        
        String status = request.get("status");
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            card.setStatus(status);
            boolean updated = cardKeyService.updateById(card);
            
            if (updated) {
                String productSpecName = "未知商品-未知规格";
                if (card.getSpecificationId() != null) {
                    Specification spec = specificationService.getById(card.getSpecificationId());
                    if (spec != null) {
                        String productName = "未知商品";
                        if (spec.getProductId() != null) {
                            Product product = productService.getById(spec.getProductId());
                            if (product != null) {
                                productName = product.getName();
                            }
                        }
                        productSpecName = productName + "-" + spec.getName();
                    }
                }
                
                String action = "启用";
                if ("已禁用".equals(status)) {
                    action = "禁用";
                } else if ("已使用".equals(status)) {
                    action = "激活";
                }
                logUtil.logCardKeyOperation("CARD_KEY", action + "卡密: " + card.getCardKey() + " - " + productSpecName, httpRequest);
                
                return Result.success("卡密状态更新成功", true);
            } else {
                return Result.error("卡密状态更新失败");
            }
        } else {
            return Result.notFound();
        }
    }
    
    /**
     * 批量删除已使用卡密
     */
    @DeleteMapping("/batch-delete-used")
    public Result<Boolean> batchDeleteUsedCardKeys(HttpServletRequest request) {
        try {
            boolean deleted = cardKeyService.batchDeleteUsedCardKeys();
            
            if (deleted) {
                logUtil.logCardKeyOperation("CARD_KEY", "批量删除已使用卡密", request);
                return Result.success("已使用卡密批量删除成功", true);
            } else {
                return Result.error("已使用卡密批量删除失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("批量删除已使用卡密时发生错误");
        }
    }
}