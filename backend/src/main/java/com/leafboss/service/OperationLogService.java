package com.leafboss.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.leafboss.entity.OperationLog;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface OperationLogService extends IService<OperationLog> {

    List<OperationLog> findByOperationType(String operationType);

    Map<String, Object> getLogStats(String startDate, String endDate);

    void exportLogs(String startDate, String endDate, HttpServletResponse response) throws IOException;

    boolean clearLogs();

    void logOperation(String operationType, String description, String ipAddress);
}