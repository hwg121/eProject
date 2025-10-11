<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Tools
            [
                'name' => 'Xẻng trồng cây chuyên dụng',
                'slug' => 'xeng-trong-cay-chuyen-dung',
                'description' => 'Xẻng trồng cây làm từ thép không gỉ, chống gỉ sét, cán gỗ chắc chắn',
                'category' => 'tool',
                'subcategory' => 'Công cụ đào đất',
                'price' => 150000,
                'image' => '/images/tools/xeng-trong-cay.jpg',
                'brand' => 'GreenGarden',
                'material' => 'Thép không gỉ + Gỗ',
                'size' => 'L x 120cm',
                'color' => 'Nâu gỗ',
                'usage' => 'Đào đất, trồng cây, làm vườn',
                'video_url' => 'https://www.youtube.com/watch?v=example1',
                'link' => 'https://shopee.vn/xeng-trong-cay-chuyen-dung',
                'status' => 'published',
                'is_featured' => true,
                'rating' => 4.5,
                'views' => 1250,
                'likes' => 89
            ],
            [
                'name' => 'Bình tưới nước 2L',
                'slug' => 'binh-tuoi-nuoc-2l',
                'description' => 'Bình tưới nước 2 lít với vòi phun đa dạng, điều chỉnh được áp lực',
                'category' => 'tool',
                'subcategory' => 'Công cụ tưới nước',
                'price' => 89000,
                'image' => '/images/tools/binh-tuoi-nuoc.jpg',
                'brand' => 'AquaPro',
                'material' => 'Nhựa PP',
                'size' => '2L',
                'color' => 'Xanh lá',
                'usage' => 'Tưới nước cho cây trồng',
                'video_url' => 'https://www.youtube.com/watch?v=example2',
                'link' => 'https://shopee.vn/binh-tuoi-nuoc-2l',
                'status' => 'published',
                'is_featured' => false,
                'rating' => 4.3,
                'views' => 980,
                'likes' => 67
            ],
            
            // Books
            [
                'name' => 'Nghệ thuật trồng cây từ A-Z',
                'slug' => 'nghe-thuat-trong-cay-tu-a-z',
                'description' => 'Cuốn sách hướng dẫn chi tiết về nghệ thuật trồng cây, từ cơ bản đến nâng cao',
                'category' => 'book',
                'subcategory' => 'Nghệ thuật làm vườn',
                'price' => 200000,
                'image' => '/images/books/nghe-thuat-trong-cay.jpg',
                'author' => 'Nguyễn Văn A',
                'pages' => 300,
                'published_year' => 2024,
                'brand' => 'NXB Nông nghiệp',
                'link' => 'https://tiki.vn/nghe-thuat-trong-cay-tu-a-z',
                'status' => 'published',
                'is_featured' => true,
                'rating' => 4.8,
                'views' => 2100,
                'likes' => 156
            ],
            [
                'name' => 'Cây cảnh trong nhà - Hướng dẫn chăm sóc',
                'slug' => 'cay-canh-trong-nha-huong-dan-cham-soc',
                'description' => 'Hướng dẫn chọn và chăm sóc cây cảnh trong nhà một cách hiệu quả',
                'category' => 'book',
                'subcategory' => 'Chăm sóc cây cảnh',
                'price' => 150000,
                'image' => '/images/books/cay-canh-trong-nha.jpg',
                'author' => 'Trần Thị B',
                'pages' => 250,
                'published_year' => 2023,
                'brand' => 'NXB Thực vật',
                'link' => 'https://tiki.vn/cay-canh-trong-nha-huong-dan-cham-soc',
                'status' => 'published',
                'is_featured' => false,
                'rating' => 4.6,
                'views' => 1750,
                'likes' => 123
            ],
            
            // Pots
            [
                'name' => 'Chậu đất nung truyền thống',
                'slug' => 'chau-dat-nung-truyen-thong',
                'description' => 'Chậu đất nung truyền thống, thấm nước tốt, phù hợp với nhiều loại cây',
                'category' => 'pot',
                'subcategory' => 'Chậu đất nung',
                'price' => 100000,
                'image' => '/images/pots/chau-dat-nung.jpg',
                'material' => 'Clay',
                'size' => '20cm',
                'drainage_holes' => true,
                'color' => 'Đỏ nâu',
                'brand' => 'Traditional',
                'link' => 'https://shopee.vn/chau-dat-nung-truyen-thong',
                'status' => 'published',
                'is_featured' => true,
                'rating' => 4.7,
                'views' => 890,
                'likes' => 45
            ],
            [
                'name' => 'Chậu nhựa đa năng',
                'slug' => 'chau-nhua-da-nang',
                'description' => 'Chậu nhựa nhẹ và bền, nhiều màu sắc, dễ vệ sinh',
                'category' => 'pot',
                'subcategory' => 'Chậu nhựa',
                'price' => 50000,
                'image' => '/images/pots/chau-nhua.jpg',
                'material' => 'Plastic',
                'size' => '15cm',
                'drainage_holes' => true,
                'color' => 'Xanh lá',
                'brand' => 'Modern',
                'link' => 'https://shopee.vn/chau-nhua-da-nang',
                'status' => 'published',
                'is_featured' => false,
                'rating' => 4.2,
                'views' => 650,
                'likes' => 32
            ],
            
            // Accessories
            [
                'name' => 'Phụ kiện trang trí mini',
                'slug' => 'phu-kien-trang-tri-mini',
                'description' => 'Bộ phụ kiện trang trí mini cho cây cảnh, tạo không gian đẹp mắt',
                'category' => 'accessory',
                'subcategory' => 'Trang trí',
                'price' => 25000,
                'image' => '/images/accessories/phu-kien-trang-tri.jpg',
                'material' => 'Nhựa',
                'size' => 'Nhỏ',
                'color' => 'Nhiều màu',
                'brand' => 'DecoStyle',
                'is_waterproof' => false,
                'is_durable' => true,
                'link' => 'https://shopee.vn/phu-kien-trang-tri-mini',
                'status' => 'published',
                'is_featured' => true,
                'rating' => 4.4,
                'views' => 720,
                'likes' => 38
            ],
            [
                'name' => 'Hệ thống tưới nước tự động',
                'slug' => 'he-thong-tuoi-nuoc-tu-dong',
                'description' => 'Hệ thống tưới nước tự động với bộ điều khiển thông minh',
                'category' => 'accessory',
                'subcategory' => 'Tưới nước',
                'price' => 150000,
                'image' => '/images/accessories/he-thong-tuoi-nuoc.jpg',
                'material' => 'Nhựa + Kim loại',
                'size' => 'Trung bình',
                'color' => 'Xanh',
                'brand' => 'AquaTech',
                'is_waterproof' => true,
                'is_durable' => true,
                'link' => 'https://shopee.vn/he-thong-tuoi-nuoc-tu-dong',
                'status' => 'published',
                'is_featured' => false,
                'rating' => 4.6,
                'views' => 1100,
                'likes' => 78
            ],
            
            // Suggestions
            [
                'name' => 'Cách trồng cây xanh trong nhà',
                'slug' => 'cach-trong-cay-xanh-trong-nha',
                'description' => 'Hướng dẫn chi tiết cách trồng và chăm sóc cây xanh trong nhà hiệu quả',
                'category' => 'suggestion',
                'subcategory' => 'Hướng dẫn cơ bản',
                'difficulty_level' => 'beginner',
                'season' => 'Quanh năm',
                'plant_type' => 'Cây trong nhà',
                'estimated_time' => '30 phút/ngày',
                'tags' => json_encode(['cây trong nhà', 'chăm sóc', 'hướng dẫn']),
                'image' => '/images/suggestions/cay-xanh-trong-nha.jpg',
                'link' => 'https://blog.greengroves.vn/cach-trong-cay-xanh-trong-nha',
                'status' => 'published',
                'is_featured' => true,
                'rating' => 4.5,
                'views' => 1000,
                'likes' => 50
            ],
            [
                'name' => '10 loại cây dễ trồng nhất cho người mới',
                'slug' => '10-loai-cay-de-trong-nhat-cho-nguoi-moi',
                'description' => 'Danh sách các loại cây dễ trồng và chăm sóc cho người mới bắt đầu',
                'category' => 'suggestion',
                'subcategory' => 'Cây trồng',
                'difficulty_level' => 'beginner',
                'season' => 'Quanh năm',
                'plant_type' => 'Đa dạng',
                'estimated_time' => '15 phút/ngày',
                'tags' => json_encode(['cây dễ trồng', 'người mới', 'danh sách']),
                'image' => '/images/suggestions/cay-de-trong.jpg',
                'link' => 'https://blog.greengroves.vn/10-loai-cay-de-trong-nhat-cho-nguoi-moi',
                'status' => 'published',
                'is_featured' => false,
                'rating' => 4.3,
                'views' => 800,
                'likes' => 40
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
