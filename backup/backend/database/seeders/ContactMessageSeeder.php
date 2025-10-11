<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContactMessage;
use App\Models\User;

class ContactMessageSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'moderator')->take(3)->get();

        $messages = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'subject' => 'Question about plant care',
                'message' => 'Hi, I have a question about caring for my indoor plants. They seem to be wilting despite regular watering. Could you please provide some advice?',
                'status' => 'read',
                'admin_reply' => 'Thank you for your question. Wilting can be caused by overwatering. Make sure to let the soil dry out between waterings and check for proper drainage.',
                'replied_at' => now()->subDays(2),
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'user_id' => $users->count() > 0 ? $users[0]->id : null,
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
                'subject' => 'Garden tool recommendation',
                'message' => 'I\'m looking for recommendations on the best pruning shears for my fruit trees. What would you suggest for a beginner?',
                'status' => 'read',
                'admin_reply' => 'For beginners, I recommend our Ergonomic Pruning Shears. They have a comfortable grip and sharp blades perfect for fruit trees.',
                'replied_at' => now()->subDays(1),
                'ip_address' => '192.168.1.101',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'user_id' => $users->count() > 1 ? $users[1]->id : null,
            ],
            [
                'name' => 'Mike Davis',
                'email' => 'mike.davis@example.com',
                'subject' => 'Complaint about product',
                'message' => 'I recently purchased a garden hose from your store and it started leaking after just two weeks of use. This is unacceptable quality.',
                'status' => 'replied',
                'admin_reply' => 'We apologize for the inconvenience. Please contact our customer service team with your order number and we will arrange a replacement or refund.',
                'replied_at' => now()->subHours(6),
                'ip_address' => '192.168.1.102',
                'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
                'user_id' => $users->count() > 2 ? $users[2]->id : null,
            ],
            [
                'name' => 'Emily Brown',
                'email' => 'emily.brown@example.com',
                'subject' => 'Feature request',
                'message' => 'I love your gardening guides! Would it be possible to add a section for seasonal gardening tips? This would be very helpful.',
                'status' => 'unread',
                'admin_reply' => null,
                'replied_at' => null,
                'ip_address' => '192.168.1.103',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'user_id' => null,
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@example.com',
                'subject' => 'Thank you',
                'message' => 'Thank you for the excellent customer service! My plants are doing much better after following your advice.',
                'status' => 'read',
                'admin_reply' => 'We\'re so glad to hear that! Thank you for your kind words and for being a valued customer.',
                'replied_at' => now()->subHours(12),
                'ip_address' => '192.168.1.104',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
                'user_id' => null,
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa.anderson@example.com',
                'subject' => 'Partnership inquiry',
                'message' => 'I run a local gardening club and would love to discuss potential partnership opportunities with your platform.',
                'status' => 'unread',
                'admin_reply' => null,
                'replied_at' => null,
                'ip_address' => '192.168.1.105',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'user_id' => null,
            ],
        ];

        foreach ($messages as $message) {
            ContactMessage::create($message);
        }
    }
}
