DROP DATABASE IF EXISTS card_keeper;
CREATE DATABASE card_keeper CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE card_keeper;

CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user' NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL,
    last_login_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category ENUM('virtual', 'physical', 'service') DEFAULT 'virtual',
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE specifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_days INT DEFAULT 30,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'CNY',
    stock_quantity INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB;

CREATE TABLE card_keys (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    card_key VARCHAR(100) UNIQUE NOT NULL,
    specification_id CHAR(36) NOT NULL,
    status ENUM('未使用', '已使用', '已禁用') DEFAULT '未使用' NOT NULL,
    user_id CHAR(36),
    user_email VARCHAR(100),
    activate_time DATETIME,
    expire_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (specification_id) REFERENCES specifications(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_card_key (card_key),
    INDEX idx_status (status),
    INDEX idx_specification_id (specification_id),
    INDEX idx_user_id (user_id),
    INDEX idx_activate_time (activate_time),
    INDEX idx_expire_time (expire_time)
) ENGINE=InnoDB;

CREATE TABLE operation_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    operation_type ENUM('card_create', 'card_activate', 'card_use', 'card_disable', 'product_create', 'product_update', 'user_login') NOT NULL,
    target_id CHAR(36),
    target_type ENUM('card_key', 'product'),
    description TEXT,
    ip_address VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_operation_type (operation_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

INSERT INTO users (username, email, password_hash, nickname, role, status) VALUES
('admin', 'admin@leafcard.com', '$2a$10$r3dJk7Q6hV6hY7U8i9jKlOeNvMwVq1pQrXrYsTtUvWxYzAbCdEfG', '系统管理员', 'admin', 'active'),
('user1', 'user1@leafcard.com', '$2a$10$r3dJk7Q6hV6hY7U8i9jKlOeNvMwVq1pQrXrYsTtUvWxYzAbCdEfG', '普通用户', 'user', 'active');

INSERT INTO products (name, description, category, status) VALUES
('VIP会员', 'VIP会员专属权益，享受高级服务', 'virtual', 'active'),
('普通会员', '普通会员基础权益，满足日常需求', 'virtual', 'active'),
('体验试用', '新用户专享体验服务', 'virtual', 'active'),
('实体礼品', '精美实体礼品，适合各种场合赠送', 'physical', 'active'),
('在线课程', '专业在线课程服务，提供优质学习体验', 'service', 'inactive');

INSERT INTO specifications (product_id, name, description, duration_days, price, stock_quantity, status) VALUES
((SELECT id FROM products WHERE name = 'VIP会员'), '月卡', 'VIP会员专属月卡，享受专属权益', 30, 29.90, 1000, 'active'),
((SELECT id FROM products WHERE name = 'VIP会员'), '季卡', 'VIP会员专属季卡，享受专属权益', 90, 79.90, 500, 'active'),
((SELECT id FROM products WHERE name = 'VIP会员'), '年卡', 'VIP会员专属年卡，享受专属权益', 365, 299.00, 200, 'active'),
((SELECT id FROM products WHERE name = '普通会员'), '月卡', '普通会员月卡，基础权益', 30, 19.90, 2000, 'active'),
((SELECT id FROM products WHERE name = '普通会员'), '季卡', '普通会员季卡，基础权益', 90, 49.90, 800, 'active'),
((SELECT id FROM products WHERE name = '体验试用'), '体验卡', '新用户专享体验卡', 7, 0.00, 100, 'active'),
((SELECT id FROM products WHERE name = '实体礼品'), '礼品卡', '精美实体礼品卡，适合各种场合赠送', 90, 199.00, 50, 'active'),
((SELECT id FROM products WHERE name = '在线课程'), '基础课程', '在线课程基础服务', 180, 299.00, 50, 'inactive'),
((SELECT id FROM products WHERE name = '在线课程'), '进阶课程', '在线课程进阶服务', 365, 499.00, 30, 'inactive');

INSERT INTO card_keys (card_key, specification_id, status, user_id, user_email, activate_time, expire_time) VALUES
('LEAF-2024-001-ABCD-EFGH', (SELECT id FROM specifications WHERE name = '月卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '未使用', NULL, NULL, NULL, NULL),
('LEAF-2024-002-IJKL-MNOP', (SELECT id FROM specifications WHERE name = '季卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '已使用', (SELECT id FROM users WHERE username = 'user1'), 'user1@leafcard.com', '2024-01-15 14:30:00', '2024-04-15 14:30:00'),
('LEAF-2024-003-QRST-UVWX', (SELECT id FROM specifications WHERE name = '年卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '已禁用', (SELECT id FROM users WHERE username = 'user1'), 'user1@leafcard.com', '2023-12-01 08:00:00', '2024-12-01 08:00:00'),
('LEAF-2024-004-YZAB-CDEF', (SELECT id FROM specifications WHERE name = '月卡' AND product_id = (SELECT id FROM products WHERE name = '普通会员')), '未使用', NULL, NULL, NULL, NULL),
('LEAF-2024-005-GHIJ-KLMN', (SELECT id FROM specifications WHERE name = '月卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '已使用', (SELECT id FROM users WHERE username = 'user1'), 'user1@leafcard.com', '2024-01-10 09:15:00', '2024-02-10 09:15:00'),
('LEAF-2024-006-OPQR-STUV', (SELECT id FROM specifications WHERE name = '体验卡' AND product_id = (SELECT id FROM products WHERE name = '体验试用')), '未使用', NULL, NULL, NULL, NULL),
('LEAF-2024-007-WXYZ-ABCD', (SELECT id FROM specifications WHERE name = '礼品卡' AND product_id = (SELECT id FROM products WHERE name = '实体礼品')), '已禁用', NULL, NULL, NULL, NULL),
('LEAF-2024-008-EFGH-IJKL', (SELECT id FROM specifications WHERE name = '季卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '未使用', NULL, NULL, NULL, NULL),
('LEAF-2024-009-MNOP-QRST', (SELECT id FROM specifications WHERE name = '年卡' AND product_id = (SELECT id FROM products WHERE name = 'VIP会员')), '已使用', (SELECT id FROM users WHERE username = 'user1'), 'user1@leafcard.com', '2024-01-20 16:45:00', '2025-01-20 16:45:00'),
('LEAF-2024-010-UVWX-YZAB', (SELECT id FROM specifications WHERE name = '月卡' AND product_id = (SELECT id FROM products WHERE name = '普通会员')), '未使用', NULL, NULL, NULL, NULL);


CREATE VIEW card_key_detail_view AS
SELECT 
    ck.*,
    p.name as product_name,
    p.category as product_category,
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