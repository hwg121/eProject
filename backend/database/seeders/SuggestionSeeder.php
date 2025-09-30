<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Suggestion;

class SuggestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suggestions = [
            // Gợi ý cho người mới bắt đầu
            [
                'title' => 'Cách bắt đầu làm vườn cho người mới',
                'slug' => 'cach-bat-dau-lam-vuon-cho-nguoi-moi',
                'description' => 'Hướng dẫn chi tiết từ A-Z cho những người mới bắt đầu làm vườn, từ việc chọn vị trí đến chăm sóc cây trồng.',
                'content' => 'Làm vườn là một hoạt động thú vị và bổ ích, nhưng đối với người mới bắt đầu, việc này có thể khá khó khăn. Bài viết này sẽ hướng dẫn bạn từng bước cách bắt đầu làm vườn một cách hiệu quả.\n\n1. Chọn vị trí phù hợp:\n- Tìm nơi có ánh sáng mặt trời ít nhất 6 giờ/ngày\n- Đảm bảo có hệ thống thoát nước tốt\n- Tránh nơi có gió mạnh\n\n2. Chuẩn bị đất trồng:\n- Làm tơi đất và loại bỏ cỏ dại\n- Thêm phân hữu cơ để cải thiện chất lượng đất\n- Kiểm tra độ pH của đất\n\n3. Chọn cây trồng phù hợp:\n- Bắt đầu với các loại cây dễ trồng như rau muống, cà chua\n- Chọn cây phù hợp với khí hậu địa phương\n- Tránh chọn quá nhiều loại cây cùng lúc\n\n4. Chăm sóc hàng ngày:\n- Tưới nước đều đặn nhưng không quá nhiều\n- Kiểm tra sâu bệnh thường xuyên\n- Cắt tỉa cây khi cần thiết\n\n5. Thu hoạch và tận hưởng:\n- Thu hoạch đúng thời điểm\n- Lưu trữ và sử dụng sản phẩm\n- Lên kế hoạch cho vụ mùa tiếp theo',
                'category' => 'Hướng dẫn cơ bản',
                'difficulty_level' => 'beginner',
                'season' => 'all',
                'plant_type' => 'both',
                'estimated_time' => 30,
                'rating' => 4.8,
                'views' => 1250,
                'likes' => 89,
                'image' => '/image.png',
                'tags' => ['người mới', 'hướng dẫn', 'cơ bản', 'làm vườn'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => '10 loại cây dễ trồng nhất cho người mới',
                'slug' => '10-loai-cay-de-trong-nhat-cho-nguoi-moi',
                'description' => 'Danh sách 10 loại cây dễ trồng, ít cần chăm sóc và phù hợp cho những người mới bắt đầu làm vườn.',
                'content' => 'Khi mới bắt đầu làm vườn, việc chọn đúng loại cây trồng rất quan trọng. Dưới đây là 10 loại cây dễ trồng nhất:\n\n1. Rau muống:\n- Dễ trồng, nhanh thu hoạch\n- Chịu được nhiều loại đất\n- Có thể trồng quanh năm\n\n2. Cà chua cherry:\n- Quả nhỏ, ngọt ngon\n- Dễ trồng trong chậu\n- Cho năng suất cao\n\n3. Rau cải:\n- Thời gian sinh trưởng ngắn\n- Chứa nhiều vitamin\n- Dễ chế biến\n\n4. Hành lá:\n- Trồng từ củ hành\n- Thu hoạch liên tục\n- Ít sâu bệnh\n\n5. Rau diếp:\n- Lá giòn, ngon\n- Trồng được quanh năm\n- Dễ chăm sóc',
                'category' => 'Cây trồng',
                'difficulty_level' => 'beginner',
                'season' => 'all',
                'plant_type' => 'both',
                'estimated_time' => 20,
                'rating' => 4.6,
                'views' => 980,
                'likes' => 67,
                'image' => '/image.png',
                'tags' => ['cây dễ trồng', 'người mới', 'rau củ', 'danh sách'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => 'Cách tạo vườn rau sạch tại nhà',
                'slug' => 'cach-tao-vuon-rau-sach-tai-nha',
                'description' => 'Hướng dẫn chi tiết cách tạo một vườn rau sạch tại nhà, từ thiết kế không gian đến chăm sóc và thu hoạch.',
                'content' => 'Tạo vườn rau sạch tại nhà không chỉ giúp bạn có nguồn thực phẩm an toàn mà còn tiết kiệm chi phí và tạo không gian xanh mát.\n\n1. Lập kế hoạch:\n- Xác định diện tích có thể sử dụng\n- Chọn vị trí có ánh sáng tốt\n- Lên danh sách các loại rau muốn trồng\n\n2. Chuẩn bị không gian:\n- Làm sạch khu vực trồng\n- Tạo luống hoặc sử dụng chậu\n- Lắp đặt hệ thống tưới nước\n\n3. Chuẩn bị đất trồng:\n- Mua đất sạch, không chứa hóa chất\n- Trộn thêm phân hữu cơ\n- Kiểm tra độ pH phù hợp',
                'category' => 'Vườn rau',
                'difficulty_level' => 'intermediate',
                'season' => 'all',
                'plant_type' => 'outdoor',
                'estimated_time' => 45,
                'rating' => 4.7,
                'views' => 1100,
                'likes' => 78,
                'image' => '/image.png',
                'tags' => ['vườn rau', 'rau sạch', 'tại nhà', 'hướng dẫn'],
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'title' => 'Làm vườn mùa xuân: Những việc cần làm',
                'slug' => 'lam-vuon-mua-xuan-nhung-viec-can-lam',
                'description' => 'Danh sách các công việc cần làm trong vườn vào mùa xuân để chuẩn bị cho một mùa trồng trọt thành công.',
                'content' => 'Mùa xuân là thời điểm lý tưởng để bắt đầu một mùa trồng trọt mới. Dưới đây là những việc cần làm:\n\n1. Dọn dẹp vườn:\n- Loại bỏ lá khô và cành chết\n- Làm sạch luống trồng\n- Kiểm tra và sửa chữa dụng cụ\n\n2. Chuẩn bị đất:\n- Làm tơi đất\n- Thêm phân hữu cơ\n- Kiểm tra độ ẩm và pH\n\n3. Gieo hạt:\n- Gieo hạt trong nhà\n- Chuẩn bị cây con\n- Lên kế hoạch trồng',
                'category' => 'Theo mùa',
                'difficulty_level' => 'intermediate',
                'season' => 'spring',
                'plant_type' => 'both',
                'estimated_time' => 60,
                'rating' => 4.5,
                'views' => 850,
                'likes' => 56,
                'image' => '/image.png',
                'tags' => ['mùa xuân', 'chuẩn bị', 'kế hoạch', 'theo mùa'],
                'is_featured' => false,
                'is_published' => true,
            ],
            [
                'title' => 'Kỹ thuật nhân giống cây trồng',
                'slug' => 'ky-thuat-nhan-giong-cay-trong',
                'description' => 'Hướng dẫn các phương pháp nhân giống cây trồng hiệu quả, từ gieo hạt đến chiết cành.',
                'content' => 'Nhân giống cây trồng là kỹ thuật quan trọng giúp tăng số lượng cây và duy trì đặc tính tốt.\n\n1. Nhân giống bằng hạt:\n- Chọn hạt giống chất lượng\n- Xử lý hạt trước khi gieo\n- Tạo môi trường ẩm ướt\n- Chăm sóc cây con\n\n2. Nhân giống bằng cành:\n- Chọn cành khỏe mạnh\n- Cắt cành đúng cách\n- Xử lý hormone kích thích\n- Trồng trong môi trường phù hợp',
                'category' => 'Kỹ thuật',
                'difficulty_level' => 'advanced',
                'season' => 'all',
                'plant_type' => 'both',
                'estimated_time' => 90,
                'rating' => 4.9,
                'views' => 650,
                'likes' => 42,
                'image' => '/image.png',
                'tags' => ['nhân giống', 'kỹ thuật', 'chiết cành', 'ghép cây'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => 'Thiết kế vườn đẹp cho không gian nhỏ',
                'slug' => 'thiet-ke-vuon-dep-cho-khong-gian-nho',
                'description' => 'Các ý tưởng thiết kế vườn đẹp và tiết kiệm không gian cho những ngôi nhà có diện tích hạn chế.',
                'content' => 'Không cần có sân vườn rộng lớn, bạn vẫn có thể tạo ra một khu vườn đẹp và hiệu quả.\n\n1. Vườn thẳng đứng:\n- Sử dụng giàn leo\n- Trồng cây trong chậu treo\n- Tạo tường cây xanh\n\n2. Vườn ban công:\n- Sử dụng chậu nhỏ gọn\n- Trồng cây thảo mộc\n- Tạo không gian xanh\n\n3. Vườn sân thượng:\n- Sử dụng chậu lớn\n- Trồng cây ăn quả\n- Tạo khu vực nghỉ ngơi',
                'category' => 'Thiết kế',
                'difficulty_level' => 'intermediate',
                'season' => 'all',
                'plant_type' => 'both',
                'estimated_time' => 60,
                'rating' => 4.7,
                'views' => 1100,
                'likes' => 78,
                'image' => '/image.png',
                'tags' => ['thiết kế', 'không gian nhỏ', 'vườn đẹp', 'trang trí'],
                'is_featured' => true,
                'is_published' => true,
            ],
            [
                'title' => 'Cách phòng trừ sâu bệnh hại cây trồng',
                'slug' => 'cach-phong-tru-sau-benh-hai-cay-trong',
                'description' => 'Hướng dẫn các biện pháp phòng trừ sâu bệnh hại cây trồng một cách an toàn và hiệu quả.',
                'content' => 'Sâu bệnh hại cây trồng là vấn đề thường gặp, nhưng có thể phòng trừ hiệu quả.\n\n1. Phòng bệnh:\n- Chọn giống khỏe mạnh\n- Trồng đúng mật độ\n- Tưới nước đều đặn\n- Bón phân cân đối\n\n2. Sâu hại thường gặp:\n- Rệp: Sử dụng nước xà phòng\n- Sâu ăn lá: Bắt bằng tay\n- Bọ cánh cứng: Sử dụng bẫy\n- Ốc sên: Rải vỏ trứng',
                'category' => 'Sâu bệnh',
                'difficulty_level' => 'intermediate',
                'season' => 'all',
                'plant_type' => 'both',
                'estimated_time' => 50,
                'rating' => 4.8,
                'views' => 950,
                'likes' => 71,
                'image' => '/image.png',
                'tags' => ['sâu bệnh', 'phòng trừ', 'an toàn', 'hiệu quả'],
                'is_featured' => false,
                'is_published' => true,
            ]
        ];

        foreach ($suggestions as $suggestion) {
            Suggestion::firstOrCreate(
                ['title' => $suggestion['title']],
                $suggestion
            );
        }
    }
}