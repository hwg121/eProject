<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AboutUs;

class AboutUsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutUs = [
            'title' => 'Về Chúng Tôi - Green Groves',
            'subtitle' => 'Hành trình xanh của chúng tôi',
            'description' => 'Green Groves là cộng đồng làm vườn hàng đầu Việt Nam, cung cấp kiến thức, công cụ và sản phẩm chất lượng cao cho những người yêu thích làm vườn.',
            'content' => 'Green Groves được thành lập với sứ mệnh mang đến một không gian xanh tươi mát cho mọi gia đình Việt Nam. Chúng tôi tin rằng việc làm vườn không chỉ là một sở thích mà còn là cách để kết nối với thiên nhiên, cải thiện chất lượng cuộc sống và bảo vệ môi trường.

Từ những ngày đầu thành lập, chúng tôi đã không ngừng phát triển và mở rộng cộng đồng những người yêu thích làm vườn. Với đội ngũ chuyên gia giàu kinh nghiệm và đam mê, chúng tôi cam kết mang đến những sản phẩm và dịch vụ tốt nhất.

Chúng tôi hiểu rằng mỗi người có những nhu cầu và điều kiện khác nhau khi làm vườn. Vì vậy, chúng tôi cung cấp đa dạng các sản phẩm từ dụng cụ cơ bản đến chuyên nghiệp, từ hạt giống đến cây trưởng thành, từ chậu cây đến hệ thống tưới nước thông minh.

Green Groves không chỉ là nơi mua sắm mà còn là cộng đồng học hỏi và chia sẻ kinh nghiệm. Chúng tôi thường xuyên tổ chức các workshop, hội thảo và sự kiện để kết nối những người yêu thích làm vườn.',
            'image' => '/image.png',
            'mission' => 'Mang đến không gian xanh tươi mát cho mọi gia đình Việt Nam thông qua việc cung cấp sản phẩm, kiến thức và dịch vụ làm vườn chất lượng cao.',
            'vision' => 'Trở thành cộng đồng làm vườn hàng đầu Việt Nam, góp phần xây dựng một xã hội xanh và bền vững.',
            'values' => 'Chất lượng, Sáng tạo, Bền vững, Cộng đồng, Đam mê',
            'team_members' => [
                [
                    'name' => 'Nguyễn Văn A',
                    'position' => 'Giám đốc điều hành',
                    'image' => '/image.png',
                    'description' => 'Chuyên gia về làm vườn với hơn 10 năm kinh nghiệm'
                ],
                [
                    'name' => 'Trần Thị B',
                    'position' => 'Chuyên gia cây trồng',
                    'image' => '/image.png',
                    'description' => 'Thạc sĩ Nông nghiệp, chuyên về cây cảnh và rau sạch'
                ],
                [
                    'name' => 'Lê Văn C',
                    'position' => 'Chuyên gia kỹ thuật',
                    'image' => '/image.png',
                    'description' => 'Kỹ sư nông nghiệp, chuyên về hệ thống tưới nước thông minh'
                ]
            ],
            'achievements' => [
                [
                    'title' => '10,000+ khách hàng hài lòng',
                    'description' => 'Số lượng khách hàng đã tin tưởng và sử dụng dịch vụ của chúng tôi'
                ],
                [
                    'title' => '50+ sản phẩm chất lượng',
                    'description' => 'Đa dạng sản phẩm từ dụng cụ đến cây trồng'
                ],
                [
                    'title' => '100+ workshop đã tổ chức',
                    'description' => 'Chia sẻ kiến thức và kinh nghiệm làm vườn'
                ],
                [
                    'title' => '5 năm kinh nghiệm',
                    'description' => 'Thời gian hoạt động và phát triển trong lĩnh vực làm vườn'
                ]
            ],
            'contact_email' => 'info@greengroves.com',
            'contact_phone' => '0123 456 789',
            'address' => '123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh',
            'social_links' => [
                'facebook' => 'https://facebook.com/greengroves',
                'instagram' => 'https://instagram.com/greengroves',
                'youtube' => 'https://youtube.com/greengroves',
                'tiktok' => 'https://tiktok.com/@greengroves'
            ],
            'is_active' => true
        ];

        AboutUs::firstOrCreate(
            ['title' => $aboutUs['title']],
            $aboutUs
        );
    }
}
