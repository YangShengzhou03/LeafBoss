package com.leafboss.config;

import com.leafboss.entity.Admin;
import com.leafboss.service.AdminService;
import com.leafboss.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminService adminService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorization = request.getHeader("Authorization");

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            return true;
        }

        String token = authorization.substring(7);

        try {
            String adminId = jwtUtil.getUserIdFromToken(token);

            if (adminId != null) {
                Admin admin = adminService.getById(adminId);

                if (admin == null || "inactive".equals(admin.getStatus())) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"code\":401,\"message\":\"账号已被禁用或不存在，请重新登录\"}");
                    return false;
                }
            }
        } catch (Exception e) {
            return true;
        }

        return true;
    }
}
