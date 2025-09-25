<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Essential;

class EssentialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $essentials = [
            // Phân bón và dinh dưỡng
            [
                'name' => 'Phân bón hữu cơ 100% tự nhiên',
                'slug' => 'phan-bon-huu-co-100-tu-nhien',
                'type' => 'fertilizer',
                'description' => 'Phân bón hữu cơ 100% tự nhiên được làm từ phân động vật và chất hữu cơ, cung cấp dinh dưỡng đầy đủ cho cây trồng. An toàn cho sức khỏe và thân thiện với môi trường.',
                'price' => 80000,
                'image' => '/image.png',
                'category' => 'Phân bón',
                'weight' => '1kg',
                'brand' => 'GreenGarden',
            ],
            [
                'name' => 'Phân NPK 20-20-20',
                'slug' => 'phan-npk-20-20-20',
                'type' => 'fertilizer',
                'description' => 'Phân NPK 20-20-20 với tỷ lệ cân bằng nitơ, photpho và kali, phù hợp cho hầu hết các loại cây trồng. Giúp cây phát triển khỏe mạnh và cho năng suất cao.',
                'price' => 120000,
                'image' => '/image.png',
                'category' => 'Phân bón',
                'weight' => '500g',
                'brand' => 'Fertilizer Pro',
            ],
            [
                'name' => 'Phân bón lá hữu cơ',
                'slug' => 'phan-bon-la-huu-co',
                'type' => 'fertilizer',
                'description' => 'Phân bón lá hữu cơ dạng lỏng, dễ hấp thụ qua lá. Cung cấp dinh dưỡng nhanh chóng cho cây trồng, giúp cây xanh tươi và phát triển tốt.',
                'price' => 60000,
                'image' => '/image.png',
                'category' => 'Phân bón',
                'weight' => '500ml',
                'brand' => 'Leaf Feed',
            ],
            [
                'name' => 'Phân vi sinh EM',
                'slug' => 'phan-vi-sinh-em',
                'type' => 'fertilizer',
                'description' => 'Phân vi sinh EM chứa các vi khuẩn có lợi, giúp cải thiện đất và tăng cường sức đề kháng cho cây trồng. An toàn và hiệu quả cao.',
                'price' => 90000,
                'image' => '/image.png',
                'category' => 'Phân bón',
                'weight' => '1 lít',
                'brand' => 'MicroBio',
            ],

            // Đất trồng
            [
                'name' => 'Đất trồng cây cảnh cao cấp',
                'slug' => 'dat-trong-cay-canh-cao-cap',
                'type' => 'soil',
                'description' => 'Đất trồng cây cảnh cao cấp được pha trộn từ đất sạch, phân hữu cơ và các chất dinh dưỡng cần thiết. Tơi xốp, thoát nước tốt và giàu dinh dưỡng.',
                'price' => 50000,
                'image' => '/image.png',
                'category' => 'Đất trồng',
                'weight' => '5kg',
                'brand' => 'Premium Soil',
            ],
            [
                'name' => 'Đất trồng rau sạch',
                'slug' => 'dat-trong-rau-sach',
                'type' => 'soil',
                'description' => 'Đất trồng rau sạch chuyên dụng, không chứa hóa chất độc hại. Phù hợp cho việc trồng rau sạch tại nhà, đảm bảo an toàn cho sức khỏe.',
                'price' => 45000,
                'image' => '/image.png',
                'category' => 'Đất trồng',
                'weight' => '3kg',
                'brand' => 'Clean Garden',
            ],
            [
                'name' => 'Đất trồng cây ăn quả',
                'slug' => 'dat-trong-cay-an-qua',
                'type' => 'soil',
                'description' => 'Đất trồng cây ăn quả chuyên dụng với độ pH phù hợp và giàu dinh dưỡng. Giúp cây ăn quả phát triển khỏe mạnh và cho năng suất cao.',
                'price' => 60000,
                'image' => '/image.png',
                'category' => 'Đất trồng',
                'weight' => '10kg',
                'brand' => 'Fruit Garden',
            ],
            [
                'name' => 'Đất trồng hoa hồng',
                'slug' => 'dat-trong-hoa-hong',
                'type' => 'soil',
                'description' => 'Đất trồng hoa hồng chuyên dụng với độ pH 6.0-6.5, tơi xốp và thoát nước tốt. Giúp hoa hồng phát triển khỏe mạnh và cho hoa đẹp.',
                'price' => 55000,
                'image' => '/image.png',
                'category' => 'Đất trồng',
                'weight' => '4kg',
                'brand' => 'Rose Garden',
            ],

            // Hạt giống
            [
                'name' => 'Hạt giống rau muống',
                'slug' => 'hat-giong-rau-muong',
                'type' => 'seed',
                'description' => 'Hạt giống rau muống chất lượng cao, tỷ lệ nảy mầm trên 90%. Dễ trồng, nhanh thu hoạch và cho năng suất cao. Phù hợp cho người mới bắt đầu.',
                'price' => 15000,
                'image' => '/image.png',
                'category' => 'Hạt giống',
                'weight' => '50g',
                'brand' => 'Seed Master',
            ],
            [
                'name' => 'Hạt giống cà chua cherry',
                'slug' => 'hat-giong-ca-chua-cherry',
                'type' => 'seed',
                'description' => 'Hạt giống cà chua cherry ngọt ngon, quả nhỏ và đẹp mắt. Dễ trồng trong chậu, phù hợp cho vườn nhà. Cho năng suất cao và liên tục.',
                'price' => 25000,
                'image' => '/image.png',
                'category' => 'Hạt giống',
                'weight' => '20 hạt',
                'brand' => 'Tomato Pro',
            ],
            [
                'name' => 'Hạt giống ớt hiểm',
                'slug' => 'hat-giong-ot-hiem',
                'type' => 'seed',
                'description' => 'Hạt giống ớt hiểm cay nồng, dễ trồng và chăm sóc. Cây khỏe mạnh, cho quả nhiều và liên tục. Phù hợp cho việc trồng trong chậu hoặc vườn.',
                'price' => 20000,
                'image' => '/image.png',
                'category' => 'Hạt giống',
                'weight' => '30 hạt',
                'brand' => 'Spicy Garden',
            ],
            [
                'name' => 'Hạt giống hoa hướng dương',
                'slug' => 'hat-giong-hoa-huong-duong',
                'type' => 'seed',
                'description' => 'Hạt giống hoa hướng dương cao lớn, hoa to và đẹp. Dễ trồng, nhanh nở hoa và tạo điểm nhấn cho khu vườn. Phù hợp cho vườn lớn.',
                'price' => 30000,
                'image' => '/image.png',
                'category' => 'Hạt giống',
                'weight' => '10 hạt',
                'brand' => 'Sunflower King',
            ],

            // Thuốc trừ sâu và bảo vệ cây
            [
                'name' => 'Thuốc trừ sâu sinh học',
                'slug' => 'thuoc-tru-sau-sinh-hoc',
                'type' => 'pesticide',
                'description' => 'Thuốc trừ sâu sinh học an toàn cho sức khỏe và môi trường. Hiệu quả cao trong việc phòng trừ sâu bệnh hại cây trồng. Không gây độc hại cho người và động vật.',
                'price' => 70000,
                'image' => '/image.png',
                'category' => 'Bảo vệ cây',
                'weight' => '250ml',
                'brand' => 'BioSafe',
            ],
            [
                'name' => 'Thuốc trừ nấm bệnh',
                'slug' => 'thuoc-tru-nam-benh',
                'type' => 'pesticide',
                'description' => 'Thuốc trừ nấm bệnh hiệu quả cao, phòng và trị các bệnh nấm phổ biến trên cây trồng. An toàn cho cây và môi trường, dễ sử dụng.',
                'price' => 80000,
                'image' => '/image.png',
                'category' => 'Bảo vệ cây',
                'weight' => '200ml',
                'brand' => 'Fungicide Pro',
            ],
            [
                'name' => 'Chất kích thích tăng trưởng',
                'slug' => 'chat-kich-thich-tang-truong',
                'type' => 'pesticide',
                'description' => 'Chất kích thích tăng trưởng tự nhiên, giúp cây phát triển nhanh và khỏe mạnh. Tăng cường sức đề kháng và khả năng chống chịu của cây.',
                'price' => 100000,
                'image' => '/image.png',
                'category' => 'Bảo vệ cây',
                'weight' => '100ml',
                'brand' => 'Growth Plus',
            ]
        ];

        foreach ($essentials as $essential) {
            Essential::create($essential);
        }
    }
}