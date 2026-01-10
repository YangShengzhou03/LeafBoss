package com.leafboss.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafboss.entity.OperationLog;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 操作日志服务接口
 */
public interface OperationLogService extends IService<OperationLog> {
    
    /**
     * 根据操作类型查询操作日志
     * @param operationType 操作类型
     * @return 操作日志列表
     */
    List<OperationLog> findByOperationType(String operationType);
    
    /**
     * 获取日志统计信息
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 统计信息
     */
    Map<String, Object> getLogStats(String startDate, String endDate);
    
    /**
     * 导出操作日志
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param response HTTP响应
     * @throws IOException IO异常
     */
    void exportLogs(String startDate, String endDate, HttpServletResponse response) throws IOException;
    
    /**
     * 清空操作日志
     * @return 是否清空成功
     */
    boolean clearLogs();
    
    /**
     * 记录操作日志
     * @param operationType 操作类型
     * @param description 描述
     * @param ipAddress IP地址
     */
    void logOperation(String operationType, String description, String ipAddress);
}