<?php

namespace App\Http\Controllers\Traits;

trait AuthorizesContent
{
    /**
     * Check if user can modify content (admin can modify all, moderator only own)
     */
    protected function canModifyContent($content): bool
    {
        $user = auth()->user();
        
        if (!$user) {
            return false;
        }
        
        // Admin can modify anything
        if ($user->role === 'admin') {
            return true;
        }
        
        // Moderator can only modify their own content
        if ($user->role === 'moderator') {
            return $content->author_id === $user->id;
        }
        
        return false;
    }
    
    /**
     * Get default status based on user role
     */
    protected function getDefaultStatus(): string
    {
        $user = auth()->user();
        
        if (!$user) {
            return 'draft';
        }
        
        // Admin content is published by default
        if ($user->role === 'admin') {
            return 'published';
        }
        
        // Moderator content needs approval
        if ($user->role === 'moderator') {
            return 'pending';
        }
        
        return 'draft';
    }
    
    /**
     * Check if user can set specific status
     */
    protected function canSetStatus(string $status): bool
    {
        $user = auth()->user();
        
        if (!$user) {
            return false;
        }
        
        // Admin can set any status
        if ($user->role === 'admin') {
            return true;
        }
        
        // Moderator can only set draft, pending, or archived
        if ($user->role === 'moderator') {
            return in_array($status, ['draft', 'pending', 'archived']);
        }
        
        return false;
    }
    
    /**
     * Check if user can transition from current status to new status
     * 
     * IMPORTANT WORKFLOW RULES:
     * 
     * MODERATOR có 2 loại actions:
     * 1. EDIT (vào form, sửa content) → Bất kỳ thay đổi nào → AUTO về Pending
     * 2. STATUS CHANGE (quick action ngoài list) → Không edit content, chỉ đổi status
     * 
     * @param string $currentStatus Current content status
     * @param string $newStatus Desired new status
     * @param bool $isContentChanged Whether content fields were modified (for edit detection)
     */
    protected function canTransitionStatus(
        string $currentStatus, 
        string $newStatus, 
        bool $isContentChanged = false
    ): bool {
        $user = auth()->user();
        
        if (!$user) {
            return false;
        }
        
        // Admin can do anything
        if ($user->role === 'admin') {
            return true;
        }
        
        // Moderator status transition rules
        if ($user->role === 'moderator') {
            // If content was changed (EDIT action), force to pending
            if ($isContentChanged && $currentStatus === 'published') {
                return $newStatus === 'pending'; // Must go to pending for re-approval
            }
            
            // Status-only transitions (quick actions, no content change)
            $allowedTransitions = [
                'draft' => ['pending'],                    // Submit for review
                'pending' => ['draft'],                    // Withdraw submission
                'published' => ['archived'],               // Take down (status button only)
                'archived' => ['draft', 'published'],      // Restore to draft for editing OR re-publish (no edit needed)
            ];
            
            return in_array($newStatus, $allowedTransitions[$currentStatus] ?? []);
        }
        
        return false;
    }
}

