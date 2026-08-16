package com.leafboss.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafboss.common.Result;
import com.leafboss.entity.BossReview;
import com.leafboss.entity.CardKey;
import com.leafboss.entity.Company;
import com.leafboss.service.BossReviewService;
import com.leafboss.service.CardKeyService;
import com.leafboss.service.CompanyService;
import com.leafboss.service.OperationLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/boss-reviews")
public class PublicBossReviewController {

    @Autowired
    private BossReviewService bossReviewService;

    @Autowired
    private CardKeyService cardKeyService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private OperationLogService operationLogService;

    @PostMapping
    @Transactional
    public Result<Boolean> createReview(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String cardKey = request.get("card_key");
        String companyName = request.get("company_name");
        String content = request.get("content");

        if (cardKey == null || cardKey.trim().isEmpty()) {
            return Result.error("卡密不能为空");
        }
        if (companyName == null || companyName.trim().isEmpty()) {
            return Result.error("公司名不能为空");
        }
        if (content == null || content.trim().isEmpty()) {
            return Result.error("评论内容不能为空");
        }

        QueryWrapper<CardKey> cardKeyQuery = new QueryWrapper<>();
        cardKeyQuery.eq("card_key", cardKey);
        CardKey cardKeyEntity = cardKeyService.getOne(cardKeyQuery);

        if (cardKeyEntity == null) {
            return Result.error("卡密不存在");
        }

        if (!"已使用".equals(cardKeyEntity.getStatus())) {
            return Result.error("该卡密未使用，无法发表评论");
        }

        QueryWrapper<Company> companyQuery = new QueryWrapper<>();
        companyQuery.eq("name", companyName);
        Company company = companyService.getOne(companyQuery);

        if (company == null) {
            company = new Company();
            company.setName(companyName);
            company.setCommentCount(0);
            companyService.save(company);
        }

        QueryWrapper<BossReview> reviewQuery = new QueryWrapper<>();
        reviewQuery.eq("card_key", cardKey);
        reviewQuery.eq("company_id", company.getId());
        if (bossReviewService.count(reviewQuery) > 0) {
            return Result.error("您已经评论过该公司");
        }

        BossReview review = new BossReview();
        review.setCardKey(cardKey);
        review.setCompanyId(company.getId());
        review.setContent(content);

        boolean saved = bossReviewService.save(review);
        if (saved) {
            company.setCommentCount(company.getCommentCount() + 1);
            companyService.updateById(company);
            operationLogService.logOperation("评论管理", "用户发表评论，卡密：" + cardKey + "，公司：" + companyName, httpRequest.getRemoteAddr());
            return Result.success("评论发布成功", true);
        } else {
            return Result.error("评论发布失败");
        }
    }

    @GetMapping
    public Result<Object> getReviews(
            @RequestParam String company_name,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (company_name == null || company_name.trim().isEmpty()) {
            return Result.error("公司名不能为空");
        }

        Page<BossReview> pageInfo = new Page<>(page, size);
        Page<BossReview> result = bossReviewService.pageByCompanyName(pageInfo, company_name);

        return Result.success("评论列表查询成功", Map.of(
            "page", result.getCurrent(),
            "size", result.getSize(),
            "total", result.getTotal(),
            "records", result.getRecords()
        ));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public Result<Boolean> deleteReview(@PathVariable String id,
                                        @RequestParam String cardKey,
                                        HttpServletRequest httpRequest) {
        if (cardKey == null || cardKey.trim().isEmpty()) {
            return Result.error("卡密不能为空");
        }

        BossReview review = bossReviewService.getById(id);
        if (review == null) {
            return Result.error("评论不存在");
        }

        if (!cardKey.equals(review.getCardKey())) {
            return Result.error("卡密不匹配，无法删除该评论");
        }

        boolean deleted = bossReviewService.removeById(id);
        if (deleted) {
            Company company = companyService.getById(review.getCompanyId());
            if (company != null && company.getCommentCount() > 0) {
                company.setCommentCount(company.getCommentCount() - 1);
                companyService.updateById(company);
            }
            operationLogService.logOperation("评论管理", "用户删除评论，卡密：" + cardKey, httpRequest.getRemoteAddr());
            return Result.success("评论删除成功", true);
        } else {
            return Result.error("评论删除失败");
        }
    }
}
