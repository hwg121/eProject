<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tool;

class ToolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tools = [
            // Dụng cụ cắt tỉa
            [
                'name' => 'Kéo cắt cành chuyên nghiệp',
                'slug' => 'keo-cat-canh-chuyen-nghiep',
                'description' => 'Kéo cắt cành chuyên nghiệp với lưỡi thép không gỉ sắc bén, tay cầm ergonomic giúp cắt tỉa cành cây một cách dễ dàng và chính xác. Phù hợp cho việc cắt tỉa cây cảnh, cây ăn quả và cây hoa.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Kéo cắt tỉa bonsai',
                'slug' => 'keo-cat-tia-bonsai',
                'description' => 'Kéo cắt tỉa bonsai chuyên dụng với lưỡi nhỏ và sắc, thiết kế tinh tế để cắt tỉa các chi tiết nhỏ của cây bonsai. Tay cầm nhẹ và dễ sử dụng.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Kéo cắt cỏ cầm tay',
                'slug' => 'keo-cat-co-cam-tay',
                'description' => 'Kéo cắt cỏ cầm tay với lưỡi dài và sắc, giúp cắt cỏ ở những nơi máy cắt cỏ không thể tiếp cận. Thiết kế nhẹ và dễ sử dụng.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],

            // Dụng cụ đào đất
            [
                'name' => 'Xẻng trồng cây đa năng',
                'slug' => 'xeng-trong-cay-da-nang',
                'description' => 'Xẻng trồng cây đa năng với lưỡi thép không gỉ, tay cầm chắc chắn. Phù hợp cho việc đào hố trồng cây, xới đất và chuyển cây. Thiết kế ergonomic giúp giảm mệt mỏi khi sử dụng.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Cuốc làm vườn',
                'slug' => 'cuoc-lam-vuon',
                'description' => 'Cuốc làm vườn với lưỡi rộng và sắc, tay cầm dài giúp xới đất hiệu quả. Phù hợp cho việc làm đất, đào hố và chuẩn bị đất trồng cây.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Xẻng nhỏ trồng cây trong chậu',
                'slug' => 'xeng-nho-trong-cay-trong-chau',
                'description' => 'Xẻng nhỏ chuyên dụng cho việc trồng cây trong chậu, lưỡi nhỏ và gọn giúp làm việc trong không gian hẹp. Tay cầm ngắn và dễ sử dụng.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],

            // Dụng cụ tưới nước
            [
                'name' => 'Bình tưới nước có vòi phun',
                'slug' => 'binh-tuoi-nuoc-co-voi-phun',
                'description' => 'Bình tưới nước với vòi phun điều chỉnh được, dung tích 2 lít. Thiết kế nhẹ và dễ sử dụng, phù hợp cho việc tưới cây trong nhà và ngoài vườn.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Vòi tưới nước dài',
                'slug' => 'voi-tuoi-nuoc-dai',
                'description' => 'Vòi tưới nước dài 15m với đầu phun điều chỉnh được. Phù hợp cho việc tưới nước cho vườn lớn, dễ cuộn và bảo quản.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Bình phun thuốc trừ sâu',
                'slug' => 'binh-phun-thuoc-tru-sau',
                'description' => 'Bình phun thuốc trừ sâu dung tích 1 lít với vòi phun mịn. Phù hợp cho việc phun thuốc trừ sâu, phân bón lá và các loại dung dịch chăm sóc cây.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],

            // Dụng cụ chăm sóc đất
            [
                'name' => 'Cào làm đất',
                'slug' => 'cao-lam-dat',
                'description' => 'Cào làm đất với răng sắt chắc chắn, giúp xới đất, làm phẳng mặt đất và loại bỏ cỏ dại. Tay cầm dài giúp làm việc hiệu quả.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Cào nhỏ làm đất trong chậu',
                'slug' => 'cao-nho-lam-dat-trong-chau',
                'description' => 'Cào nhỏ chuyên dụng cho việc làm đất trong chậu cây, răng nhỏ và gọn giúp xới đất mà không làm tổn thương rễ cây.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Bay làm vườn',
                'slug' => 'bay-lam-vuon',
                'description' => 'Bay làm vườn với lưỡi cong và sắc, tay cầm chắc chắn. Phù hợp cho việc đào hố nhỏ, trồng cây con và chuyển cây.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],

            // Dụng cụ đo lường
            [
                'name' => 'Máy đo độ ẩm đất',
                'slug' => 'may-do-do-am-dat',
                'description' => 'Máy đo độ ẩm đất điện tử với màn hình LCD, giúp kiểm tra độ ẩm đất chính xác. Phù hợp cho việc chăm sóc cây cảnh và cây trồng.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Máy đo pH đất',
                'slug' => 'may-do-ph-dat',
                'description' => 'Máy đo pH đất điện tử với độ chính xác cao, giúp kiểm tra độ axit/kiềm của đất. Phù hợp cho việc chọn loại đất phù hợp với từng loại cây.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Thước đo chiều cao cây',
                'slug' => 'thuoc-do-chieu-cao-cay',
                'description' => 'Thước đo chiều cao cây có thể gập lại, dài 2m. Giúp đo chiều cao cây, khoảng cách trồng cây và các kích thước khác trong vườn.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],

            // Dụng cụ bảo vệ
            [
                'name' => 'Găng tay làm vườn',
                'slug' => 'gang-tay-lam-vuon',
                'description' => 'Găng tay làm vườn chống nước với lòng bàn tay cao su chống trượt. Bảo vệ tay khỏi gai, côn trùng và hóa chất khi làm vườn.',
                'video_url' => null,
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Mũ bảo hiểm làm vườn',
                'slug' => 'mu-bao-hiem-lam-vuon',
                'description' => 'Mũ bảo hiểm làm vườn với vành rộng che nắng, bảo vệ đầu khỏi va đập và tia nắng mặt trời khi làm việc ngoài trời.',
                'video_url' => null,
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Kính bảo hộ',
                'slug' => 'kinh-bao-ho',
                'description' => 'Kính bảo hộ trong suốt bảo vệ mắt khỏi bụi, côn trùng và hóa chất khi làm vườn. Thiết kế nhẹ và thoải mái khi đeo.',
                'video_url' => null,
                'images_json' => json_encode(['/image.png']),
            ],

            // Dụng cụ chuyên dụng
            [
                'name' => 'Máy cắt cỏ cầm tay',
                'slug' => 'may-cat-co-cam-tay',
                'description' => 'Máy cắt cỏ cầm tay chạy pin với lưỡi cắt sắc bén. Phù hợp cho việc cắt cỏ ở những nơi khó tiếp cận và cắt cỏ mềm.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Máy xới đất mini',
                'slug' => 'may-xoi-dat-mini',
                'description' => 'Máy xới đất mini chạy điện với công suất mạnh. Giúp xới đất nhanh chóng và hiệu quả, phù hợp cho vườn nhỏ và vừa.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ],
            [
                'name' => 'Máy bơm nước mini',
                'slug' => 'may-bom-nuoc-mini',
                'description' => 'Máy bơm nước mini chạy pin với lưu lượng cao. Phù hợp cho việc tưới nước cho vườn lớn và bơm nước từ bể chứa.',
                'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'images_json' => json_encode(['/image.png']),
            ]
        ];

        foreach ($tools as $tool) {
            Tool::create($tool);
        }
    }
}
