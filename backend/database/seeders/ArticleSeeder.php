<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $trongTrotCategory = Category::where('slug', 'trong-trot')->first();
        $chamSocCategory = Category::where('slug', 'cham-soc')->first();
        $author = User::first(); // Lấy user đầu tiên làm author

        $articles = [
            // Bài viết về trồng trọt
            [
                'title' => 'Cách trồng cây xanh trong nhà',
                'slug' => 'cach-trong-cay-xanh-trong-nha',
                'excerpt' => 'Học cách trồng cây xanh trong nhà một cách hiệu quả, tạo không gian xanh mát và cải thiện chất lượng không khí',
                'body' => 'Trồng cây xanh trong nhà không chỉ giúp tạo không gian xanh mát mà còn cải thiện chất lượng không khí, giảm stress và tăng năng suất làm việc. Bài viết này sẽ hướng dẫn bạn từng bước cách chọn cây phù hợp với điều kiện ánh sáng trong nhà, chuẩn bị đất trồng, kỹ thuật tưới nước và chăm sóc cây trồng trong nhà. Chúng ta sẽ tìm hiểu về các loại cây dễ trồng như lưỡi hổ, trầu bà, cây kim tiền và cách tạo hệ thống tưới nước tự động.',
                'category_id' => $trongTrotCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Kỹ thuật trồng rau sạch tại nhà',
                'slug' => 'ky-thuat-trong-rau-sach-tai-nha',
                'excerpt' => 'Hướng dẫn chi tiết cách trồng rau sạch tại nhà, từ chọn giống đến thu hoạch',
                'body' => 'Trồng rau sạch tại nhà là xu hướng được nhiều gia đình quan tâm. Bài viết này sẽ hướng dẫn bạn cách thiết kế vườn rau mini, chọn giống rau phù hợp với khí hậu, kỹ thuật gieo hạt, chăm sóc và thu hoạch. Chúng ta sẽ tìm hiểu về các loại rau dễ trồng như rau muống, rau cải, cà chua, ớt và cách phòng trừ sâu bệnh hại một cách tự nhiên.',
                'category_id' => $trongTrotCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Cách trồng cây ăn quả trong chậu',
                'slug' => 'cach-trong-cay-an-qua-trong-chau',
                'excerpt' => 'Học cách trồng cây ăn quả trong chậu, tận dụng không gian nhỏ để có trái cây sạch',
                'body' => 'Trồng cây ăn quả trong chậu là giải pháp tuyệt vời cho những ai muốn có trái cây sạch nhưng không có đất vườn rộng. Bài viết này sẽ hướng dẫn bạn cách chọn giống cây phù hợp, kỹ thuật trồng, chăm sóc và tạo hình cho cây ăn quả trong chậu. Chúng ta sẽ tìm hiểu về các loại cây như chanh, ổi, táo, lê và cách tạo điều kiện tốt nhất cho cây phát triển.',
                'category_id' => $trongTrotCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Kỹ thuật trồng hoa hồng',
                'slug' => 'ky-thuat-trong-hoa-hong',
                'excerpt' => 'Hướng dẫn chi tiết cách trồng và chăm sóc hoa hồng để có những bông hoa đẹp nhất',
                'body' => 'Hoa hồng là loài hoa được yêu thích nhất trên thế giới. Bài viết này sẽ hướng dẫn bạn cách chọn giống hoa hồng phù hợp, kỹ thuật trồng, chăm sóc, cắt tỉa và phòng trừ sâu bệnh. Chúng ta sẽ tìm hiểu về các loại hoa hồng phổ biến, cách tạo điều kiện ánh sáng và dinh dưỡng tốt nhất, kỹ thuật nhân giống và cách giữ hoa tươi lâu.',
                'category_id' => $trongTrotCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Cách trồng cây thủy canh',
                'slug' => 'cach-trong-cay-thuy-canh',
                'excerpt' => 'Học cách trồng cây thủy canh, phương pháp trồng cây không cần đất hiện đại',
                'body' => 'Thủy canh là phương pháp trồng cây không cần đất, sử dụng dung dịch dinh dưỡng để cung cấp chất dinh dưỡng cho cây. Bài viết này sẽ hướng dẫn bạn cách thiết kế hệ thống thủy canh, chọn giống cây phù hợp, pha chế dung dịch dinh dưỡng và chăm sóc cây. Chúng ta sẽ tìm hiểu về các loại hệ thống thủy canh khác nhau và cách tối ưu hóa năng suất.',
                'category_id' => $trongTrotCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Chọn đất trồng phù hợp',
                'slug' => 'chon-dat-trong-phu-hop',
                'excerpt' => 'Hướng dẫn chọn loại đất trồng tốt nhất cho từng loại cây',
                'body' => 'Đất trồng là nền tảng quan trọng cho sự phát triển của cây. Bài viết này sẽ giúp bạn hiểu về các loại đất khác nhau, cách cải thiện đất và chọn đất phù hợp cho từng loại cây trồng. Chúng ta sẽ tìm hiểu về đất sét, đất cát, đất thịt và cách pha trộn đất để tạo ra hỗn hợp đất lý tưởng.',
                'category_id' => $trongTrotCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],

            // Bài viết về chăm sóc
            [
                'title' => 'Kỹ thuật tưới nước cho cây',
                'slug' => 'ky-thuat-tuoi-nuoc-cho-cay',
                'excerpt' => 'Tìm hiểu cách tưới nước đúng cách cho cây trồng',
                'body' => 'Tưới nước là một trong những yếu tố quan trọng nhất trong việc chăm sóc cây trồng. Bài viết này sẽ hướng dẫn bạn các kỹ thuật tưới nước hiệu quả, thời điểm tưới nước phù hợp và cách nhận biết cây cần nước. Chúng ta sẽ tìm hiểu về các loại hệ thống tưới nước tự động, cách tiết kiệm nước và tạo điều kiện tốt nhất cho cây hấp thụ nước.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Cách bón phân cho cây trồng',
                'slug' => 'cach-bon-phan-cho-cay-trong',
                'excerpt' => 'Hướng dẫn chi tiết cách bón phân cho cây trồng để cây phát triển tốt nhất',
                'body' => 'Bón phân là kỹ thuật quan trọng để cung cấp dinh dưỡng cho cây trồng. Bài viết này sẽ hướng dẫn bạn cách chọn loại phân phù hợp, thời điểm bón phân, kỹ thuật bón phân và cách tránh các lỗi thường gặp. Chúng ta sẽ tìm hiểu về các loại phân hữu cơ, phân vô cơ, phân vi sinh và cách tạo phân compost tại nhà.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Cách cắt tỉa cây cảnh',
                'slug' => 'cach-cat-tia-cay-canh',
                'excerpt' => 'Học cách cắt tỉa cây cảnh để tạo hình đẹp và kích thích cây phát triển',
                'body' => 'Cắt tỉa là kỹ thuật quan trọng để tạo hình cho cây cảnh và kích thích cây phát triển. Bài viết này sẽ hướng dẫn bạn cách chọn thời điểm cắt tỉa, kỹ thuật cắt tỉa, dụng cụ cần thiết và cách chăm sóc sau khi cắt tỉa. Chúng ta sẽ tìm hiểu về các kiểu cắt tỉa khác nhau và cách tạo hình cho từng loại cây.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Phòng trừ sâu bệnh cho cây',
                'slug' => 'phong-tru-sau-benh-cho-cay',
                'excerpt' => 'Các phương pháp phòng trừ sâu bệnh hiệu quả cho cây trồng',
                'body' => 'Sâu bệnh là vấn đề thường gặp khi trồng cây. Bài viết này sẽ hướng dẫn bạn cách nhận biết các loại sâu bệnh phổ biến, phương pháp phòng trừ tự nhiên và hóa học, giúp cây trồng luôn khỏe mạnh. Chúng ta sẽ tìm hiểu về các loại thuốc trừ sâu tự nhiên, cách tạo môi trường tốt cho cây và cách sử dụng các loại cây có tác dụng xua đuổi sâu bệnh.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Cách chăm sóc cây trong mùa đông',
                'slug' => 'cach-cham-soc-cay-trong-mua-dong',
                'excerpt' => 'Hướng dẫn chăm sóc cây trồng trong mùa đông để cây sống sót và phát triển tốt',
                'body' => 'Mùa đông là thời điểm khó khăn cho cây trồng. Bài viết này sẽ hướng dẫn bạn cách bảo vệ cây khỏi lạnh, điều chỉnh chế độ tưới nước, bón phân và cách tạo môi trường ấm áp cho cây. Chúng ta sẽ tìm hiểu về các loại cây chịu lạnh, cách che chắn cây và chuẩn bị cây cho mùa đông.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Cách nhân giống cây trồng',
                'slug' => 'cach-nhan-giong-cay-trong',
                'excerpt' => 'Học các phương pháp nhân giống cây trồng để có nhiều cây mới',
                'body' => 'Nhân giống cây trồng là kỹ thuật quan trọng để tạo ra nhiều cây mới từ cây mẹ. Bài viết này sẽ hướng dẫn bạn các phương pháp nhân giống như giâm cành, chiết cành, ghép cây và gieo hạt. Chúng ta sẽ tìm hiểu về thời điểm nhân giống, cách chọn cành giâm, kỹ thuật chiết cành và cách chăm sóc cây con.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],

            // Bài viết về dụng cụ
            [
                'title' => 'Dụng cụ làm vườn cần thiết',
                'slug' => 'dung-cu-lam-vuon-can-thiet',
                'excerpt' => 'Danh sách các dụng cụ làm vườn cơ bản mà mọi người làm vườn nên có',
                'body' => 'Để có một khu vườn đẹp và khỏe mạnh, bạn cần trang bị đầy đủ các dụng cụ làm vườn cần thiết. Bài viết này sẽ giới thiệu các loại dụng cụ cơ bản như cuốc, xẻng, kéo cắt cành, bình tưới nước, cách sử dụng và bảo quản chúng. Chúng ta sẽ tìm hiểu về các thương hiệu dụng cụ uy tín, cách chọn dụng cụ phù hợp và cách bảo trì để sử dụng lâu dài.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Cách chọn và sử dụng kéo cắt cành',
                'slug' => 'cach-chon-va-su-dung-keo-cat-canh',
                'excerpt' => 'Hướng dẫn chi tiết cách chọn và sử dụng kéo cắt cành hiệu quả',
                'body' => 'Kéo cắt cành là dụng cụ quan trọng trong việc chăm sóc cây. Bài viết này sẽ hướng dẫn bạn cách chọn kéo cắt cành phù hợp, kỹ thuật sử dụng an toàn, cách bảo quản và bảo trì. Chúng ta sẽ tìm hiểu về các loại kéo cắt cành khác nhau, cách mài lưỡi kéo và cách sử dụng đúng cách để tránh làm tổn thương cây.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Hệ thống tưới nước tự động cho vườn',
                'slug' => 'he-thong-tuoi-nuoc-tu-dong-cho-vuon',
                'excerpt' => 'Hướng dẫn thiết kế và lắp đặt hệ thống tưới nước tự động cho vườn',
                'body' => 'Hệ thống tưới nước tự động giúp tiết kiệm thời gian và đảm bảo cây được tưới nước đều đặn. Bài viết này sẽ hướng dẫn bạn cách thiết kế hệ thống tưới nước tự động, chọn thiết bị phù hợp, cách lắp đặt và vận hành. Chúng ta sẽ tìm hiểu về các loại hệ thống tưới nước khác nhau và cách tối ưu hóa hiệu quả.',
                'category_id' => $chamSocCategory->id,
                'author_id' => $author->id,
                'status' => 'published',
                'published_at' => now(),
            ],
        ];

        foreach ($articles as $article) {
            Article::firstOrCreate(
                ['slug' => $article['slug']],
                $article
            );
        }
    }
}
