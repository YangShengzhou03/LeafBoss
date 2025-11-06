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
    public Result<List<CardKeyDTO>> getCardKeysWithDetails() {
        List<CardKeyDTO> cardKeyList = cardKeyService.getCardKeyListWithDetails();
        return Result.success(cardKeyList);
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
            // 创建包含卡密和规格信息的完整响应
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
            
            // 获取规格信息（包括价格）
            if (card.getSpecificationId() != null) {
                Specification spec = specificationService.getById(card.getSpecificationId());
                if (spec != null) {
                    response.put("specificationName", spec.getName());
                    response.put("price", spec.getPrice());
                    response.put("durationDays", spec.getDurationDays());
                    
                    // 获取产品信息
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
        
        if ("active".equals(cardKeyEntity.getStatus())) {
            return Result.error("卡密已经是激活状态");
        }
        
        cardKeyEntity.setStatus("active");
        boolean updated = cardKeyService.updateById(cardKeyEntity);
        
        if (updated) {
            // 记录激活卡密日志
            logUtil.logCardKeyOperation("CARD_KEY", "管理员激活了卡密: " + cardKeyEntity.getCardKey() + " - 规格ID: " + cardKeyEntity.getSpecificationId(), request);
            
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
        
        if ("disabled".equals(cardKeyEntity.getStatus())) {
            return Result.error("卡密已经是禁用状态");
        }
        
        cardKeyEntity.setStatus("disabled");
        boolean updated = cardKeyService.updateById(cardKeyEntity);
        
        if (updated) {
            // 记录禁用卡密日志
            logUtil.logCardKeyOperation("CARD_KEY", "管理员禁用了卡密: " + cardKeyEntity.getCardKey() + " - 规格ID: " + cardKeyEntity.getSpecificationId(), request);
            
            return Result.success("卡密禁用成功", true);
        } else {
            return Result.error("卡密禁用失败");
        }
    }

    /**
     * 删除卡密
     */
    @DeleteMapping("/{id}")
    public Result<Boolean> deleteCardKey(@PathVariable String id, HttpServletRequest request) {
        CardKey cardKey = cardKeyService.getById(Integer.parseInt(id));
        if (cardKey == null) {
            return Result.error("卡密不存在");
        }
        
        boolean deleted = cardKeyService.removeById(Integer.parseInt(id));
        
        if (deleted) {
            // 记录删除卡密日志
            logUtil.logCardKeyOperation("CARD_KEY", "管理员删除了卡密: " + cardKey.getCardKey() + " - 规格ID: " + cardKey.getSpecificationId(), request);
            
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
            // 记录批量生成卡密日志
            logUtil.logCardKeyOperation("CARD_KEY", "管理员为产品ID: " + productId + " 批量生成了 " + quantity + " 张卡密", request);
            
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
     * 删除卡密
     */
    @DeleteMapping("/{cardKey}")
    public Result<Boolean> deleteCardKey(@PathVariable String cardKey) {
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            boolean deleted = cardKeyService.removeById(card.getId());
            if (deleted) {
                return Result.success("卡密删除成功", true);
            } else {
                return Result.error("卡密删除失败");
            }
        } else {
            return Result.notFound();
        }
    }

    /**
     * 切换卡密状态
     */
    @PostMapping("/{cardKey}/status")
    public Result<Boolean> toggleCardKeyStatus(
            @PathVariable String cardKey,
            @RequestBody Map<String, String> request) {
        
        String status = request.get("status");
        CardKey card = cardKeyService.findByCardKey(cardKey);
        
        if (card != null) {
            card.setStatus(status);
            boolean updated = cardKeyService.updateById(card);
            
            if (updated) {
                return Result.success("卡密状态更新成功", true);
            } else {
                return Result.error("卡密状态更新失败");
            }
        } else {
            return Result.notFound();
        }
    }
}