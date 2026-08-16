package com.leafboss.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leafboss.entity.BossReview;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BossReviewMapper extends BaseMapper<BossReview> {
    
    @Select("SELECT br.*, c.name as company_name FROM boss_reviews br " +
            "LEFT JOIN companies c ON br.company_id = c.id " +
            "WHERE c.name = #{companyName} " +
            "ORDER BY br.created_at DESC")
    Page<BossReview> selectByCompanyName(Page<BossReview> page, @Param("companyName") String companyName);

    @Select("SELECT br.*, c.name as company_name FROM boss_reviews br " +
            "LEFT JOIN companies c ON br.company_id = c.id " +
            "WHERE (#{companyId} IS NULL OR br.company_id = #{companyId}) " +
            "AND (#{cardKey} IS NULL OR #{cardKey} = '' OR br.card_key = #{cardKey}) " +
            "ORDER BY br.created_at DESC")
    Page<BossReview> selectPageWithDetails(Page<BossReview> page, @Param("companyId") Integer companyId, @Param("cardKey") String cardKey);

    @Select("SELECT br.*, c.name as company_name FROM boss_reviews br " +
            "LEFT JOIN companies c ON br.company_id = c.id " +
            "WHERE (#{keyword} IS NULL OR #{keyword} = '' " +
            "OR br.card_key LIKE CONCAT('%',#{keyword},'%') " +
            "OR c.name LIKE CONCAT('%',#{keyword},'%') " +
            "OR br.content LIKE CONCAT('%',#{keyword},'%')) " +
            "ORDER BY br.created_at DESC")
    Page<BossReview> selectPageWithKeyword(Page<BossReview> page, @Param("keyword") String keyword);
}
