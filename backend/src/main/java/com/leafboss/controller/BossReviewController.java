package com.leafboss.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafboss.common.Result;
import com.leafboss.entity.BossReview;
import com.leafboss.entity.Company;
import com.leafboss.service.BossReviewService;
import com.leafboss.service.CompanyService;
import com.leafboss.utils.LogUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/boss-reviews")
public class BossReviewController {

    @Autowired
    private BossReviewService bossReviewService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private LogUtil logUtil;

    @GetMapping
    public Result<IPage<BossReview>> getBossReviews(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer companyId,
            @RequestParam(required = false) String cardKey) {
        
        Page<BossReview> pageParam = new Page<>(page, size);
        IPage<BossReview> reviewPage = bossReviewService.pageWithDetails(pageParam, companyId, cardKey);
        return Result.success(reviewPage);
    }

    @GetMapping("/{id}")
    public Result<BossReview> getBossReview(@PathVariable String id) {
        BossReview review = bossReviewService.getById(id);
        if (review != null) {
            return Result.success(review);
        } else {
            return Result.notFound();
        }
    }

    @PostMapping
    @Transactional
    public Result<Boolean> createBossReview(@RequestBody BossReview review, HttpServletRequest request) {
        boolean saved = bossReviewService.save(review);
        if (saved) {
            Company company = companyService.getById(review.getCompanyId());
            if (company != null) {
                company.setCommentCount(company.getCommentCount() + 1);
                companyService.updateById(company);
            }
            logUtil.logOperation("BOSS_REVIEW", "发布评论: " + review.getContent(), request);
            return Result.success("评论发布成功", true);
        } else {
            return Result.error("评论发布失败");
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    public Result<Boolean> deleteBossReview(@PathVariable String id, HttpServletRequest request) {
        BossReview review = bossReviewService.getById(id);
        boolean deleted = bossReviewService.removeById(id);
        if (deleted) {
            if (review != null && review.getCompanyId() != null) {
                Company company = companyService.getById(review.getCompanyId());
                if (company != null && company.getCommentCount() > 0) {
                    company.setCommentCount(company.getCommentCount() - 1);
                    companyService.updateById(company);
                }
            }
            logUtil.logOperation("BOSS_REVIEW", "删除评论: " + (review != null ? review.getContent() : id), request);
            return Result.success("评论删除成功", true);
        } else {
            return Result.error("评论删除失败");
        }
    }
}
