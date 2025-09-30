<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Pot;

class PotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pots = [
            // Chậu đất nung
            [
                'name' => 'Chậu đất nung tròn cỡ lớn',
                'slug' => 'chau-dat-nung-tron-co-lon',
                'description' => 'Chậu đất nung tròn cỡ lớn với đường kính 30cm, cao 25cm. Chất liệu đất nung tự nhiên, thoát nước tốt và giữ ẩm cho cây. Phù hợp cho cây cảnh lớn và cây ăn quả.',
                'price' => 150000,
                'image' => '/image.png',
                'material' => 'Đất nung',
                'size' => '30cm x 25cm',
                'drainage_holes' => true,
                'color' => 'Nâu đỏ',
                'brand' => 'Terracotta Pro',
            ],
            [
                'name' => 'Chậu đất nung vuông cỡ vừa',
                'slug' => 'chau-dat-nung-vuong-co-vua',
                'description' => 'Chậu đất nung vuông cỡ vừa 20x20x18cm, thiết kế vuông vức hiện đại. Chất liệu đất nung cao cấp, bền đẹp và thân thiện với môi trường. Phù hợp cho cây cảnh vừa và nhỏ.',
                'price' => 120000,
                'image' => '/image.png',
                'material' => 'Đất nung',
                'size' => '20cm x 20cm x 18cm',
                'drainage_holes' => true,
                'color' => 'Nâu đỏ',
                'brand' => 'Terracotta Pro',
            ],
            [
                'name' => 'Chậu đất nung mini',
                'slug' => 'chau-dat-nung-mini',
                'description' => 'Chậu đất nung mini 10cm x 8cm, phù hợp cho cây cảnh nhỏ, cây bonsai và cây con. Chất liệu đất nung tự nhiên, thoát nước tốt và giữ ẩm.',
                'price' => 25000,
                'image' => '/image.png',
                'material' => 'Đất nung',
                'size' => '10cm x 8cm',
                'drainage_holes' => true,
                'color' => 'Nâu đỏ',
                'brand' => 'Terracotta Pro',
            ],

            // Chậu nhựa
            [
                'name' => 'Chậu nhựa tròn đa năng',
                'slug' => 'chau-nhua-tron-da-nang',
                'description' => 'Chậu nhựa tròn đa năng với đường kính 25cm, cao 20cm. Chất liệu nhựa PP cao cấp, bền đẹp và không độc hại. Nhiều màu sắc đẹp mắt, phù hợp cho mọi loại cây.',
                'price' => 80000,
                'image' => '/image.png',
                'material' => 'Nhựa PP',
                'size' => '25cm x 20cm',
                'drainage_holes' => true,
                'color' => 'Nhiều màu',
                'brand' => 'Plastic Garden',
            ],
            [
                'name' => 'Chậu nhựa vuông cao cấp',
                'slug' => 'chau-nhua-vuong-cao-cap',
                'description' => 'Chậu nhựa vuông cao cấp 30x30x25cm, thiết kế hiện đại và sang trọng. Chất liệu nhựa ABS bền đẹp, chống tia UV và thời tiết. Phù hợp cho cây cảnh lớn và cây ăn quả.',
                'price' => 150000,
                'image' => '/image.png',
                'material' => 'Nhựa ABS',
                'size' => '30cm x 30cm x 25cm',
                'drainage_holes' => true,
                'color' => 'Đen',
                'brand' => 'Premium Plastic',
            ],
            [
                'name' => 'Chậu nhựa treo',
                'slug' => 'chau-nhua-treo',
                'description' => 'Chậu nhựa treo với dây treo chắc chắn, đường kính 18cm. Thiết kế đẹp mắt, phù hợp cho việc treo cây cảnh trong nhà và ngoài vườn. Tiết kiệm không gian.',
                'price' => 60000,
                'image' => '/image.png',
                'material' => 'Nhựa PP',
                'size' => '18cm x 15cm',
                'drainage_holes' => true,
                'color' => 'Xanh lá',
                'brand' => 'Hanging Pot',
            ],

            // Chậu gốm sứ
            [
                'name' => 'Chậu gốm sứ tráng men',
                'slug' => 'chau-gom-su-trang-men',
                'description' => 'Chậu gốm sứ tráng men với hoa văn đẹp mắt, đường kính 22cm, cao 18cm. Chất liệu gốm sứ cao cấp, bền đẹp và sang trọng. Phù hợp cho cây cảnh trang trí trong nhà.',
                'price' => 200000,
                'image' => '/image.png',
                'material' => 'Gốm sứ',
                'size' => '22cm x 18cm',
                'drainage_holes' => true,
                'color' => 'Trắng hoa văn',
                'brand' => 'Ceramic Art',
            ],
            [
                'name' => 'Chậu gốm sứ màu xanh',
                'slug' => 'chau-gom-su-mau-xanh',
                'description' => 'Chậu gốm sứ màu xanh đẹp mắt, thiết kế tròn cổ điển. Chất liệu gốm sứ cao cấp, bền đẹp và thân thiện với môi trường. Phù hợp cho cây cảnh và cây hoa.',
                'price' => 180000,
                'image' => '/image.png',
                'material' => 'Gốm sứ',
                'size' => '20cm x 16cm',
                'drainage_holes' => true,
                'color' => 'Xanh lá',
                'brand' => 'Ceramic Art',
            ],

            // Chậu composite
            [
                'name' => 'Chậu composite hiện đại',
                'slug' => 'chau-composite-hien-dai',
                'description' => 'Chậu composite hiện đại với thiết kế vuông vức, kích thước 35x35x30cm. Chất liệu composite bền đẹp, chống tia UV và thời tiết. Phù hợp cho cây cảnh lớn và cây ăn quả.',
                'price' => 300000,
                'image' => '/image.png',
                'material' => 'Composite',
                'size' => '35cm x 35cm x 30cm',
                'drainage_holes' => true,
                'color' => 'Xám',
                'brand' => 'Modern Pot',
            ],
            [
                'name' => 'Chậu composite tròn',
                'slug' => 'chau-composite-tron',
                'description' => 'Chậu composite tròn với đường kính 28cm, cao 24cm. Chất liệu composite cao cấp, bền đẹp và dễ vệ sinh. Phù hợp cho cây cảnh vừa và cây hoa.',
                'price' => 250000,
                'image' => '/image.png',
                'material' => 'Composite',
                'size' => '28cm x 24cm',
                'drainage_holes' => true,
                'color' => 'Đen',
                'brand' => 'Modern Pot',
            ],

            // Chậu thủy tinh
            [
                'name' => 'Chậu thủy tinh trong suốt',
                'slug' => 'chau-thuy-tinh-trong-suot',
                'description' => 'Chậu thủy tinh trong suốt với thiết kế đẹp mắt, đường kính 15cm, cao 12cm. Phù hợp cho cây thủy sinh và cây cảnh nhỏ. Dễ quan sát rễ cây và mực nước.',
                'price' => 100000,
                'image' => '/image.png',
                'material' => 'Thủy tinh',
                'size' => '15cm x 12cm',
                'drainage_holes' => false,
                'color' => 'Trong suốt',
                'brand' => 'Glass Garden',
            ],
            [
                'name' => 'Chậu thủy tinh có nắp',
                'slug' => 'chau-thuy-tinh-co-nap',
                'description' => 'Chậu thủy tinh có nắp với thiết kế kín, đường kính 12cm, cao 10cm. Phù hợp cho cây thủy sinh và tạo môi trường ẩm ướt cho cây. Dễ vệ sinh và bảo quản.',
                'price' => 120000,
                'image' => '/image.png',
                'material' => 'Thủy tinh',
                'size' => '12cm x 10cm',
                'drainage_holes' => false,
                'color' => 'Trong suốt',
                'brand' => 'Glass Garden',
            ],

            // Chậu gỗ
            [
                'name' => 'Chậu gỗ tự nhiên',
                'slug' => 'chau-go-tu-nhien',
                'description' => 'Chậu gỗ tự nhiên với thiết kế vuông vức, kích thước 25x25x20cm. Chất liệu gỗ tự nhiên, thân thiện với môi trường và bền đẹp. Phù hợp cho cây cảnh và cây hoa.',
                'price' => 180000,
                'image' => '/image.png',
                'material' => 'Gỗ tự nhiên',
                'size' => '25cm x 25cm x 20cm',
                'drainage_holes' => true,
                'color' => 'Nâu gỗ',
                'brand' => 'Wooden Pot',
            ],
            [
                'name' => 'Chậu gỗ tròn',
                'slug' => 'chau-go-tron',
                'description' => 'Chậu gỗ tròn với đường kính 20cm, cao 16cm. Chất liệu gỗ tự nhiên, thiết kế đẹp mắt và thân thiện với môi trường. Phù hợp cho cây cảnh nhỏ và cây hoa.',
                'price' => 150000,
                'image' => '/image.png',
                'material' => 'Gỗ tự nhiên',
                'size' => '20cm x 16cm',
                'drainage_holes' => true,
                'color' => 'Nâu gỗ',
                'brand' => 'Wooden Pot',
            ],

            // Chậu đá
            [
                'name' => 'Chậu đá granite',
                'slug' => 'chau-da-granite',
                'description' => 'Chậu đá granite với thiết kế vuông vức, kích thước 30x30x25cm. Chất liệu đá granite tự nhiên, bền đẹp và sang trọng. Phù hợp cho cây cảnh lớn và cây ăn quả.',
                'price' => 500000,
                'image' => '/image.png',
                'material' => 'Đá granite',
                'size' => '30cm x 30cm x 25cm',
                'drainage_holes' => true,
                'color' => 'Xám đá',
                'brand' => 'Stone Garden',
            ],
            [
                'name' => 'Chậu đá marble',
                'slug' => 'chau-da-marble',
                'description' => 'Chậu đá marble với thiết kế tròn, đường kính 25cm, cao 20cm. Chất liệu đá marble tự nhiên, bền đẹp và sang trọng. Phù hợp cho cây cảnh trang trí trong nhà.',
                'price' => 400000,
                'image' => '/image.png',
                'material' => 'Đá marble',
                'size' => '25cm x 20cm',
                'drainage_holes' => true,
                'color' => 'Trắng vân',
                'brand' => 'Stone Garden',
            ],

            // Chậu treo
            [
                'name' => 'Chậu treo macrame',
                'slug' => 'chau-treo-macrame',
                'description' => 'Chậu treo macrame với dây treo đan tay đẹp mắt, đường kính 18cm. Thiết kế bohemian, phù hợp cho việc treo cây cảnh trong nhà. Tiết kiệm không gian và tạo điểm nhấn.',
                'price' => 80000,
                'image' => '/image.png',
                'material' => 'Macrame + Nhựa',
                'size' => '18cm x 15cm',
                'drainage_holes' => true,
                'color' => 'Nâu dây',
                'brand' => 'Hanging Art',
            ],
            [
                'name' => 'Chậu treo kim loại',
                'slug' => 'chau-treo-kim-loai',
                'description' => 'Chậu treo kim loại với dây treo bằng thép không gỉ, đường kính 16cm. Thiết kế hiện đại, bền đẹp và dễ vệ sinh. Phù hợp cho việc treo cây cảnh ngoài trời.',
                'price' => 120000,
                'image' => '/image.png',
                'material' => 'Thép + Nhựa',
                'size' => '16cm x 14cm',
                'drainage_holes' => true,
                'color' => 'Bạc',
                'brand' => 'Metal Hanging',
            ],

            // Chậu thông minh
            [
                'name' => 'Chậu thông minh tự tưới nước',
                'slug' => 'chau-thong-minh-tu-tuoi-nuoc',
                'description' => 'Chậu thông minh tự tưới nước với hệ thống tưới nước tự động, kích thước 25x25x20cm. Giúp cây luôn có đủ nước mà không cần tưới thường xuyên. Phù hợp cho người bận rộn.',
                'price' => 350000,
                'image' => '/image.png',
                'material' => 'Nhựa + Hệ thống tưới',
                'size' => '25cm x 25cm x 20cm',
                'drainage_holes' => true,
                'color' => 'Trắng',
                'brand' => 'Smart Pot',
            ],
            [
                'name' => 'Chậu thông minh có đèn LED',
                'slug' => 'chau-thong-minh-co-den-led',
                'description' => 'Chậu thông minh có đèn LED với hệ thống chiếu sáng LED, kích thước 20x20x18cm. Giúp cây phát triển tốt trong điều kiện thiếu ánh sáng. Phù hợp cho cây cảnh trong nhà.',
                'price' => 400000,
                'image' => '/image.png',
                'material' => 'Nhựa + LED',
                'size' => '20cm x 20cm x 18cm',
                'drainage_holes' => true,
                'color' => 'Trắng',
                'brand' => 'Smart Pot',
            ]
        ];

        foreach ($pots as $pot) {
            Pot::firstOrCreate(
                ['slug' => $pot['slug']],
                $pot
            );
        }
    }
}
