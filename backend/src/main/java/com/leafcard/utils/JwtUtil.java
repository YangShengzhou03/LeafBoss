package com.leafcard.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类
 */
@Component
public class JwtUtil {
    
    // 使用安全的卡密生成
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // token过期时间：7天（开发环境可适当延长）
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;
    
    /**
     * 生成JWT token
     * @param adminId 管理员ID
     * @param username 用户名
     * @return JWT token
     */
    public String generateToken(String adminId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("adminId", adminId);
        claims.put("username", username);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY)
                .compact();
    }
    
    /**
     * 验证JWT token
     * @param token JWT token
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
    
    /**
     * 从token中获取管理员ID
     * @param token JWT token
     * @return 管理员ID
     */
    public String getAdminIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("adminId", String.class);
    }

    /**
     * 从token中获取用户ID（兼容性方法）
     * @param token JWT token
     * @return 用户ID
     */
    public String getUserIdFromToken(String token) {
        return getAdminIdFromToken(token);
    }
    
    /**
     * 从token中获取用户名
     * @param token JWT token
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
    
    /**
     * 检查token是否即将过期
     * @param token JWT token
     * @return 是否即将过期（剩余时间小于1天）
     */
    public boolean isTokenExpiring(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Date expiration = claims.getExpiration();
            long timeUntilExpiration = expiration.getTime() - System.currentTimeMillis();
            return timeUntilExpiration < (1000 * 60 * 60 * 24); // 小于1天
        } catch (JwtException e) {
            return true;
        }
    }
}