-- =====================================================
-- SQL SCRIPT ĐỂ SỬA CẤU TRÚC DATABASE PRODUCTION
-- =====================================================
-- Ngày tạo: 2025-10-09
-- Mục đích: Thêm các columns thiếu vào tables videos và articles
-- LƯU Ý: BACKUP DATABASE TRƯỚC KHI CHẠY!
-- =====================================================

-- =====================================================
-- 1. VIDEOS TABLE - THÊM MISSING COLUMNS
-- =====================================================

-- Check nếu bảng videos tồn tại
SELECT 'Checking videos table...' AS status;

-- Thêm slug column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `slug` VARCHAR(255) UNIQUE AFTER `title`;

-- Thêm excerpt column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `excerpt` TEXT NULL AFTER `description`;

-- Thêm instructor column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `instructor` VARCHAR(255) NULL AFTER `excerpt`;

-- Thêm video_url column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `video_url` VARCHAR(255) NULL AFTER `embed_url`;

-- Thêm link column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `link` VARCHAR(255) NULL AFTER `video_url`;

-- Thêm thumbnail_url column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `thumbnail_url` VARCHAR(255) NULL AFTER `thumbnail`;

-- Thêm featured_image column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `featured_image` VARCHAR(255) NULL AFTER `thumbnail_url`;

-- Thêm featured_image_public_id column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `featured_image_public_id` VARCHAR(255) NULL AFTER `featured_image`;

-- Thêm cover column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `cover` VARCHAR(255) NULL AFTER `featured_image_public_id`;

-- Thêm cover_public_id column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `cover_public_id` VARCHAR(255) NULL AFTER `cover`;

-- Thêm thumbnail_public_id column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `thumbnail_public_id` VARCHAR(255) NULL AFTER `cover_public_id`;

-- Thêm content column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `content` LONGTEXT NULL AFTER `thumbnail_public_id`;

-- Thêm transcript column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `transcript` LONGTEXT NULL AFTER `content`;

-- Thêm category column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `category` VARCHAR(100) DEFAULT 'Video' AFTER `transcript`;

-- Thêm status column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `status` ENUM('draft', 'published') DEFAULT 'published' AFTER `category`;

-- Thêm views column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `views` INT(11) DEFAULT 0 AFTER `status`;

-- Thêm likes column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `likes` INT(11) DEFAULT 0 AFTER `views`;

-- Thêm rating column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `rating` DECIMAL(3,2) NULL AFTER `likes`;

-- Thêm duration column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `duration` INT(11) NULL AFTER `rating`;

-- Thêm is_featured column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `is_featured` TINYINT(1) DEFAULT 0 AFTER `duration`;

-- Thêm tags column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `tags` TEXT NULL AFTER `is_featured`;

-- Thêm category_id column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `category_id` BIGINT(20) UNSIGNED NULL AFTER `tags`;

-- Thêm author_id column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `author_id` BIGINT(20) UNSIGNED NULL AFTER `category_id`;

-- Thêm published_at column
ALTER TABLE `videos` 
ADD COLUMN IF NOT EXISTS `published_at` TIMESTAMP NULL AFTER `author_id`;

-- Thêm foreign keys nếu chưa có
-- LƯU Ý: Kiểm tra xem categories và users tables có tồn tại không
-- ALTER TABLE `videos` 
-- ADD CONSTRAINT `videos_category_id_foreign` 
-- FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL;

-- ALTER TABLE `videos` 
-- ADD CONSTRAINT `videos_author_id_foreign` 
-- FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE SET NULL;

SELECT 'Videos table updated successfully!' AS status;

-- =====================================================
-- 2. ARTICLES TABLE - THÊM MISSING COLUMNS
-- =====================================================

SELECT 'Checking articles table...' AS status;

-- Thêm description column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `description` TEXT NULL AFTER `excerpt`;

-- Thêm content column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `content` LONGTEXT NULL AFTER `body`;

-- Thêm featured_image column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `featured_image` VARCHAR(255) NULL AFTER `content`;

-- Thêm featured_image_public_id column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `featured_image_public_id` VARCHAR(255) NULL AFTER `featured_image`;

-- Thêm cover column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `cover` VARCHAR(255) NULL AFTER `featured_image_public_id`;

-- Thêm cover_public_id column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `cover_public_id` VARCHAR(255) NULL AFTER `cover`;

-- Thêm category column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `category` VARCHAR(100) DEFAULT 'Technique' AFTER `cover_public_id`;

-- Thêm views column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `views` INT(11) DEFAULT 0 AFTER `status`;

-- Thêm likes column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `likes` INT(11) DEFAULT 0 AFTER `views`;

-- Thêm is_featured column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `is_featured` TINYINT(1) DEFAULT 0 AFTER `likes`;

-- Thêm reading_time column
ALTER TABLE `articles` 
ADD COLUMN IF NOT EXISTS `reading_time` INT(11) NULL AFTER `is_featured`;

SELECT 'Articles table updated successfully!' AS status;

-- =====================================================
-- 3. UPDATE EXISTING DATA (OPTIONAL)
-- =====================================================

-- Tạo slug cho videos chưa có slug (dựa vào title)
UPDATE `videos` 
SET `slug` = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(
    `title`, ' ', '-'), 'đ', 'd'), 'Đ', 'D'), ',', ''))
WHERE `slug` IS NULL OR `slug` = '';

-- Set default status cho videos
UPDATE `videos` 
SET `status` = 'published' 
WHERE `status` IS NULL OR `status` = '';

-- Tạo slug cho articles chưa có slug (nếu cần)
-- UPDATE `articles` 
-- SET `slug` = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(
--     `title`, ' ', '-'), 'đ', 'd'), 'Đ', 'D'), ',', ''))
-- WHERE `slug` IS NULL OR `slug` = '';

SELECT 'Data migration completed!' AS status;

-- =====================================================
-- 4. VERIFY CHANGES
-- =====================================================

-- Kiểm tra cấu trúc bảng videos
DESCRIBE `videos`;

-- Kiểm tra cấu trúc bảng articles
DESCRIBE `articles`;

-- Đếm số lượng records
SELECT 
    'videos' AS table_name, 
    COUNT(*) AS total_records,
    SUM(CASE WHEN slug IS NOT NULL THEN 1 ELSE 0 END) AS with_slug,
    SUM(CASE WHEN featured_image IS NOT NULL THEN 1 ELSE 0 END) AS with_image
FROM `videos`
UNION ALL
SELECT 
    'articles' AS table_name, 
    COUNT(*) AS total_records,
    SUM(CASE WHEN slug IS NOT NULL THEN 1 ELSE 0 END) AS with_slug,
    SUM(CASE WHEN featured_image IS NOT NULL THEN 1 ELSE 0 END) AS with_image
FROM `articles`;

-- =====================================================
-- HOÀN THÀNH!
-- =====================================================
SELECT 'Database structure fix completed! Please verify the changes.' AS status;

