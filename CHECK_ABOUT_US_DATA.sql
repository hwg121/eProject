-- Kiểm tra dữ liệu About Us trong DB

-- 1. Kiểm tra Hero Section
SELECT 
    id,
    title,
    LEFT(description, 100) as description_preview,
    is_active,
    created_at,
    updated_at
FROM hero_sections
ORDER BY created_at DESC;

-- 2. Kiểm tra Staff Members
SELECT 
    id,
    name,
    role,
    LEFT(short_bio, 50) as bio_preview,
    display_order,
    is_active,
    avatar,
    created_at
FROM staff_members
ORDER BY display_order ASC;

-- 3. Kiểm tra Map Settings
SELECT 
    id,
    location_name,
    LEFT(address, 100) as address_preview,
    LEFT(embed_url, 100) as embed_preview,
    is_active,
    created_at,
    updated_at
FROM map_settings
ORDER BY created_at DESC;

-- 4. Kiểm tra Hero Section ACTIVE (Public API sẽ lấy cái này)
SELECT *
FROM hero_sections
WHERE is_active = 1
LIMIT 1;

-- 5. Kiểm tra Staff Members ACTIVE (Public API sẽ lấy cái này)
SELECT *
FROM staff_members
WHERE is_active = 1
ORDER BY display_order ASC
LIMIT 5;

-- 6. Kiểm tra Map Setting ACTIVE (Public API sẽ lấy cái này)
SELECT *
FROM map_settings
WHERE is_active = 1
LIMIT 1;

-- 7. Đếm số lượng record active
SELECT 
    'Hero Sections' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_records
FROM hero_sections
UNION ALL
SELECT 
    'Staff Members' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_records
FROM staff_members
UNION ALL
SELECT 
    'Map Settings' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_records
FROM map_settings;

