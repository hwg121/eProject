<?php

namespace Database\Seeders;

use App\Models\StaffMember;
use Illuminate\Database\Seeder;

class StaffMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $staffMembers = [
            [
                'name' => 'John Smith',
                'role' => 'Founder & CEO',
                'short_bio' => 'Passionate gardener with over 15 years of experience in sustainable agriculture and organic farming.',
                'avatar' => 'https://ui-avatars.com/api/?name=John+Smith&size=200&background=10b981&color=fff',
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Sarah Johnson',
                'role' => 'Head of Content',
                'short_bio' => 'Expert writer and horticulturist dedicated to making gardening accessible to everyone.',
                'avatar' => 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=200&background=10b981&color=fff',
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Michael Chen',
                'role' => 'Senior Gardening Consultant',
                'short_bio' => 'Specialist in urban gardening and container plants with a Master\'s degree in Botany.',
                'avatar' => 'https://ui-avatars.com/api/?name=Michael+Chen&size=200&background=10b981&color=fff',
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Emily Rodriguez',
                'role' => 'Community Manager',
                'short_bio' => 'Building and nurturing our gardening community, connecting green thumbs worldwide.',
                'avatar' => 'https://ui-avatars.com/api/?name=Emily+Rodriguez&size=200&background=10b981&color=fff',
                'display_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'David Kim',
                'role' => 'Technical Specialist',
                'short_bio' => 'Expert in smart gardening systems and sustainable technology for modern agriculture.',
                'avatar' => 'https://ui-avatars.com/api/?name=David+Kim&size=200&background=10b981&color=fff',
                'display_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($staffMembers as $member) {
            StaffMember::create($member);
        }
    }
}

