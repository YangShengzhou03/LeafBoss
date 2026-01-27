package com.leafboss.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafboss.dto.CardKeyDTO;
import com.leafboss.entity.CardKey;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface CardKeyService extends IService<CardKey> {

    CardKey findByCardKey(String cardKey);

    List<CardKey> findByStatus(String status);

    IPage<CardKeyDTO> getCardKeyListWithDetails(Page<CardKey> pageParam, String keyword, Long specificationId, String status);

    boolean activateCard(String cardKey, String userId, String userEmail);

    boolean disableCard(String cardKey);

    Object getCardStatistics();

    boolean batchGenerateCardKeys(String productId, Integer quantity, String prefix);

    boolean batchDeleteUsedCardKeys();
}