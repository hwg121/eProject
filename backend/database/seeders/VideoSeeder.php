<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Video;

class VideoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $videos = [
            // Video về trồng trọt cơ bản
            [
                'title' => 'Hướng dẫn trồng cây từ A-Z cho người mới bắt đầu',
                'description' => 'Video hướng dẫn chi tiết cách trồng cây từ bước đầu tiên, bao gồm chọn giống, chuẩn bị đất, gieo hạt và chăm sóc cây con. Phù hợp cho những người mới bắt đầu làm vườn.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách trồng rau sạch tại nhà - Hướng dẫn từng bước',
                'description' => 'Học cách trồng rau sạch tại nhà với các kỹ thuật đơn giản và hiệu quả. Video bao gồm cách thiết kế vườn rau mini, chọn giống rau phù hợp và chăm sóc cây trồng.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Kỹ thuật trồng cây ăn quả trong chậu',
                'description' => 'Hướng dẫn chi tiết cách trồng cây ăn quả trong chậu, từ chọn giống đến thu hoạch. Phù hợp cho những ai muốn có trái cây sạch nhưng không có đất vườn rộng.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách trồng hoa hồng đẹp nhất',
                'description' => 'Bí quyết trồng và chăm sóc hoa hồng để có những bông hoa đẹp nhất. Video bao gồm cách chọn giống, trồng cây, cắt tỉa và phòng trừ sâu bệnh.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Hướng dẫn trồng cây thủy canh tại nhà',
                'description' => 'Học cách trồng cây thủy canh - phương pháp trồng cây không cần đất hiện đại. Video hướng dẫn thiết kế hệ thống thủy canh đơn giản tại nhà.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],

            // Video về chăm sóc cây
            [
                'title' => 'Cách chăm sóc cây cảnh luôn xanh tươi',
                'description' => 'Bí quyết chăm sóc cây cảnh để cây luôn xanh tươi và phát triển tốt. Video bao gồm cách tưới nước, bón phân và tạo điều kiện tốt nhất cho cây.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Kỹ thuật tưới nước hiệu quả cho cây trồng',
                'description' => 'Học cách tưới nước đúng cách cho từng loại cây. Video hướng dẫn thời điểm tưới nước, lượng nước cần thiết và các kỹ thuật tưới nước hiệu quả.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách bón phân cho cây trồng đúng cách',
                'description' => 'Hướng dẫn chi tiết cách bón phân cho cây trồng để cây phát triển tốt nhất. Video bao gồm các loại phân, thời điểm bón phân và kỹ thuật bón phân.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Kỹ thuật cắt tỉa cây cảnh chuyên nghiệp',
                'description' => 'Học cách cắt tỉa cây cảnh để tạo hình đẹp và kích thích cây phát triển. Video hướng dẫn các kỹ thuật cắt tỉa cơ bản và nâng cao.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách phòng trừ sâu bệnh cho cây trồng',
                'description' => 'Hướng dẫn cách phòng trừ sâu bệnh cho cây trồng một cách tự nhiên và hiệu quả. Video bao gồm cách nhận biết sâu bệnh và các phương pháp xử lý.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],

            // Video về dụng cụ làm vườn
            [
                'title' => 'Dụng cụ làm vườn cần thiết cho người mới bắt đầu',
                'description' => 'Giới thiệu các dụng cụ làm vườn cơ bản mà mọi người làm vườn nên có. Video hướng dẫn cách chọn và sử dụng dụng cụ hiệu quả.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách sử dụng kéo cắt cành an toàn và hiệu quả',
                'description' => 'Hướng dẫn chi tiết cách sử dụng kéo cắt cành an toàn và hiệu quả. Video bao gồm cách chọn kéo phù hợp và kỹ thuật cắt tỉa đúng cách.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Hệ thống tưới nước tự động cho vườn nhà',
                'description' => 'Hướng dẫn thiết kế và lắp đặt hệ thống tưới nước tự động cho vườn nhà. Video bao gồm cách chọn thiết bị và lắp đặt hệ thống.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],

            // Video về đất trồng và dinh dưỡng
            [
                'title' => 'Chọn đất trồng phù hợp cho từng loại cây',
                'description' => 'Hướng dẫn chọn loại đất trồng tốt nhất cho từng loại cây. Video bao gồm các loại đất khác nhau và cách cải thiện đất trồng.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách làm phân compost tại nhà',
                'description' => 'Hướng dẫn chi tiết cách làm phân compost tại nhà từ rác thải hữu cơ. Video bao gồm các bước làm phân compost và cách sử dụng hiệu quả.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách đo và điều chỉnh pH đất',
                'description' => 'Học cách đo và điều chỉnh pH đất để tạo điều kiện tốt nhất cho cây trồng. Video hướng dẫn sử dụng máy đo pH và các phương pháp điều chỉnh.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],

            // Video về chăm sóc theo mùa
            [
                'title' => 'Cách chăm sóc cây trong mùa đông',
                'description' => 'Hướng dẫn chăm sóc cây trồng trong mùa đông để cây sống sót và phát triển tốt. Video bao gồm cách bảo vệ cây khỏi lạnh và tạo môi trường ấm áp.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách chuẩn bị vườn cho mùa xuân',
                'description' => 'Hướng dẫn chuẩn bị vườn cho mùa xuân để có một mùa trồng trọt thành công. Video bao gồm cách làm đất, chọn giống và lập kế hoạch trồng trọt.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách chăm sóc cây trong mùa hè nắng nóng',
                'description' => 'Hướng dẫn chăm sóc cây trồng trong mùa hè nắng nóng để cây không bị héo và phát triển tốt. Video bao gồm cách tưới nước và che chắn cây.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],

            // Video về nhân giống cây
            [
                'title' => 'Cách nhân giống cây trồng bằng giâm cành',
                'description' => 'Hướng dẫn chi tiết cách nhân giống cây trồng bằng phương pháp giâm cành. Video bao gồm cách chọn cành giâm, chuẩn bị và chăm sóc cây con.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Kỹ thuật chiết cành cây ăn quả',
                'description' => 'Học kỹ thuật chiết cành cây ăn quả để có cây con khỏe mạnh. Video hướng dẫn từng bước cách chiết cành và chăm sóc cây con.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ],
            [
                'title' => 'Cách gieo hạt và chăm sóc cây con',
                'description' => 'Hướng dẫn chi tiết cách gieo hạt và chăm sóc cây con từ khi nảy mầm đến khi trưởng thành. Video bao gồm các kỹ thuật gieo hạt và chăm sóc cây con.',
                'embed_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'thumbnail' => '/image.png',
            ]
        ];

        foreach ($videos as $video) {
            Video::firstOrCreate(
                ['title' => $video['title']],
                $video
            );
        }
    }
}
