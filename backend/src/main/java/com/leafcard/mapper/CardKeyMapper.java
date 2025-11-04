package com.leafcard.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.leafcard.entity.CardKey;
import org.apache.ibatis.annotations.Mapper;

/**
 * 卡密Mapper接口
 */
@Mapper
public interface CardKeyMapper extends BaseMapper<CardKey> {
}