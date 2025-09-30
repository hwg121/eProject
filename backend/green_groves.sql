-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mariadb:3306
-- Generation Time: Sep 25, 2025 at 08:16 PM
-- Server version: 10.11.14-MariaDB-ubu2204
-- PHP Version: 8.2.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `green_groves`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_us`
--

CREATE TABLE `about_us` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text NOT NULL,
  `content` longtext NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `mission` varchar(255) DEFAULT NULL,
  `vision` varchar(255) DEFAULT NULL,
  `values` varchar(255) DEFAULT NULL,
  `team_members` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`team_members`)),
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `social_links` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_links`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `about_us`
--

INSERT INTO `about_us` (`id`, `title`, `subtitle`, `description`, `content`, `image`, `mission`, `vision`, `values`, `team_members`, `achievements`, `contact_email`, `contact_phone`, `address`, `social_links`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Về Chúng Tôi - Green Groves', 'Hành trình xanh của chúng tôi', 'Green Groves là cộng đồng làm vườn hàng đầu Việt Nam, cung cấp kiến thức, công cụ và sản phẩm chất lượng cao cho những người yêu thích làm vườn.', 'Green Groves được thành lập với sứ mệnh mang đến một không gian xanh tươi mát cho mọi gia đình Việt Nam. Chúng tôi tin rằng việc làm vườn không chỉ là một sở thích mà còn là cách để kết nối với thiên nhiên, cải thiện chất lượng cuộc sống và bảo vệ môi trường.\n\nTừ những ngày đầu thành lập, chúng tôi đã không ngừng phát triển và mở rộng cộng đồng những người yêu thích làm vườn. Với đội ngũ chuyên gia giàu kinh nghiệm và đam mê, chúng tôi cam kết mang đến những sản phẩm và dịch vụ tốt nhất.\n\nChúng tôi hiểu rằng mỗi người có những nhu cầu và điều kiện khác nhau khi làm vườn. Vì vậy, chúng tôi cung cấp đa dạng các sản phẩm từ dụng cụ cơ bản đến chuyên nghiệp, từ hạt giống đến cây trưởng thành, từ chậu cây đến hệ thống tưới nước thông minh.\n\nGreen Groves không chỉ là nơi mua sắm mà còn là cộng đồng học hỏi và chia sẻ kinh nghiệm. Chúng tôi thường xuyên tổ chức các workshop, hội thảo và sự kiện để kết nối những người yêu thích làm vườn.', NULL, 'Mang đến không gian xanh tươi mát cho mọi gia đình Việt Nam thông qua việc cung cấp sản phẩm, kiến thức và dịch vụ làm vườn chất lượng cao.', 'Trở thành cộng đồng làm vườn hàng đầu Việt Nam, góp phần xây dựng một xã hội xanh và bền vững.', 'Chất lượng, Sáng tạo, Bền vững, Cộng đồng, Đam mê', '[{\"name\":\"Nguy\\u1ec5n V\\u0103n A\",\"position\":\"Gi\\u00e1m \\u0111\\u1ed1c \\u0111i\\u1ec1u h\\u00e0nh\",\"image\":null,\"description\":\"Chuy\\u00ean gia v\\u1ec1 l\\u00e0m v\\u01b0\\u1eddn v\\u1edbi h\\u01a1n 10 n\\u0103m kinh nghi\\u1ec7m\"},{\"name\":\"Tr\\u1ea7n Th\\u1ecb B\",\"position\":\"Chuy\\u00ean gia c\\u00e2y tr\\u1ed3ng\",\"image\":null,\"description\":\"Th\\u1ea1c s\\u0129 N\\u00f4ng nghi\\u1ec7p, chuy\\u00ean v\\u1ec1 c\\u00e2y c\\u1ea3nh v\\u00e0 rau s\\u1ea1ch\"},{\"name\":\"L\\u00ea V\\u0103n C\",\"position\":\"Chuy\\u00ean gia k\\u1ef9 thu\\u1eadt\",\"image\":null,\"description\":\"K\\u1ef9 s\\u01b0 n\\u00f4ng nghi\\u1ec7p, chuy\\u00ean v\\u1ec1 h\\u1ec7 th\\u1ed1ng t\\u01b0\\u1edbi n\\u01b0\\u1edbc th\\u00f4ng minh\"},{\"name\":null,\"position\":null,\"image\":null,\"description\":null},{\"name\":null,\"position\":null,\"image\":null,\"description\":null}]', '[{\"title\":\"10,000+ kh\\u00e1ch h\\u00e0ng h\\u00e0i l\\u00f2ng\",\"description\":\"S\\u1ed1 l\\u01b0\\u1ee3ng kh\\u00e1ch h\\u00e0ng \\u0111\\u00e3 tin t\\u01b0\\u1edfng v\\u00e0 s\\u1eed d\\u1ee5ng d\\u1ecbch v\\u1ee5 c\\u1ee7a ch\\u00fang t\\u00f4i\"},{\"title\":\"50+ s\\u1ea3n ph\\u1ea9m ch\\u1ea5t l\\u01b0\\u1ee3ng\",\"description\":\"\\u0110a d\\u1ea1ng s\\u1ea3n ph\\u1ea9m t\\u1eeb d\\u1ee5ng c\\u1ee5 \\u0111\\u1ebfn c\\u00e2y tr\\u1ed3ng\"},{\"title\":\"100+ workshop \\u0111\\u00e3 t\\u1ed5 ch\\u1ee9c\",\"description\":\"Chia s\\u1ebb ki\\u1ebfn th\\u1ee9c v\\u00e0 kinh nghi\\u1ec7m l\\u00e0m v\\u01b0\\u1eddn\"},{\"title\":\"5 n\\u0103m kinh nghi\\u1ec7m\",\"description\":\"Th\\u1eddi gian ho\\u1ea1t \\u0111\\u1ed9ng v\\u00e0 ph\\u00e1t tri\\u1ec3n trong l\\u0129nh v\\u1ef1c l\\u00e0m v\\u01b0\\u1eddn\"}]', 'info@greengroves.com', '0123 456 789', '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh', '{\"facebook\":\"https:\\/\\/facebook.com\\/greengroves\",\"instagram\":\"https:\\/\\/instagram.com\\/greengroves\",\"youtube\":\"https:\\/\\/youtube.com\\/greengroves\",\"tiktok\":\"https:\\/\\/tiktok.com\\/@greengroves\"}', 1, '2025-09-25 17:33:35', '2025-09-25 17:50:53');

-- --------------------------------------------------------

--
-- Table structure for table `accessories`
--

CREATE TABLE `accessories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `is_waterproof` tinyint(1) NOT NULL DEFAULT 0,
  `is_durable` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accessories`
--

INSERT INTO `accessories` (`id`, `name`, `slug`, `description`, `price`, `image`, `category`, `material`, `size`, `color`, `brand`, `is_waterproof`, `is_durable`, `created_at`, `updated_at`) VALUES
(1, 'Găng tay làm vườn chống nước', 'gang-tay-lam-vuon-chong-nuoc', 'Găng tay làm vườn chống nước cao cấp, bảo vệ tay khỏi bụi bẩn, nước và các tác nhân gây hại. Chất liệu cotton pha polyester, thoáng khí và dễ giặt.', 45000.00, '/image.png', 'Bảo hộ', 'Cotton + Polyester', 'M', 'Xanh lá', 'Garden Pro', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(2, 'Găng tay làm vườn dài tay', 'gang-tay-lam-vuon-dai-tay', 'Găng tay làm vườn dài tay bảo vệ toàn bộ cánh tay, chống côn trùng và gai cây. Chất liệu bền chắc, phù hợp cho công việc nặng.', 65000.00, '/image.png', 'Bảo hộ', 'Canvas', 'L', 'Nâu', 'Heavy Duty', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(3, 'Kính bảo hộ làm vườn', 'kinh-bao-ho-lam-vuon', 'Kính bảo hộ chống bụi, côn trùng và tia UV. Thiết kế nhẹ, thoải mái và không bị mờ hơi. Phù hợp cho mọi hoạt động làm vườn.', 35000.00, '/image.png', 'Bảo hộ', 'Polycarbonate', 'One Size', 'Trong suốt', 'Safety First', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(4, 'Mũ nón làm vườn có lưới', 'mu-non-lam-vuon-co-luoi', 'Mũ nón làm vườn có lưới chống côn trùng, che nắng và bảo vệ đầu. Thiết kế thoáng khí, dây đeo có thể điều chỉnh.', 55000.00, '/image.png', 'Bảo hộ', 'Cotton + Lưới', 'L', 'Xanh lá', 'Sun Hat', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(5, 'Ủng cao su làm vườn', 'ung-cao-su-lam-vuon', 'Ủng cao su chống nước, dễ vệ sinh và bền chắc. Đế chống trượt, phù hợp cho mọi loại đất và thời tiết.', 120000.00, '/image.png', 'Giày dép', 'Cao su', '42', 'Xanh lá', 'Rubber Boot', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(6, 'Giày làm vườn thấp cổ', 'giay-lam-vuon-thap-co', 'Giày làm vườn thấp cổ thoải mái, chống nước và dễ vệ sinh. Đế chống trượt, phù hợp cho công việc nhẹ.', 85000.00, '/image.png', 'Giày dép', 'PVC', '40', 'Đen', 'Garden Shoe', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(7, 'Túi đựng dụng cụ làm vườn', 'tui-dung-dung-cu-lam-vuon', 'Túi đựng dụng cụ làm vườn có nhiều ngăn, dễ mang theo và tổ chức. Chất liệu bền chắc, chống nước nhẹ.', 75000.00, '/image.png', 'Túi đựng', 'Canvas', '30x20x15cm', 'Xanh rêu', 'Tool Bag', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(8, 'Xô nhựa đựng đất', 'xo-nhua-dung-dat', 'Xô nhựa đựng đất, phân bón hoặc nước. Có quai xách tiện lợi, dễ vệ sinh và bền chắc.', 45000.00, '/image.png', 'Container', 'Nhựa HDPE', '10 lít', 'Trắng', 'Plastic Bucket', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(9, 'Khay ươm cây con', 'khay-uom-cay-con', 'Khay ươm cây con có nhiều ô nhỏ, phù hợp cho việc gieo hạt và ươm cây con. Chất liệu nhựa bền, có lỗ thoát nước.', 35000.00, '/image.png', 'Container', 'Nhựa PP', '50 ô', 'Đen', 'Seed Tray', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(10, 'Dây buộc cây tự phân hủy', 'day-buoc-cay-tu-phan-huy', 'Dây buộc cây tự phân hủy thân thiện với môi trường. Bền chắc, dễ sử dụng và không gây hại cho cây trồng.', 25000.00, '/image.png', 'Dây buộc', 'Jute', '50m', 'Nâu', 'Eco Tie', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(11, 'Cọc treo cây leo', 'coc-treo-cay-leo', 'Cọc treo cây leo bằng tre tự nhiên, bền chắc và thân thiện với môi trường. Phù hợp cho cà chua, dưa chuột và các cây leo khác.', 15000.00, '/image.png', 'Hỗ trợ cây', 'Tre', '1.5m', 'Nâu', 'Bamboo Stake', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(12, 'Lưới che nắng cho cây', 'luoi-che-nang-cho-cay', 'Lưới che nắng cho cây giúp bảo vệ cây khỏi ánh nắng gay gắt. Chất liệu bền, chống tia UV và thoáng khí.', 95000.00, '/image.png', 'Bảo vệ cây', 'Polyethylene', '2x3m', 'Xanh lá', 'Shade Net', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(13, 'Nhãn cây bằng gỗ', 'nhan-cay-bang-go', 'Nhãn cây bằng gỗ tự nhiên, có thể viết bằng bút chì hoặc bút dạ. Bền chắc và thân thiện với môi trường.', 20000.00, '/image.png', 'Nhãn đánh dấu', 'Gỗ', '10x2cm', 'Nâu', 'Wood Label', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(14, 'Nhãn cây nhựa chống nước', 'nhan-cay-nhua-chong-nuoc', 'Nhãn cây nhựa chống nước, có thể viết bằng bút dạ và không bị phai màu. Dễ vệ sinh và tái sử dụng.', 15000.00, '/image.png', 'Nhãn đánh dấu', 'Nhựa PVC', '8x1.5cm', 'Trắng', 'Plastic Label', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(15, 'Bình xịt nước mini', 'binh-xit-nuoc-mini', 'Bình xịt nước mini tiện lợi cho việc tưới cây con và phun thuốc. Dung tích nhỏ gọn, dễ sử dụng.', 30000.00, '/image.png', 'Dụng cụ phụ trợ', 'Nhựa', '500ml', 'Xanh lá', 'Spray Bottle', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(16, 'Thước đo độ ẩm đất', 'thuoc-do-do-am-dat', 'Thước đo độ ẩm đất giúp kiểm tra độ ẩm của đất trồng. Thiết kế đơn giản, dễ sử dụng và chính xác.', 40000.00, '/image.png', 'Dụng cụ đo lường', 'Nhựa + Kim loại', '20cm', 'Vàng', 'Moisture Meter', 0, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(17, 'Băng keo làm vườn', 'bang-keo-lam-vuon', 'Băng keo làm vườn chuyên dụng, chống nước và bền chắc. Dùng để buộc cây, che vết thương hoặc đánh dấu.', 18000.00, '/image.png', 'Dụng cụ phụ trợ', 'PVC', '5cm x 10m', 'Xanh lá', 'Garden Tape', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(18, 'Đèn LED trang trí vườn', 'den-led-trang-tri-vuon', 'Đèn LED trang trí vườn chạy bằng năng lượng mặt trời. Tự động bật/tắt, tạo ánh sáng ấm áp cho khu vườn vào ban đêm.', 150000.00, '/image.png', 'Trang trí', 'Nhựa + LED', '30cm', 'Trắng', 'Solar Light', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02'),
(19, 'Tượng trang trí vườn nhỏ', 'tuong-trang-tri-vuon-nho', 'Tượng trang trí vườn nhỏ bằng gốm sứ, tạo điểm nhấn cho khu vườn. Thiết kế đẹp mắt, chống nước và bền chắc.', 85000.00, '/image.png', 'Trang trí', 'Gốm sứ', '15cm', 'Nhiều màu', 'Garden Decor', 1, 1, '2025-09-25 17:04:02', '2025-09-25 17:04:02');

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `body` longtext NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `author_id` bigint(20) UNSIGNED NOT NULL,
  `published_at` timestamp NULL DEFAULT NULL,
  `status` enum('draft','published') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `slug`, `excerpt`, `body`, `category_id`, `author_id`, `published_at`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Cách trồng cây xanh trong nhà', 'cach-trong-cay-xanh-trong-nha', 'Học cách trồng cây xanh trong nhà một cách hiệu quả, tạo không gian xanh mát và cải thiện chất lượng không khí', 'Trồng cây xanh trong nhà không chỉ giúp tạo không gian xanh mát mà còn cải thiện chất lượng không khí, giảm stress và tăng năng suất làm việc. Bài viết này sẽ hướng dẫn bạn từng bước cách chọn cây phù hợp với điều kiện ánh sáng trong nhà, chuẩn bị đất trồng, kỹ thuật tưới nước và chăm sóc cây trồng trong nhà. Chúng ta sẽ tìm hiểu về các loại cây dễ trồng như lưỡi hổ, trầu bà, cây kim tiền và cách tạo hệ thống tưới nước tự động.', 1, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(2, 'Kỹ thuật trồng rau sạch tại nhà', 'ky-thuat-trong-rau-sach-tai-nha', 'Hướng dẫn chi tiết cách trồng rau sạch tại nhà, từ chọn giống đến thu hoạch', 'Trồng rau sạch tại nhà là xu hướng được nhiều gia đình quan tâm. Bài viết này sẽ hướng dẫn bạn cách thiết kế vườn rau mini, chọn giống rau phù hợp với khí hậu, kỹ thuật gieo hạt, chăm sóc và thu hoạch. Chúng ta sẽ tìm hiểu về các loại rau dễ trồng như rau muống, rau cải, cà chua, ớt và cách phòng trừ sâu bệnh hại một cách tự nhiên.', 1, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(3, 'Cách trồng cây ăn quả trong chậu', 'cach-trong-cay-an-qua-trong-chau', 'Học cách trồng cây ăn quả trong chậu, tận dụng không gian nhỏ để có trái cây sạch', 'Trồng cây ăn quả trong chậu là giải pháp tuyệt vời cho những ai muốn có trái cây sạch nhưng không có đất vườn rộng. Bài viết này sẽ hướng dẫn bạn cách chọn giống cây phù hợp, kỹ thuật trồng, chăm sóc và tạo hình cho cây ăn quả trong chậu. Chúng ta sẽ tìm hiểu về các loại cây như chanh, ổi, táo, lê và cách tạo điều kiện tốt nhất cho cây phát triển.', 1, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(4, 'Kỹ thuật trồng hoa hồng', 'ky-thuat-trong-hoa-hong', 'Hướng dẫn chi tiết cách trồng và chăm sóc hoa hồng để có những bông hoa đẹp nhất', 'Hoa hồng là loài hoa được yêu thích nhất trên thế giới. Bài viết này sẽ hướng dẫn bạn cách chọn giống hoa hồng phù hợp, kỹ thuật trồng, chăm sóc, cắt tỉa và phòng trừ sâu bệnh. Chúng ta sẽ tìm hiểu về các loại hoa hồng phổ biến, cách tạo điều kiện ánh sáng và dinh dưỡng tốt nhất, kỹ thuật nhân giống và cách giữ hoa tươi lâu.', 1, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(5, 'Cách trồng cây thủy canh', 'cach-trong-cay-thuy-canh', 'Học cách trồng cây thủy canh, phương pháp trồng cây không cần đất hiện đại', 'Thủy canh là phương pháp trồng cây không cần đất, sử dụng dung dịch dinh dưỡng để cung cấp chất dinh dưỡng cho cây. Bài viết này sẽ hướng dẫn bạn cách thiết kế hệ thống thủy canh, chọn giống cây phù hợp, pha chế dung dịch dinh dưỡng và chăm sóc cây. Chúng ta sẽ tìm hiểu về các loại hệ thống thủy canh khác nhau và cách tối ưu hóa năng suất.', 1, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(6, 'Chọn đất trồng phù hợp', 'chon-dat-trong-phu-hop', 'Hướng dẫn chọn loại đất trồng tốt nhất cho từng loại cây', 'Đất trồng là nền tảng quan trọng cho sự phát triển của cây. Bài viết này sẽ giúp bạn hiểu về các loại đất khác nhau, cách cải thiện đất và chọn đất phù hợp cho từng loại cây trồng. Chúng ta sẽ tìm hiểu về đất sét, đất cát, đất thịt và cách pha trộn đất để tạo ra hỗn hợp đất lý tưởng.', 1, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(7, 'Kỹ thuật tưới nước cho cây', 'ky-thuat-tuoi-nuoc-cho-cay', 'Tìm hiểu cách tưới nước đúng cách cho cây trồng', 'Tưới nước là một trong những yếu tố quan trọng nhất trong việc chăm sóc cây trồng. Bài viết này sẽ hướng dẫn bạn các kỹ thuật tưới nước hiệu quả, thời điểm tưới nước phù hợp và cách nhận biết cây cần nước. Chúng ta sẽ tìm hiểu về các loại hệ thống tưới nước tự động, cách tiết kiệm nước và tạo điều kiện tốt nhất cho cây hấp thụ nước.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(8, 'Cách bón phân cho cây trồng', 'cach-bon-phan-cho-cay-trong', 'Hướng dẫn chi tiết cách bón phân cho cây trồng để cây phát triển tốt nhất', 'Bón phân là kỹ thuật quan trọng để cung cấp dinh dưỡng cho cây trồng. Bài viết này sẽ hướng dẫn bạn cách chọn loại phân phù hợp, thời điểm bón phân, kỹ thuật bón phân và cách tránh các lỗi thường gặp. Chúng ta sẽ tìm hiểu về các loại phân hữu cơ, phân vô cơ, phân vi sinh và cách tạo phân compost tại nhà.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(9, 'Cách cắt tỉa cây cảnh', 'cach-cat-tia-cay-canh', 'Học cách cắt tỉa cây cảnh để tạo hình đẹp và kích thích cây phát triển', 'Cắt tỉa là kỹ thuật quan trọng để tạo hình cho cây cảnh và kích thích cây phát triển. Bài viết này sẽ hướng dẫn bạn cách chọn thời điểm cắt tỉa, kỹ thuật cắt tỉa, dụng cụ cần thiết và cách chăm sóc sau khi cắt tỉa. Chúng ta sẽ tìm hiểu về các kiểu cắt tỉa khác nhau và cách tạo hình cho từng loại cây.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(10, 'Phòng trừ sâu bệnh cho cây', 'phong-tru-sau-benh-cho-cay', 'Các phương pháp phòng trừ sâu bệnh hiệu quả cho cây trồng', 'Sâu bệnh là vấn đề thường gặp khi trồng cây. Bài viết này sẽ hướng dẫn bạn cách nhận biết các loại sâu bệnh phổ biến, phương pháp phòng trừ tự nhiên và hóa học, giúp cây trồng luôn khỏe mạnh. Chúng ta sẽ tìm hiểu về các loại thuốc trừ sâu tự nhiên, cách tạo môi trường tốt cho cây và cách sử dụng các loại cây có tác dụng xua đuổi sâu bệnh.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(11, 'Cách chăm sóc cây trong mùa đông', 'cach-cham-soc-cay-trong-mua-dong', 'Hướng dẫn chăm sóc cây trồng trong mùa đông để cây sống sót và phát triển tốt', 'Mùa đông là thời điểm khó khăn cho cây trồng. Bài viết này sẽ hướng dẫn bạn cách bảo vệ cây khỏi lạnh, điều chỉnh chế độ tưới nước, bón phân và cách tạo môi trường ấm áp cho cây. Chúng ta sẽ tìm hiểu về các loại cây chịu lạnh, cách che chắn cây và chuẩn bị cây cho mùa đông.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(12, 'Cách nhân giống cây trồng', 'cach-nhan-giong-cay-trong', 'Học các phương pháp nhân giống cây trồng để có nhiều cây mới', 'Nhân giống cây trồng là kỹ thuật quan trọng để tạo ra nhiều cây mới từ cây mẹ. Bài viết này sẽ hướng dẫn bạn các phương pháp nhân giống như giâm cành, chiết cành, ghép cây và gieo hạt. Chúng ta sẽ tìm hiểu về thời điểm nhân giống, cách chọn cành giâm, kỹ thuật chiết cành và cách chăm sóc cây con.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(13, 'Dụng cụ làm vườn cần thiết', 'dung-cu-lam-vuon-can-thiet', 'Danh sách các dụng cụ làm vườn cơ bản mà mọi người làm vườn nên có', 'Để có một khu vườn đẹp và khỏe mạnh, bạn cần trang bị đầy đủ các dụng cụ làm vườn cần thiết. Bài viết này sẽ giới thiệu các loại dụng cụ cơ bản như cuốc, xẻng, kéo cắt cành, bình tưới nước, cách sử dụng và bảo quản chúng. Chúng ta sẽ tìm hiểu về các thương hiệu dụng cụ uy tín, cách chọn dụng cụ phù hợp và cách bảo trì để sử dụng lâu dài.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(14, 'Cách chọn và sử dụng kéo cắt cành', 'cach-chon-va-su-dung-keo-cat-canh', 'Hướng dẫn chi tiết cách chọn và sử dụng kéo cắt cành hiệu quả', 'Kéo cắt cành là dụng cụ quan trọng trong việc chăm sóc cây. Bài viết này sẽ hướng dẫn bạn cách chọn kéo cắt cành phù hợp, kỹ thuật sử dụng an toàn, cách bảo quản và bảo trì. Chúng ta sẽ tìm hiểu về các loại kéo cắt cành khác nhau, cách mài lưỡi kéo và cách sử dụng đúng cách để tránh làm tổn thương cây.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(15, 'Hệ thống tưới nước tự động cho vườn', 'he-thong-tuoi-nuoc-tu-dong-cho-vuon', 'Hướng dẫn thiết kế và lắp đặt hệ thống tưới nước tự động cho vườn', 'Hệ thống tưới nước tự động giúp tiết kiệm thời gian và đảm bảo cây được tưới nước đều đặn. Bài viết này sẽ hướng dẫn bạn cách thiết kế hệ thống tưới nước tự động, chọn thiết bị phù hợp, cách lắp đặt và vận hành. Chúng ta sẽ tìm hiểu về các loại hệ thống tưới nước khác nhau và cách tối ưu hóa hiệu quả.', 2, 1, '2025-09-25 16:41:04', 'published', '2025-09-25 16:41:04', '2025-09-25 16:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `article_tag`
--

CREATE TABLE `article_tag` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `article_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` decimal(3,1) NOT NULL DEFAULT 0.0,
  `buy_link` varchar(255) DEFAULT NULL,
  `borrowLink` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `slug`, `author`, `category`, `description`, `price`, `image`, `rating`, `buy_link`, `borrowLink`, `created_at`, `updated_at`) VALUES
(1, 'Nghệ thuật làm vườn - Hướng dẫn toàn diện', 'nghe-thuat-lam-vuon-huong-dan-toan-dien', 'Nguyễn Văn Hoa', 'Trồng trọt', 'Cuốn sách toàn diện về nghệ thuật làm vườn, từ những kiến thức cơ bản đến các kỹ thuật nâng cao. Phù hợp cho cả người mới bắt đầu và những người đã có kinh nghiệm.', 250000.00, '/image.png', 4.8, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(2, 'Cách trồng rau sạch tại nhà', 'cach-trong-rau-sach-tai-nha', 'Trần Thị Mai', 'Trồng trọt', 'Hướng dẫn chi tiết cách trồng rau sạch tại nhà với các kỹ thuật đơn giản và hiệu quả. Bao gồm cách thiết kế vườn rau mini và chăm sóc cây trồng.', 180000.00, '/image.png', 4.6, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(3, 'Kỹ thuật trồng cây ăn quả trong chậu', 'ky-thuat-trong-cay-an-qua-trong-chau', 'Lê Văn Đức', 'Trồng trọt', 'Hướng dẫn chi tiết cách trồng cây ăn quả trong chậu, từ chọn giống đến thu hoạch. Phù hợp cho những ai muốn có trái cây sạch nhưng không có đất vườn rộng.', 220000.00, '/image.png', 4.7, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(4, 'Bí quyết trồng hoa hồng đẹp nhất', 'bi-quyet-trong-hoa-hong-dep-nhat', 'Phạm Thị Lan', 'Trồng trọt', 'Bí quyết trồng và chăm sóc hoa hồng để có những bông hoa đẹp nhất. Bao gồm cách chọn giống, trồng cây, cắt tỉa và phòng trừ sâu bệnh.', 200000.00, '/image.png', 4.9, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(5, 'Hướng dẫn trồng cây thủy canh', 'huong-dan-trong-cay-thuy-canh', 'Nguyễn Minh Tuấn', 'Trồng trọt', 'Học cách trồng cây thủy canh - phương pháp trồng cây không cần đất hiện đại. Hướng dẫn thiết kế hệ thống thủy canh đơn giản tại nhà.', 300000.00, '/image.png', 4.5, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(6, 'Cách chăm sóc cây cảnh luôn xanh tươi', 'cach-cham-soc-cay-canh-luon-xanh-tuoi', 'Võ Thị Hương', 'Chăm sóc', 'Bí quyết chăm sóc cây cảnh để cây luôn xanh tươi và phát triển tốt. Bao gồm cách tưới nước, bón phân và tạo điều kiện tốt nhất cho cây.', 160000.00, '/image.png', 4.4, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(7, 'Kỹ thuật tưới nước hiệu quả cho cây trồng', 'ky-thuat-tuoi-nuoc-hieu-qua-cho-cay-trong', 'Đặng Văn Nam', 'Chăm sóc', 'Học cách tưới nước đúng cách cho từng loại cây. Hướng dẫn thời điểm tưới nước, lượng nước cần thiết và các kỹ thuật tưới nước hiệu quả.', 140000.00, '/image.png', 4.3, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(8, 'Cách bón phân cho cây trồng đúng cách', 'cach-bon-phan-cho-cay-trong-dung-cach', 'Bùi Thị Thu', 'Chăm sóc', 'Hướng dẫn chi tiết cách bón phân cho cây trồng để cây phát triển tốt nhất. Bao gồm các loại phân, thời điểm bón phân và kỹ thuật bón phân.', 170000.00, '/image.png', 4.6, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(9, 'Kỹ thuật cắt tỉa cây cảnh chuyên nghiệp', 'ky-thuat-cat-tia-cay-canh-chuyen-nghiep', 'Hoàng Văn Long', 'Chăm sóc', 'Học cách cắt tỉa cây cảnh để tạo hình đẹp và kích thích cây phát triển. Hướng dẫn các kỹ thuật cắt tỉa cơ bản và nâng cao.', 190000.00, '/image.png', 4.7, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(10, 'Cách phòng trừ sâu bệnh cho cây trồng', 'cach-phong-tru-sau-benh-cho-cay-trong', 'Lý Thị Hoa', 'Chăm sóc', 'Hướng dẫn cách phòng trừ sâu bệnh cho cây trồng một cách tự nhiên và hiệu quả. Bao gồm cách nhận biết sâu bệnh và các phương pháp xử lý.', 210000.00, '/image.png', 4.8, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(11, 'Dụng cụ làm vườn cần thiết cho người mới bắt đầu', 'dung-cu-lam-vuon-can-thiet-cho-nguoi-moi-bat-dau', 'Trương Văn Minh', 'Dụng cụ', 'Giới thiệu các dụng cụ làm vườn cơ bản mà mọi người làm vườn nên có. Hướng dẫn cách chọn và sử dụng dụng cụ hiệu quả.', 120000.00, '/image.png', 4.2, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(12, 'Cách sử dụng kéo cắt cành an toàn và hiệu quả', 'cach-su-dung-keo-cat-canh-an-toan-va-hieu-qua', 'Ngô Thị Linh', 'Dụng cụ', 'Hướng dẫn chi tiết cách sử dụng kéo cắt cành an toàn và hiệu quả. Bao gồm cách chọn kéo phù hợp và kỹ thuật cắt tỉa đúng cách.', 130000.00, '/image.png', 4.4, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(13, 'Hệ thống tưới nước tự động cho vườn nhà', 'he-thong-tuoi-nuoc-tu-dong-cho-vuon-nha', 'Vũ Văn Hùng', 'Dụng cụ', 'Hướng dẫn thiết kế và lắp đặt hệ thống tưới nước tự động cho vườn nhà. Bao gồm cách chọn thiết bị và lắp đặt hệ thống.', 280000.00, '/image.png', 4.6, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(14, 'Chọn đất trồng phù hợp cho từng loại cây', 'chon-dat-trong-phu-hop-cho-tung-loai-cay', 'Đinh Thị Mai', 'Đất trồng', 'Hướng dẫn chọn loại đất trồng tốt nhất cho từng loại cây. Bao gồm các loại đất khác nhau và cách cải thiện đất trồng.', 150000.00, '/image.png', 4.5, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(15, 'Cách làm phân compost tại nhà', 'cach-lam-phan-compost-tai-nha', 'Phan Văn Đức', 'Đất trồng', 'Hướng dẫn chi tiết cách làm phân compost tại nhà từ rác thải hữu cơ. Bao gồm các bước làm phân compost và cách sử dụng hiệu quả.', 110000.00, '/image.png', 4.3, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(16, 'Cách đo và điều chỉnh pH đất', 'cach-do-va-dieu-chinh-ph-dat', 'Lê Thị Hương', 'Đất trồng', 'Học cách đo và điều chỉnh pH đất để tạo điều kiện tốt nhất cho cây trồng. Hướng dẫn sử dụng máy đo pH và các phương pháp điều chỉnh.', 160000.00, '/image.png', 4.4, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(17, 'Cách chăm sóc cây trong mùa đông', 'cach-cham-soc-cay-trong-mua-dong', 'Nguyễn Văn Tùng', 'Chăm sóc', 'Hướng dẫn chăm sóc cây trồng trong mùa đông để cây sống sót và phát triển tốt. Bao gồm cách bảo vệ cây khỏi lạnh và tạo môi trường ấm áp.', 140000.00, '/image.png', 4.2, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(18, 'Cách chuẩn bị vườn cho mùa xuân', 'cach-chuan-bi-vuon-cho-mua-xuan', 'Trần Văn Hải', 'Trồng trọt', 'Hướng dẫn chuẩn bị vườn cho mùa xuân để có một mùa trồng trọt thành công. Bao gồm cách làm đất, chọn giống và lập kế hoạch trồng trọt.', 130000.00, '/image.png', 4.1, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(19, 'Cách chăm sóc cây trong mùa hè nắng nóng', 'cach-cham-soc-cay-trong-mua-he-nang-nong', 'Võ Thị Lan', 'Chăm sóc', 'Hướng dẫn chăm sóc cây trồng trong mùa hè nắng nóng để cây không bị héo và phát triển tốt. Bao gồm cách tưới nước và che chắn cây.', 150000.00, '/image.png', 4.3, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(20, 'Cách nhân giống cây trồng bằng giâm cành', 'cach-nhan-giong-cay-trong-bang-giam-canh', 'Đặng Văn Thành', 'Nhân giống', 'Hướng dẫn chi tiết cách nhân giống cây trồng bằng phương pháp giâm cành. Bao gồm cách chọn cành giâm, chuẩn bị và chăm sóc cây con.', 170000.00, '/image.png', 4.6, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(21, 'Kỹ thuật chiết cành cây ăn quả', 'ky-thuat-chiet-canh-cay-an-qua', 'Bùi Văn Dũng', 'Nhân giống', 'Học kỹ thuật chiết cành cây ăn quả để có cây con khỏe mạnh. Hướng dẫn từng bước cách chiết cành và chăm sóc cây con.', 200000.00, '/image.png', 4.7, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33'),
(22, 'Cách gieo hạt và chăm sóc cây con', 'cach-gieo-hat-va-cham-soc-cay-con', 'Lý Văn Hùng', 'Nhân giống', 'Hướng dẫn chi tiết cách gieo hạt và chăm sóc cây con từ khi nảy mầm đến khi trưởng thành. Bao gồm các kỹ thuật gieo hạt và chăm sóc cây con.', 180000.00, '/image.png', 4.5, 'https://example.com/buy', 'https://example.com/borrow', '2025-09-25 16:57:33', '2025-09-25 16:57:33');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'Trồng trọt', 'trong-trot', NULL, '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(2, 'Chăm sóc', 'cham-soc', NULL, '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(3, 'Dụng cụ', 'dung-cu', NULL, '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(4, 'Hướng dẫn', 'huong-dan', NULL, '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(5, 'Sách', 'sach', NULL, '2025-09-25 16:41:04', '2025-09-25 16:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('unread','read','replied') NOT NULL DEFAULT 'unread',
  `admin_reply` text DEFAULT NULL,
  `replied_at` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `status`, `admin_reply`, `replied_at`, `ip_address`, `user_agent`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@example.com', 'Test Subject', 'Test message', 'unread', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.6584', '2025-09-25 17:54:19', '2025-09-25 17:54:19'),
(2, 'Test User 2', 'test2@example.com', 'Test Subject 2', 'Test message 2', 'unread', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.6584', '2025-09-25 17:58:56', '2025-09-25 17:58:56'),
(3, 'Test User 3', 'test3@example.com', 'Test from About Us', 'Test message from About Us page', 'unread', NULL, NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.6584', '2025-09-25 18:03:08', '2025-09-25 18:03:08');

-- --------------------------------------------------------

--
-- Table structure for table `essentials`
--

CREATE TABLE `essentials` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `weight` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `details_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details_json`)),
  `season` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `essentials`
--

INSERT INTO `essentials` (`id`, `type`, `name`, `slug`, `description`, `price`, `image`, `category`, `weight`, `brand`, `details_json`, `season`, `created_at`, `updated_at`) VALUES
(1, 'fertilizer', 'Phân bón hữu cơ 100% tự nhiên', 'phan-bon-huu-co-100-tu-nhien', 'Phân bón hữu cơ 100% tự nhiên được làm từ phân động vật và chất hữu cơ, cung cấp dinh dưỡng đầy đủ cho cây trồng. An toàn cho sức khỏe và thân thiện với môi trường.', 80000.00, '/image.png', 'Phân bón', '1kg', 'GreenGarden', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(2, 'fertilizer', 'Phân NPK 20-20-20', 'phan-npk-20-20-20', 'Phân NPK 20-20-20 với tỷ lệ cân bằng nitơ, photpho và kali, phù hợp cho hầu hết các loại cây trồng. Giúp cây phát triển khỏe mạnh và cho năng suất cao.', 120000.00, '/image.png', 'Phân bón', '500g', 'Fertilizer Pro', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(3, 'fertilizer', 'Phân bón lá hữu cơ', 'phan-bon-la-huu-co', 'Phân bón lá hữu cơ dạng lỏng, dễ hấp thụ qua lá. Cung cấp dinh dưỡng nhanh chóng cho cây trồng, giúp cây xanh tươi và phát triển tốt.', 60000.00, '/image.png', 'Phân bón', '500ml', 'Leaf Feed', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(4, 'fertilizer', 'Phân vi sinh EM', 'phan-vi-sinh-em', 'Phân vi sinh EM chứa các vi khuẩn có lợi, giúp cải thiện đất và tăng cường sức đề kháng cho cây trồng. An toàn và hiệu quả cao.', 90000.00, '/image.png', 'Phân bón', '1 lít', 'MicroBio', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(5, 'soil', 'Đất trồng cây cảnh cao cấp', 'dat-trong-cay-canh-cao-cap', 'Đất trồng cây cảnh cao cấp được pha trộn từ đất sạch, phân hữu cơ và các chất dinh dưỡng cần thiết. Tơi xốp, thoát nước tốt và giàu dinh dưỡng.', 50000.00, '/image.png', 'Đất trồng', '5kg', 'Premium Soil', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(6, 'soil', 'Đất trồng rau sạch', 'dat-trong-rau-sach', 'Đất trồng rau sạch chuyên dụng, không chứa hóa chất độc hại. Phù hợp cho việc trồng rau sạch tại nhà, đảm bảo an toàn cho sức khỏe.', 45000.00, '/image.png', 'Đất trồng', '3kg', 'Clean Garden', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(7, 'soil', 'Đất trồng cây ăn quả', 'dat-trong-cay-an-qua', 'Đất trồng cây ăn quả chuyên dụng với độ pH phù hợp và giàu dinh dưỡng. Giúp cây ăn quả phát triển khỏe mạnh và cho năng suất cao.', 60000.00, '/image.png', 'Đất trồng', '10kg', 'Fruit Garden', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(8, 'soil', 'Đất trồng hoa hồng', 'dat-trong-hoa-hong', 'Đất trồng hoa hồng chuyên dụng với độ pH 6.0-6.5, tơi xốp và thoát nước tốt. Giúp hoa hồng phát triển khỏe mạnh và cho hoa đẹp.', 55000.00, '/image.png', 'Đất trồng', '4kg', 'Rose Garden', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(9, 'seed', 'Hạt giống rau muống', 'hat-giong-rau-muong', 'Hạt giống rau muống chất lượng cao, tỷ lệ nảy mầm trên 90%. Dễ trồng, nhanh thu hoạch và cho năng suất cao. Phù hợp cho người mới bắt đầu.', 15000.00, '/image.png', 'Hạt giống', '50g', 'Seed Master', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(10, 'seed', 'Hạt giống cà chua cherry', 'hat-giong-ca-chua-cherry', 'Hạt giống cà chua cherry ngọt ngon, quả nhỏ và đẹp mắt. Dễ trồng trong chậu, phù hợp cho vườn nhà. Cho năng suất cao và liên tục.', 25000.00, '/image.png', 'Hạt giống', '20 hạt', 'Tomato Pro', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(11, 'seed', 'Hạt giống ớt hiểm', 'hat-giong-ot-hiem', 'Hạt giống ớt hiểm cay nồng, dễ trồng và chăm sóc. Cây khỏe mạnh, cho quả nhiều và liên tục. Phù hợp cho việc trồng trong chậu hoặc vườn.', 20000.00, '/image.png', 'Hạt giống', '30 hạt', 'Spicy Garden', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(12, 'seed', 'Hạt giống hoa hướng dương', 'hat-giong-hoa-huong-duong', 'Hạt giống hoa hướng dương cao lớn, hoa to và đẹp. Dễ trồng, nhanh nở hoa và tạo điểm nhấn cho khu vườn. Phù hợp cho vườn lớn.', 30000.00, '/image.png', 'Hạt giống', '10 hạt', 'Sunflower King', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(13, 'pesticide', 'Thuốc trừ sâu sinh học', 'thuoc-tru-sau-sinh-hoc', 'Thuốc trừ sâu sinh học an toàn cho sức khỏe và môi trường. Hiệu quả cao trong việc phòng trừ sâu bệnh hại cây trồng. Không gây độc hại cho người và động vật.', 70000.00, '/image.png', 'Bảo vệ cây', '250ml', 'BioSafe', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(14, 'pesticide', 'Thuốc trừ nấm bệnh', 'thuoc-tru-nam-benh', 'Thuốc trừ nấm bệnh hiệu quả cao, phòng và trị các bệnh nấm phổ biến trên cây trồng. An toàn cho cây và môi trường, dễ sử dụng.', 80000.00, '/image.png', 'Bảo vệ cây', '200ml', 'Fungicide Pro', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48'),
(15, 'pesticide', 'Chất kích thích tăng trưởng', 'chat-kich-thich-tang-truong', 'Chất kích thích tăng trưởng tự nhiên, giúp cây phát triển nhanh và khỏe mạnh. Tăng cường sức đề kháng và khả năng chống chịu của cây.', 100000.00, '/image.png', 'Bảo vệ cây', '100ml', 'Growth Plus', NULL, NULL, '2025-09-25 16:58:48', '2025-09-25 16:58:48');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_09_23_165956_create_personal_access_tokens_table', 1),
(5, '2025_09_23_171108_create_categories_table', 1),
(6, '2025_09_23_171118_create_articles_table', 1),
(7, '2025_09_23_171131_create_tags_table', 1),
(8, '2025_09_23_171140_create_article_tag_table', 1),
(9, '2025_09_23_171150_create_tools_table', 1),
(10, '2025_09_23_171160_create_essentials_table', 1),
(11, '2025_09_23_171170_create_pots_table', 1),
(12, '2025_09_23_171180_create_videos_table', 1),
(13, '2025_09_23_171190_create_books_table', 1),
(14, '2025_09_23_171200_create_site_settings_table', 1),
(15, '2025_09_23_171210_create_visitor_stats_table', 1),
(16, '2025_09_25_165626_add_missing_columns_to_books_table', 2),
(17, '2025_09_25_165645_add_missing_columns_to_essentials_table', 2),
(18, '2025_09_25_165701_add_missing_columns_to_pots_table', 2),
(19, '2025_09_25_170159_create_accessories_table', 3),
(20, '2025_09_25_170555_create_suggestions_table', 4),
(21, '2025_09_25_173138_create_about_us_table', 5),
(22, '2025_09_25_174846_create_contact_messages_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pots`
--

CREATE TABLE `pots` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `drainage_holes` tinyint(1) NOT NULL DEFAULT 1,
  `color` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `dimensions` varchar(255) DEFAULT NULL,
  `material` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pots`
--

INSERT INTO `pots` (`id`, `name`, `slug`, `description`, `price`, `size`, `drainage_holes`, `color`, `brand`, `dimensions`, `material`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Chậu đất nung tròn cỡ lớn', 'chau-dat-nung-tron-co-lon', 'Chậu đất nung tròn cỡ lớn với đường kính 30cm, cao 25cm. Chất liệu đất nung tự nhiên, thoát nước tốt và giữ ẩm cho cây. Phù hợp cho cây cảnh lớn và cây ăn quả.', 150000.00, '30cm x 25cm', 1, 'Nâu đỏ', 'Terracotta Pro', NULL, 'Đất nung', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(2, 'Chậu đất nung vuông cỡ vừa', 'chau-dat-nung-vuong-co-vua', 'Chậu đất nung vuông cỡ vừa 20x20x18cm, thiết kế vuông vức hiện đại. Chất liệu đất nung cao cấp, bền đẹp và thân thiện với môi trường. Phù hợp cho cây cảnh vừa và nhỏ.', 120000.00, '20cm x 20cm x 18cm', 1, 'Nâu đỏ', 'Terracotta Pro', NULL, 'Đất nung', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(3, 'Chậu đất nung mini', 'chau-dat-nung-mini', 'Chậu đất nung mini 10cm x 8cm, phù hợp cho cây cảnh nhỏ, cây bonsai và cây con. Chất liệu đất nung tự nhiên, thoát nước tốt và giữ ẩm.', 25000.00, '10cm x 8cm', 1, 'Nâu đỏ', 'Terracotta Pro', NULL, 'Đất nung', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(4, 'Chậu nhựa tròn đa năng', 'chau-nhua-tron-da-nang', 'Chậu nhựa tròn đa năng với đường kính 25cm, cao 20cm. Chất liệu nhựa PP cao cấp, bền đẹp và không độc hại. Nhiều màu sắc đẹp mắt, phù hợp cho mọi loại cây.', 80000.00, '25cm x 20cm', 1, 'Nhiều màu', 'Plastic Garden', NULL, 'Nhựa PP', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(5, 'Chậu nhựa vuông cao cấp', 'chau-nhua-vuong-cao-cap', 'Chậu nhựa vuông cao cấp 30x30x25cm, thiết kế hiện đại và sang trọng. Chất liệu nhựa ABS bền đẹp, chống tia UV và thời tiết. Phù hợp cho cây cảnh lớn và cây ăn quả.', 150000.00, '30cm x 30cm x 25cm', 1, 'Đen', 'Premium Plastic', NULL, 'Nhựa ABS', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(6, 'Chậu nhựa treo', 'chau-nhua-treo', 'Chậu nhựa treo với dây treo chắc chắn, đường kính 18cm. Thiết kế đẹp mắt, phù hợp cho việc treo cây cảnh trong nhà và ngoài vườn. Tiết kiệm không gian.', 60000.00, '18cm x 15cm', 1, 'Xanh lá', 'Hanging Pot', NULL, 'Nhựa PP', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(7, 'Chậu gốm sứ tráng men', 'chau-gom-su-trang-men', 'Chậu gốm sứ tráng men với hoa văn đẹp mắt, đường kính 22cm, cao 18cm. Chất liệu gốm sứ cao cấp, bền đẹp và sang trọng. Phù hợp cho cây cảnh trang trí trong nhà.', 200000.00, '22cm x 18cm', 1, 'Trắng hoa văn', 'Ceramic Art', NULL, 'Gốm sứ', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(8, 'Chậu gốm sứ màu xanh', 'chau-gom-su-mau-xanh', 'Chậu gốm sứ màu xanh đẹp mắt, thiết kế tròn cổ điển. Chất liệu gốm sứ cao cấp, bền đẹp và thân thiện với môi trường. Phù hợp cho cây cảnh và cây hoa.', 180000.00, '20cm x 16cm', 1, 'Xanh lá', 'Ceramic Art', NULL, 'Gốm sứ', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(9, 'Chậu composite hiện đại', 'chau-composite-hien-dai', 'Chậu composite hiện đại với thiết kế vuông vức, kích thước 35x35x30cm. Chất liệu composite bền đẹp, chống tia UV và thời tiết. Phù hợp cho cây cảnh lớn và cây ăn quả.', 300000.00, '35cm x 35cm x 30cm', 1, 'Xám', 'Modern Pot', NULL, 'Composite', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(10, 'Chậu composite tròn', 'chau-composite-tron', 'Chậu composite tròn với đường kính 28cm, cao 24cm. Chất liệu composite cao cấp, bền đẹp và dễ vệ sinh. Phù hợp cho cây cảnh vừa và cây hoa.', 250000.00, '28cm x 24cm', 1, 'Đen', 'Modern Pot', NULL, 'Composite', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(11, 'Chậu thủy tinh trong suốt', 'chau-thuy-tinh-trong-suot', 'Chậu thủy tinh trong suốt với thiết kế đẹp mắt, đường kính 15cm, cao 12cm. Phù hợp cho cây thủy sinh và cây cảnh nhỏ. Dễ quan sát rễ cây và mực nước.', 100000.00, '15cm x 12cm', 0, 'Trong suốt', 'Glass Garden', NULL, 'Thủy tinh', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(12, 'Chậu thủy tinh có nắp', 'chau-thuy-tinh-co-nap', 'Chậu thủy tinh có nắp với thiết kế kín, đường kính 12cm, cao 10cm. Phù hợp cho cây thủy sinh và tạo môi trường ẩm ướt cho cây. Dễ vệ sinh và bảo quản.', 120000.00, '12cm x 10cm', 0, 'Trong suốt', 'Glass Garden', NULL, 'Thủy tinh', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(13, 'Chậu gỗ tự nhiên', 'chau-go-tu-nhien', 'Chậu gỗ tự nhiên với thiết kế vuông vức, kích thước 25x25x20cm. Chất liệu gỗ tự nhiên, thân thiện với môi trường và bền đẹp. Phù hợp cho cây cảnh và cây hoa.', 180000.00, '25cm x 25cm x 20cm', 1, 'Nâu gỗ', 'Wooden Pot', NULL, 'Gỗ tự nhiên', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(14, 'Chậu gỗ tròn', 'chau-go-tron', 'Chậu gỗ tròn với đường kính 20cm, cao 16cm. Chất liệu gỗ tự nhiên, thiết kế đẹp mắt và thân thiện với môi trường. Phù hợp cho cây cảnh nhỏ và cây hoa.', 150000.00, '20cm x 16cm', 1, 'Nâu gỗ', 'Wooden Pot', NULL, 'Gỗ tự nhiên', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(15, 'Chậu đá granite', 'chau-da-granite', 'Chậu đá granite với thiết kế vuông vức, kích thước 30x30x25cm. Chất liệu đá granite tự nhiên, bền đẹp và sang trọng. Phù hợp cho cây cảnh lớn và cây ăn quả.', 500000.00, '30cm x 30cm x 25cm', 1, 'Xám đá', 'Stone Garden', NULL, 'Đá granite', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(16, 'Chậu đá marble', 'chau-da-marble', 'Chậu đá marble với thiết kế tròn, đường kính 25cm, cao 20cm. Chất liệu đá marble tự nhiên, bền đẹp và sang trọng. Phù hợp cho cây cảnh trang trí trong nhà.', 400000.00, '25cm x 20cm', 1, 'Trắng vân', 'Stone Garden', NULL, 'Đá marble', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(17, 'Chậu treo macrame', 'chau-treo-macrame', 'Chậu treo macrame với dây treo đan tay đẹp mắt, đường kính 18cm. Thiết kế bohemian, phù hợp cho việc treo cây cảnh trong nhà. Tiết kiệm không gian và tạo điểm nhấn.', 80000.00, '18cm x 15cm', 1, 'Nâu dây', 'Hanging Art', NULL, 'Macrame + Nhựa', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(18, 'Chậu treo kim loại', 'chau-treo-kim-loai', 'Chậu treo kim loại với dây treo bằng thép không gỉ, đường kính 16cm. Thiết kế hiện đại, bền đẹp và dễ vệ sinh. Phù hợp cho việc treo cây cảnh ngoài trời.', 120000.00, '16cm x 14cm', 1, 'Bạc', 'Metal Hanging', NULL, 'Thép + Nhựa', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(19, 'Chậu thông minh tự tưới nước', 'chau-thong-minh-tu-tuoi-nuoc', 'Chậu thông minh tự tưới nước với hệ thống tưới nước tự động, kích thước 25x25x20cm. Giúp cây luôn có đủ nước mà không cần tưới thường xuyên. Phù hợp cho người bận rộn.', 350000.00, '25cm x 25cm x 20cm', 1, 'Trắng', 'Smart Pot', NULL, 'Nhựa + Hệ thống tưới', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51'),
(20, 'Chậu thông minh có đèn LED', 'chau-thong-minh-co-den-led', 'Chậu thông minh có đèn LED với hệ thống chiếu sáng LED, kích thước 20x20x18cm. Giúp cây phát triển tốt trong điều kiện thiếu ánh sáng. Phù hợp cho cây cảnh trong nhà.', 400000.00, '20cm x 20cm x 18cm', 1, 'Trắng', 'Smart Pot', NULL, 'Nhựa + LED', '/image.png', '2025-09-25 16:58:51', '2025-09-25 16:58:51');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suggestions`
--

CREATE TABLE `suggestions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` text NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `difficulty_level` varchar(255) NOT NULL DEFAULT 'beginner',
  `season` varchar(255) DEFAULT NULL,
  `plant_type` varchar(255) DEFAULT NULL,
  `estimated_time` int(11) DEFAULT NULL,
  `rating` decimal(3,1) NOT NULL DEFAULT 0.0,
  `views` int(11) NOT NULL DEFAULT 0,
  `likes` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suggestions`
--

INSERT INTO `suggestions` (`id`, `title`, `slug`, `description`, `content`, `category`, `difficulty_level`, `season`, `plant_type`, `estimated_time`, `rating`, `views`, `likes`, `image`, `tags`, `is_featured`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'Cách bắt đầu làm vườn cho người mới', 'cach-bat-dau-lam-vuon-cho-nguoi-moi', 'Hướng dẫn chi tiết từ A-Z cho những người mới bắt đầu làm vườn, từ việc chọn vị trí đến chăm sóc cây trồng.', 'Làm vườn là một hoạt động thú vị và bổ ích, nhưng đối với người mới bắt đầu, việc này có thể khá khó khăn. Bài viết này sẽ hướng dẫn bạn từng bước cách bắt đầu làm vườn một cách hiệu quả.\\n\\n1. Chọn vị trí phù hợp:\\n- Tìm nơi có ánh sáng mặt trời ít nhất 6 giờ/ngày\\n- Đảm bảo có hệ thống thoát nước tốt\\n- Tránh nơi có gió mạnh\\n\\n2. Chuẩn bị đất trồng:\\n- Làm tơi đất và loại bỏ cỏ dại\\n- Thêm phân hữu cơ để cải thiện chất lượng đất\\n- Kiểm tra độ pH của đất\\n\\n3. Chọn cây trồng phù hợp:\\n- Bắt đầu với các loại cây dễ trồng như rau muống, cà chua\\n- Chọn cây phù hợp với khí hậu địa phương\\n- Tránh chọn quá nhiều loại cây cùng lúc\\n\\n4. Chăm sóc hàng ngày:\\n- Tưới nước đều đặn nhưng không quá nhiều\\n- Kiểm tra sâu bệnh thường xuyên\\n- Cắt tỉa cây khi cần thiết\\n\\n5. Thu hoạch và tận hưởng:\\n- Thu hoạch đúng thời điểm\\n- Lưu trữ và sử dụng sản phẩm\\n- Lên kế hoạch cho vụ mùa tiếp theo', 'Hướng dẫn cơ bản', 'beginner', 'all', 'both', 30, 4.8, 1250, 89, '/image.png', '[\"ng\\u01b0\\u1eddi m\\u1edbi\",\"h\\u01b0\\u1edbng d\\u1eabn\",\"c\\u01a1 b\\u1ea3n\",\"l\\u00e0m v\\u01b0\\u1eddn\"]', 1, 1, '2025-09-25 17:11:16', '2025-09-25 17:11:16'),
(2, '10 loại cây dễ trồng nhất cho người mới', '10-loai-cay-de-trong-nhat-cho-nguoi-moi', 'Danh sách 10 loại cây dễ trồng, ít cần chăm sóc và phù hợp cho những người mới bắt đầu làm vườn.', 'Khi mới bắt đầu làm vườn, việc chọn đúng loại cây trồng rất quan trọng. Dưới đây là 10 loại cây dễ trồng nhất:\\n\\n1. Rau muống:\\n- Dễ trồng, nhanh thu hoạch\\n- Chịu được nhiều loại đất\\n- Có thể trồng quanh năm\\n\\n2. Cà chua cherry:\\n- Quả nhỏ, ngọt ngon\\n- Dễ trồng trong chậu\\n- Cho năng suất cao\\n\\n3. Rau cải:\\n- Thời gian sinh trưởng ngắn\\n- Chứa nhiều vitamin\\n- Dễ chế biến\\n\\n4. Hành lá:\\n- Trồng từ củ hành\\n- Thu hoạch liên tục\\n- Ít sâu bệnh\\n\\n5. Rau diếp:\\n- Lá giòn, ngon\\n- Trồng được quanh năm\\n- Dễ chăm sóc', 'Cây trồng', 'beginner', 'all', 'both', 20, 4.6, 980, 67, '/image.png', '[\"c\\u00e2y d\\u1ec5 tr\\u1ed3ng\",\"ng\\u01b0\\u1eddi m\\u1edbi\",\"rau c\\u1ee7\",\"danh s\\u00e1ch\"]', 1, 1, '2025-09-25 17:11:16', '2025-09-25 17:11:16'),
(3, 'Cách tạo vườn rau sạch tại nhà', 'cach-tao-vuon-rau-sach-tai-nha', 'Hướng dẫn chi tiết cách tạo một vườn rau sạch tại nhà, từ thiết kế không gian đến chăm sóc và thu hoạch.', 'Tạo vườn rau sạch tại nhà không chỉ giúp bạn có nguồn thực phẩm an toàn mà còn tiết kiệm chi phí và tạo không gian xanh mát.\\n\\n1. Lập kế hoạch:\\n- Xác định diện tích có thể sử dụng\\n- Chọn vị trí có ánh sáng tốt\\n- Lên danh sách các loại rau muốn trồng\\n\\n2. Chuẩn bị không gian:\\n- Làm sạch khu vực trồng\\n- Tạo luống hoặc sử dụng chậu\\n- Lắp đặt hệ thống tưới nước\\n\\n3. Chuẩn bị đất trồng:\\n- Mua đất sạch, không chứa hóa chất\\n- Trộn thêm phân hữu cơ\\n- Kiểm tra độ pH phù hợp', 'Vườn rau', 'intermediate', 'all', 'outdoor', 45, 4.7, 1100, 78, '/image.png', '[\"v\\u01b0\\u1eddn rau\",\"rau s\\u1ea1ch\",\"t\\u1ea1i nh\\u00e0\",\"h\\u01b0\\u1edbng d\\u1eabn\"]', 0, 1, '2025-09-25 17:11:16', '2025-09-25 17:11:16'),
(4, 'Làm vườn mùa xuân: Những việc cần làm', 'lam-vuon-mua-xuan-nhung-viec-can-lam', 'Danh sách các công việc cần làm trong vườn vào mùa xuân để chuẩn bị cho một mùa trồng trọt thành công.', 'Mùa xuân là thời điểm lý tưởng để bắt đầu một mùa trồng trọt mới. Dưới đây là những việc cần làm:\\n\\n1. Dọn dẹp vườn:\\n- Loại bỏ lá khô và cành chết\\n- Làm sạch luống trồng\\n- Kiểm tra và sửa chữa dụng cụ\\n\\n2. Chuẩn bị đất:\\n- Làm tơi đất\\n- Thêm phân hữu cơ\\n- Kiểm tra độ ẩm và pH\\n\\n3. Gieo hạt:\\n- Gieo hạt trong nhà\\n- Chuẩn bị cây con\\n- Lên kế hoạch trồng', 'Theo mùa', 'intermediate', 'spring', 'both', 60, 4.5, 850, 56, '/image.png', '[\"m\\u00f9a xu\\u00e2n\",\"chu\\u1ea9n b\\u1ecb\",\"k\\u1ebf ho\\u1ea1ch\",\"theo m\\u00f9a\"]', 0, 1, '2025-09-25 17:11:16', '2025-09-25 17:11:16'),
(5, 'Kỹ thuật nhân giống cây trồng', 'ky-thuat-nhan-giong-cay-trong', 'Hướng dẫn các phương pháp nhân giống cây trồng hiệu quả, từ gieo hạt đến chiết cành.', 'Nhân giống cây trồng là kỹ thuật quan trọng giúp tăng số lượng cây và duy trì đặc tính tốt.\\n\\n1. Nhân giống bằng hạt:\\n- Chọn hạt giống chất lượng\\n- Xử lý hạt trước khi gieo\\n- Tạo môi trường ẩm ướt\\n- Chăm sóc cây con\\n\\n2. Nhân giống bằng cành:\\n- Chọn cành khỏe mạnh\\n- Cắt cành đúng cách\\n- Xử lý hormone kích thích\\n- Trồng trong môi trường phù hợp', 'Kỹ thuật', 'advanced', 'all', 'both', 90, 4.9, 650, 42, '/image.png', '[\"nh\\u00e2n gi\\u1ed1ng\",\"k\\u1ef9 thu\\u1eadt\",\"chi\\u1ebft c\\u00e0nh\",\"gh\\u00e9p c\\u00e2y\"]', 1, 1, '2025-09-25 17:11:16', '2025-09-25 17:11:16'),
(6, 'Thiết kế vườn đẹp cho không gian nhỏ', 'thiet-ke-vuon-dep-cho-khong-gian-nho', 'Các ý tưởng thiết kế vườn đẹp và tiết kiệm không gian cho những ngôi nhà có diện tích hạn chế.', 'Không cần có sân vườn rộng lớn, bạn vẫn có thể tạo ra một khu vườn đẹp và hiệu quả.\\n\\n1. Vườn thẳng đứng:\\n- Sử dụng giàn leo\\n- Trồng cây trong chậu treo\\n- Tạo tường cây xanh\\n\\n2. Vườn ban công:\\n- Sử dụng chậu nhỏ gọn\\n- Trồng cây thảo mộc\\n- Tạo không gian xanh\\n\\n3. Vườn sân thượng:\\n- Sử dụng chậu lớn\\n- Trồng cây ăn quả\\n- Tạo khu vực nghỉ ngơi', 'Thiết kế', 'intermediate', 'all', 'both', 60, 4.7, 1100, 78, '/image.png', '[\"thi\\u1ebft k\\u1ebf\",\"kh\\u00f4ng gian nh\\u1ecf\",\"v\\u01b0\\u1eddn \\u0111\\u1eb9p\",\"trang tr\\u00ed\"]', 1, 1, '2025-09-25 17:11:16', '2025-09-25 17:11:16'),
(7, 'Cách phòng trừ sâu bệnh hại cây trồng', 'cach-phong-tru-sau-benh-hai-cay-trong', 'Hướng dẫn các biện pháp phòng trừ sâu bệnh hại cây trồng một cách an toàn và hiệu quả.', 'Sâu bệnh hại cây trồng là vấn đề thường gặp, nhưng có thể phòng trừ hiệu quả.\\n\\n1. Phòng bệnh:\\n- Chọn giống khỏe mạnh\\n- Trồng đúng mật độ\\n- Tưới nước đều đặn\\n- Bón phân cân đối\\n\\n2. Sâu hại thường gặp:\\n- Rệp: Sử dụng nước xà phòng\\n- Sâu ăn lá: Bắt bằng tay\\n- Bọ cánh cứng: Sử dụng bẫy\\n- Ốc sên: Rải vỏ trứng', 'Sâu bệnh', 'intermediate', 'all', 'both', 50, 4.8, 950, 71, '/image.png', '[\"s\\u00e2u b\\u1ec7nh\",\"ph\\u00f2ng tr\\u1eeb\",\"an to\\u00e0n\",\"hi\\u1ec7u qu\\u1ea3\"]', 0, 1, '2025-09-25 17:11:16', '2025-09-25 17:11:16');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `images_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images_json`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`id`, `name`, `slug`, `description`, `video_url`, `images_json`, `created_at`, `updated_at`) VALUES
(1, 'Kéo cắt cành chuyên nghiệp', 'keo-cat-canh-chuyen-nghiep', 'Kéo cắt cành chuyên nghiệp với lưỡi thép không gỉ sắc bén, tay cầm ergonomic giúp cắt tỉa cành cây một cách dễ dàng và chính xác. Phù hợp cho việc cắt tỉa cây cảnh, cây ăn quả và cây hoa.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(2, 'Kéo cắt tỉa bonsai', 'keo-cat-tia-bonsai', 'Kéo cắt tỉa bonsai chuyên dụng với lưỡi nhỏ và sắc, thiết kế tinh tế để cắt tỉa các chi tiết nhỏ của cây bonsai. Tay cầm nhẹ và dễ sử dụng.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(3, 'Kéo cắt cỏ cầm tay', 'keo-cat-co-cam-tay', 'Kéo cắt cỏ cầm tay với lưỡi dài và sắc, giúp cắt cỏ ở những nơi máy cắt cỏ không thể tiếp cận. Thiết kế nhẹ và dễ sử dụng.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(4, 'Xẻng trồng cây đa năng', 'xeng-trong-cay-da-nang', 'Xẻng trồng cây đa năng với lưỡi thép không gỉ, tay cầm chắc chắn. Phù hợp cho việc đào hố trồng cây, xới đất và chuyển cây. Thiết kế ergonomic giúp giảm mệt mỏi khi sử dụng.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(5, 'Cuốc làm vườn', 'cuoc-lam-vuon', 'Cuốc làm vườn với lưỡi rộng và sắc, tay cầm dài giúp xới đất hiệu quả. Phù hợp cho việc làm đất, đào hố và chuẩn bị đất trồng cây.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(6, 'Xẻng nhỏ trồng cây trong chậu', 'xeng-nho-trong-cay-trong-chau', 'Xẻng nhỏ chuyên dụng cho việc trồng cây trong chậu, lưỡi nhỏ và gọn giúp làm việc trong không gian hẹp. Tay cầm ngắn và dễ sử dụng.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(7, 'Bình tưới nước có vòi phun', 'binh-tuoi-nuoc-co-voi-phun', 'Bình tưới nước với vòi phun điều chỉnh được, dung tích 2 lít. Thiết kế nhẹ và dễ sử dụng, phù hợp cho việc tưới cây trong nhà và ngoài vườn.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(8, 'Vòi tưới nước dài', 'voi-tuoi-nuoc-dai', 'Vòi tưới nước dài 15m với đầu phun điều chỉnh được. Phù hợp cho việc tưới nước cho vườn lớn, dễ cuộn và bảo quản.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(9, 'Bình phun thuốc trừ sâu', 'binh-phun-thuoc-tru-sau', 'Bình phun thuốc trừ sâu dung tích 1 lít với vòi phun mịn. Phù hợp cho việc phun thuốc trừ sâu, phân bón lá và các loại dung dịch chăm sóc cây.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(10, 'Cào làm đất', 'cao-lam-dat', 'Cào làm đất với răng sắt chắc chắn, giúp xới đất, làm phẳng mặt đất và loại bỏ cỏ dại. Tay cầm dài giúp làm việc hiệu quả.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(11, 'Cào nhỏ làm đất trong chậu', 'cao-nho-lam-dat-trong-chau', 'Cào nhỏ chuyên dụng cho việc làm đất trong chậu cây, răng nhỏ và gọn giúp xới đất mà không làm tổn thương rễ cây.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(12, 'Bay làm vườn', 'bay-lam-vuon', 'Bay làm vườn với lưỡi cong và sắc, tay cầm chắc chắn. Phù hợp cho việc đào hố nhỏ, trồng cây con và chuyển cây.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(13, 'Máy đo độ ẩm đất', 'may-do-do-am-dat', 'Máy đo độ ẩm đất điện tử với màn hình LCD, giúp kiểm tra độ ẩm đất chính xác. Phù hợp cho việc chăm sóc cây cảnh và cây trồng.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(14, 'Máy đo pH đất', 'may-do-ph-dat', 'Máy đo pH đất điện tử với độ chính xác cao, giúp kiểm tra độ axit/kiềm của đất. Phù hợp cho việc chọn loại đất phù hợp với từng loại cây.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(15, 'Thước đo chiều cao cây', 'thuoc-do-chieu-cao-cay', 'Thước đo chiều cao cây có thể gập lại, dài 2m. Giúp đo chiều cao cây, khoảng cách trồng cây và các kích thước khác trong vườn.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(16, 'Găng tay làm vườn', 'gang-tay-lam-vuon', 'Găng tay làm vườn chống nước với lòng bàn tay cao su chống trượt. Bảo vệ tay khỏi gai, côn trùng và hóa chất khi làm vườn.', NULL, '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(17, 'Mũ bảo hiểm làm vườn', 'mu-bao-hiem-lam-vuon', 'Mũ bảo hiểm làm vườn với vành rộng che nắng, bảo vệ đầu khỏi va đập và tia nắng mặt trời khi làm việc ngoài trời.', NULL, '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(18, 'Kính bảo hộ', 'kinh-bao-ho', 'Kính bảo hộ trong suốt bảo vệ mắt khỏi bụi, côn trùng và hóa chất khi làm vườn. Thiết kế nhẹ và thoải mái khi đeo.', NULL, '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(19, 'Máy cắt cỏ cầm tay', 'may-cat-co-cam-tay', 'Máy cắt cỏ cầm tay chạy pin với lưỡi cắt sắc bén. Phù hợp cho việc cắt cỏ ở những nơi khó tiếp cận và cắt cỏ mềm.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(20, 'Máy xới đất mini', 'may-xoi-dat-mini', 'Máy xới đất mini chạy điện với công suất mạnh. Giúp xới đất nhanh chóng và hiệu quả, phù hợp cho vườn nhỏ và vừa.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(21, 'Máy bơm nước mini', 'may-bom-nuoc-mini', 'Máy bơm nước mini chạy pin với lưu lượng cao. Phù hợp cho việc tưới nước cho vườn lớn và bơm nước từ bể chứa.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', '[\"\\/image.png\"]', '2025-09-25 16:41:04', '2025-09-25 16:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Test User', 'test@example.com', '2025-09-25 16:41:04', '$2y$12$Jv4yioQg6NAUNbLaosdok.rUSqa67b/ar5lz2YxC4PR7bJy1FLj36', 'dA60i7JldA', '2025-09-25 16:41:04', '2025-09-25 16:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `embed_url` varchar(255) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `videos`
--

INSERT INTO `videos` (`id`, `title`, `description`, `embed_url`, `thumbnail`, `created_at`, `updated_at`) VALUES
(1, 'Hướng dẫn trồng cây từ A-Z cho người mới bắt đầu', 'Video hướng dẫn chi tiết cách trồng cây từ bước đầu tiên, bao gồm chọn giống, chuẩn bị đất, gieo hạt và chăm sóc cây con. Phù hợp cho những người mới bắt đầu làm vườn.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(2, 'Cách trồng rau sạch tại nhà - Hướng dẫn từng bước', 'Học cách trồng rau sạch tại nhà với các kỹ thuật đơn giản và hiệu quả. Video bao gồm cách thiết kế vườn rau mini, chọn giống rau phù hợp và chăm sóc cây trồng.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(3, 'Kỹ thuật trồng cây ăn quả trong chậu', 'Hướng dẫn chi tiết cách trồng cây ăn quả trong chậu, từ chọn giống đến thu hoạch. Phù hợp cho những ai muốn có trái cây sạch nhưng không có đất vườn rộng.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(4, 'Cách trồng hoa hồng đẹp nhất', 'Bí quyết trồng và chăm sóc hoa hồng để có những bông hoa đẹp nhất. Video bao gồm cách chọn giống, trồng cây, cắt tỉa và phòng trừ sâu bệnh.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(5, 'Hướng dẫn trồng cây thủy canh tại nhà', 'Học cách trồng cây thủy canh - phương pháp trồng cây không cần đất hiện đại. Video hướng dẫn thiết kế hệ thống thủy canh đơn giản tại nhà.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(6, 'Cách chăm sóc cây cảnh luôn xanh tươi', 'Bí quyết chăm sóc cây cảnh để cây luôn xanh tươi và phát triển tốt. Video bao gồm cách tưới nước, bón phân và tạo điều kiện tốt nhất cho cây.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(7, 'Kỹ thuật tưới nước hiệu quả cho cây trồng', 'Học cách tưới nước đúng cách cho từng loại cây. Video hướng dẫn thời điểm tưới nước, lượng nước cần thiết và các kỹ thuật tưới nước hiệu quả.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(8, 'Cách bón phân cho cây trồng đúng cách', 'Hướng dẫn chi tiết cách bón phân cho cây trồng để cây phát triển tốt nhất. Video bao gồm các loại phân, thời điểm bón phân và kỹ thuật bón phân.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(9, 'Kỹ thuật cắt tỉa cây cảnh chuyên nghiệp', 'Học cách cắt tỉa cây cảnh để tạo hình đẹp và kích thích cây phát triển. Video hướng dẫn các kỹ thuật cắt tỉa cơ bản và nâng cao.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(10, 'Cách phòng trừ sâu bệnh cho cây trồng', 'Hướng dẫn cách phòng trừ sâu bệnh cho cây trồng một cách tự nhiên và hiệu quả. Video bao gồm cách nhận biết sâu bệnh và các phương pháp xử lý.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(11, 'Dụng cụ làm vườn cần thiết cho người mới bắt đầu', 'Giới thiệu các dụng cụ làm vườn cơ bản mà mọi người làm vườn nên có. Video hướng dẫn cách chọn và sử dụng dụng cụ hiệu quả.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(12, 'Cách sử dụng kéo cắt cành an toàn và hiệu quả', 'Hướng dẫn chi tiết cách sử dụng kéo cắt cành an toàn và hiệu quả. Video bao gồm cách chọn kéo phù hợp và kỹ thuật cắt tỉa đúng cách.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(13, 'Hệ thống tưới nước tự động cho vườn nhà', 'Hướng dẫn thiết kế và lắp đặt hệ thống tưới nước tự động cho vườn nhà. Video bao gồm cách chọn thiết bị và lắp đặt hệ thống.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(14, 'Chọn đất trồng phù hợp cho từng loại cây', 'Hướng dẫn chọn loại đất trồng tốt nhất cho từng loại cây. Video bao gồm các loại đất khác nhau và cách cải thiện đất trồng.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(15, 'Cách làm phân compost tại nhà', 'Hướng dẫn chi tiết cách làm phân compost tại nhà từ rác thải hữu cơ. Video bao gồm các bước làm phân compost và cách sử dụng hiệu quả.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(16, 'Cách đo và điều chỉnh pH đất', 'Học cách đo và điều chỉnh pH đất để tạo điều kiện tốt nhất cho cây trồng. Video hướng dẫn sử dụng máy đo pH và các phương pháp điều chỉnh.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(17, 'Cách chăm sóc cây trong mùa đông', 'Hướng dẫn chăm sóc cây trồng trong mùa đông để cây sống sót và phát triển tốt. Video bao gồm cách bảo vệ cây khỏi lạnh và tạo môi trường ấm áp.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(18, 'Cách chuẩn bị vườn cho mùa xuân', 'Hướng dẫn chuẩn bị vườn cho mùa xuân để có một mùa trồng trọt thành công. Video bao gồm cách làm đất, chọn giống và lập kế hoạch trồng trọt.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(19, 'Cách chăm sóc cây trong mùa hè nắng nóng', 'Hướng dẫn chăm sóc cây trồng trong mùa hè nắng nóng để cây không bị héo và phát triển tốt. Video bao gồm cách tưới nước và che chắn cây.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(20, 'Cách nhân giống cây trồng bằng giâm cành', 'Hướng dẫn chi tiết cách nhân giống cây trồng bằng phương pháp giâm cành. Video bao gồm cách chọn cành giâm, chuẩn bị và chăm sóc cây con.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(21, 'Kỹ thuật chiết cành cây ăn quả', 'Học kỹ thuật chiết cành cây ăn quả để có cây con khỏe mạnh. Video hướng dẫn từng bước cách chiết cành và chăm sóc cây con.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04'),
(22, 'Cách gieo hạt và chăm sóc cây con', 'Hướng dẫn chi tiết cách gieo hạt và chăm sóc cây con từ khi nảy mầm đến khi trưởng thành. Video bao gồm các kỹ thuật gieo hạt và chăm sóc cây con.', 'https://www.youtube.com/embed/dQw4w9WgXcQ', '/image.png', '2025-09-25 16:41:04', '2025-09-25 16:41:04');

-- --------------------------------------------------------

--
-- Table structure for table `visitor_stats`
--

CREATE TABLE `visitor_stats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ip_hash` varchar(255) NOT NULL,
  `page` varchar(255) NOT NULL,
  `viewed_at` timestamp NOT NULL,
  `meta_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_json`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_us`
--
ALTER TABLE `about_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `accessories`
--
ALTER TABLE `accessories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `accessories_slug_unique` (`slug`);

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `articles_slug_unique` (`slug`),
  ADD KEY `articles_category_id_foreign` (`category_id`),
  ADD KEY `articles_author_id_foreign` (`author_id`);

--
-- Indexes for table `article_tag`
--
ALTER TABLE `article_tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `article_tag_article_id_tag_id_unique` (`article_id`,`tag_id`),
  ADD KEY `article_tag_tag_id_foreign` (`tag_id`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `books_slug_unique` (`slug`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`),
  ADD KEY `categories_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `essentials`
--
ALTER TABLE `essentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `essentials_slug_unique` (`slug`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `pots`
--
ALTER TABLE `pots`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pots_slug_unique` (`slug`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `site_settings_key_unique` (`key`);

--
-- Indexes for table `suggestions`
--
ALTER TABLE `suggestions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `suggestions_slug_unique` (`slug`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tags_slug_unique` (`slug`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tools_slug_unique` (`slug`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `visitor_stats`
--
ALTER TABLE `visitor_stats`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_us`
--
ALTER TABLE `about_us`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `accessories`
--
ALTER TABLE `accessories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `article_tag`
--
ALTER TABLE `article_tag`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `essentials`
--
ALTER TABLE `essentials`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pots`
--
ALTER TABLE `pots`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `site_settings`
--
ALTER TABLE `site_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suggestions`
--
ALTER TABLE `suggestions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `visitor_stats`
--
ALTER TABLE `visitor_stats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `articles`
--
ALTER TABLE `articles`
  ADD CONSTRAINT `articles_author_id_foreign` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `articles_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `article_tag`
--
ALTER TABLE `article_tag`
  ADD CONSTRAINT `article_tag_article_id_foreign` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `article_tag_tag_id_foreign` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
