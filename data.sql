-- 数据库初始化脚本
-- 如果数据库存在则删除，然后重新创建
DROP DATABASE IF EXISTS leaf_card;
CREATE DATABASE leaf_card CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE leaf_card;

-- 管理员表（简化版，只有管理员）
CREATE TABLE admins (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '管理员唯一标识符',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希值',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '状态：active-活跃，inactive-非活跃',
    last_login_time DATETIME COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='管理员表';

-- 产品表
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '产品唯一标识符',
    name VARCHAR(100) NOT NULL COMMENT '产品名称',
    description TEXT COMMENT '产品描述',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL COMMENT '产品状态',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB COMMENT='产品表';

-- 规格表（修复字段缺失问题）
CREATE TABLE specifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '规格唯一标识符',
    product_id CHAR(36) NOT NULL COMMENT '产品ID',
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

-- 卡密表（修复字段缺失和冗余问题）
CREATE TABLE card_keys (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '卡密唯一标识符',
    card_key VARCHAR(100) UNIQUE NOT NULL COMMENT '卡密',
    specification_id CHAR(36) NOT NULL COMMENT '规格ID',
    status ENUM('未使用', '已使用', '已禁用') DEFAULT '未使用' NOT NULL COMMENT '状态',
    user_email VARCHAR(100) COMMENT '用户邮箱（激活时填写）',
    activate_time DATETIME COMMENT '激活时间',
    expire_time DATETIME COMMENT '过期时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL COMMENT '最后更新时间',
    FOREIGN KEY (specification_id) REFERENCES specifications(id) ON DELETE RESTRICT,
    INDEX idx_card_key (card_key),
    INDEX idx_status (status),
    INDEX idx_specification_id (specification_id),
    INDEX idx_user_email (user_email),
    INDEX idx_activate_time (activate_time),
    INDEX idx_expire_time (expire_time)
) ENGINE=InnoDB COMMENT='卡密表';

-- 操作日志表
CREATE TABLE operation_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()) COMMENT '日志唯一标识符',
    admin_id CHAR(36) COMMENT '管理员ID',
    operation_type ENUM('card_create', 'card_activate', 'card_disable', 'product_create', 'product_update', 'admin_login') NOT NULL COMMENT '操作类型',
    target_id CHAR(36) COMMENT '目标ID',
    target_type ENUM('card_key', 'product') COMMENT '目标类型',
    description TEXT COMMENT '描述',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL COMMENT '创建时间',
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_admin_id (admin_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB COMMENT='操作日志表';

-- 只初始化一个管理员账号
INSERT INTO admins (username, email, password_hash, status) VALUES
('admin', 'admin@leafcard.com', '$2a$10$r3dJk7Q6hV6hY7U8i9jKlOeNvMwVq1pQrXrYsTtUvWxYzAbCdEfG', 'active');

-- 简化产品数据，只保留核心产品
INSERT INTO products (name, description, status) VALUES
('VIP会员', 'VIP会员专属权益，享受高级服务', 'active'),
('普通会员', '普通会员基础权益，满足日常需求', 'active');

-- 简化规格数据，每个产品保留1-2个规格
INSERT INTO specifications (product_id, name, description, duration_days, price, stock_quantity, status) VALUES
((SELECT id FROM products WHERE name = 'VIP会员'), '月卡', 'VIP会员专属月卡，享受专属权益', 30, 29.90, 100, 'active'),
((SELECT id FROM products WHERE name = 'VIP会员'), '年卡', 'VIP会员专属年卡，享受专属权益', 365, 299.00, 50, 'active'),
((SELECT id FROM products WHERE name = '普通会员'), '月卡', '普通会员月卡，基础权益', 30, 19.90, 200, 'active');

-- 简化卡密数据，只保留少量测试卡密
INSERT INTO card_keys (card_key, specification_id, status, user_email, activate_time, expire_time) VALUES
('LEAF-TEST-001', (SELECT id FROM specifications WHERE name = '月卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '未使用', NULL, NULL, NULL),
('LEAF-TEST-002', (SELECT id FROM specifications WHERE name = '年卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '未使用', NULL, NULL, NULL),
('LEAF-TEST-003', (SELECT id FROM specifications WHERE name = '月卡' AND product_id = (SELECT id FROM products WHERE name = '普通会员')), '未使用', NULL, NULL, NULL);


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

-- 提交视图和存储过程创建操作
COMMIT;