-- 数据库初始化脚本
DROP DATABASE IF EXISTS leaf_card;
CREATE DATABASE leaf_card CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE leaf_card;

-- 管理员表
CREATE TABLE admins (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '管理员唯一标识符',
    username VARCHAR(50) NOT NULL DEFAULT 'leafAdmin' COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希值',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '状态',
    last_login_time DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='管理员表';

-- 产品表
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '产品唯一标识符',
    name VARCHAR(100) NOT NULL COMMENT '产品名称',
    description TEXT COMMENT '产品描述',
    category VARCHAR(50) DEFAULT 'default' COMMENT '产品分类',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '产品状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='产品表';

-- 规格表
CREATE TABLE specifications (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '规格唯一标识符',
    product_id INT NOT NULL COMMENT '产品ID',
    name VARCHAR(100) NOT NULL COMMENT '规格名称',
    description TEXT COMMENT '规格描述',
    duration_days INT DEFAULT 0 COMMENT '有效期（天）',
    price DECIMAL(10,2) DEFAULT 0.00 COMMENT '价格',
    stock_quantity INT DEFAULT 0 COMMENT '库存数量',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='规格表';

-- 卡密表
CREATE TABLE card_keys (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '卡密唯一标识符',
    card_key VARCHAR(100) UNIQUE NOT NULL COMMENT '卡密',
    specification_id INT NOT NULL COMMENT '规格ID',
    status ENUM('未使用', '已使用', '已禁用') DEFAULT '未使用' NOT NULL COMMENT '状态',
    user_email VARCHAR(100) COMMENT '用户邮箱',
    user_id VARCHAR(100) COMMENT '用户ID',
    activate_time DATETIME COMMENT '激活时间',
    expire_time DATETIME COMMENT '过期时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    FOREIGN KEY (specification_id) REFERENCES specifications(id) ON DELETE CASCADE,
    INDEX idx_card_key (card_key),
    INDEX idx_status (status),
    INDEX idx_specification_id (specification_id),
    INDEX idx_user_email (user_email),
    INDEX idx_user_id (user_id),
    INDEX idx_activate_time (activate_time),
    INDEX idx_expire_time (expire_time)
) ENGINE=InnoDB COMMENT='卡密表';

-- 操作日志表
CREATE TABLE operation_logs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '日志唯一标识符',
    operation_type ENUM('LOGIN', 'CARD_KEY', 'PRODUCT', 'SPECIFICATION', 'USER', 'SYSTEM') NOT NULL COMMENT '操作类型',
    description TEXT COMMENT '描述',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='操作日志表';

-- 初始化管理员账号
INSERT INTO admins (username, email, password_hash, status) VALUES
('admin', 'admin@qq.com', '123456', 'active');

CREATE VIEW card_key_detail_view AS
SELECT 
    ck.*,
    p.name as product_name,
    s.name as specification_name,
    s.description as specification_description,
    s.duration_days,
    s.price
FROM card_keys ck
LEFT JOIN specifications s ON ck.specification_id = s.id
LEFT JOIN products p ON s.product_id = p.id;

DELIMITER //
CREATE PROCEDURE sp_get_card_statistics()
BEGIN
    SELECT 
        COUNT(*) as total_cards,
        SUM(CASE WHEN status = '未使用' THEN 1 ELSE 0 END) as unused_cards,
        SUM(CASE WHEN status = '已使用' THEN 1 ELSE 0 END) as used_cards,
        SUM(CASE WHEN status = '已禁用' THEN 1 ELSE 0 END) as disabled_cards
    FROM card_keys;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE sp_get_product_statistics()
BEGIN
    SELECT 
        COUNT(*) as total_products,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_products,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_products,
        (SELECT COUNT(*) FROM specifications WHERE status = 'active') as active_specifications,
        (SELECT SUM(stock_quantity) FROM specifications WHERE status = 'active') as total_stock
    FROM products;
END //
DELIMITER ;

COMMIT;