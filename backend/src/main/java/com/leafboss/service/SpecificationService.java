package com.leafboss.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.leafboss.dto.SpecificationDTO;
import com.leafboss.entity.Specification;

import java.util.List;

public interface SpecificationService extends IService<Specification> {

    List<Specification> findByProductId(Long productId);

    List<Specification> findByStatus(Integer status);

    List<Specification> findByProductIdAndStatus(Long productId, Integer status);

    Object getSpecificationStatistics();

    List<SpecificationDTO> getSpecificationDTOs();

    IPage<SpecificationDTO> getSpecificationDTOsWithPagination(Page<Specification> page, String keyword, Long productId);

    Specification findByName(String name);

    IPage<Specification> getSpecificationsWithFilters(Page<Specification> page, String keyword, Long productId);
}