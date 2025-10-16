# Testing Instructions - Content Authorship & Moderator Permissions

## Overview
This document provides comprehensive testing scenarios for the new content authorship and approval workflow system.

**IMPORTANT**: User must first run migrations on server:
```bash
php artisan migrate
```

---

## Test Scenario 1: Admin Workflow

### 1.1 Admin Create Product
**Steps:**
1. Login as Admin
2. Navigate to Product Management → Create
3. Verify:
   - ✓ Author dropdown is visible with list of all users
   - ✓ Status dropdown shows 4 options: Draft, Pending, Published, Archived
   - ✓ Default status is "Published"
4. Fill form and submit without selecting author
5. Check database:
   - ✓ `author_id` = admin's ID (auto-filled)
   - ✓ `created_by` = admin's ID
   - ✓ `updated_by` = admin's ID
   - ✓ `status` = 'published'

### 1.2 Admin Create with Custom Author
**Steps:**
1. Create product/article/video
2. Select different user from Author dropdown
3. Submit
4. Check database:
   - ✓ `author_id` = selected user's ID
   - ✓ `created_by` = admin's ID (who actually created it)
   - ✓ `updated_by` = admin's ID

### 1.3 Admin Edit Any Content
**Steps:**
1. Navigate to Product/Content List
2. Edit content created by moderator
3. Verify:
   - ✓ Can edit successfully
   - ✓ Can change author to anyone
   - ✓ Can change status to any value
4. Submit
5. Check database:
   - ✓ `updated_by` = admin's ID
   - ✓ `author_id` unchanged unless admin changed it

### 1.4 Admin View All Content
**Steps:**
1. Navigate to Product List / Content List
2. Verify:
   - ✓ See ALL products (from all authors)
   - ✓ See author name displayed on cards: "By: {author name}"
   - ✓ Can filter by status: Draft, Pending, Published, Archived

### 1.5 Admin Delete Any Content
**Steps:**
1. Try deleting content created by moderator
2. Verify:
   - ✓ Deletion succeeds
   - ✓ No authorization error

---

## Test Scenario 2: Moderator Workflow

### 2.1 Moderator Create Content
**Steps:**
1. Login as Moderator
2. Navigate to Product/Content Create
3. Verify:
   - ✓ NO author dropdown visible
   - ✓ NO status dropdown
   - ✓ Alert shown: "Your content will be submitted as Pending for admin approval"
4. Fill form and submit
5. Check database:
   - ✓ `author_id` = moderator's ID (forced)
   - ✓ `created_by` = moderator's ID
   - ✓ `updated_by` = moderator's ID
   - ✓ `status` = 'pending'

### 2.2 Moderator View Own Content Only
**Steps:**
1. Login as Moderator
2. Navigate to Product List / Content List
3. Verify:
   - ✓ See ONLY own content (author_id = moderator)
   - ✓ "My Content Only" chip displayed
   - ✓ Cannot see content from other users

### 2.3 Moderator Edit Own Content
**Steps:**
1. Edit own product/article/video
2. Verify:
   - ✓ Form opens successfully
   - ✓ NO author dropdown
   - ✓ NO status dropdown
   - ✓ Alert: "Saving changes will set status to Pending for admin review"
   - ✓ Created by / Updated by info displayed
3. Make changes and submit
4. Check database:
   - ✓ Changes saved
   - ✓ `status` = 'pending' (forced)
   - ✓ `updated_by` = moderator's ID

### 2.4 Moderator Edit Published Content
**Steps:**
1. Create content, have admin approve it (status = published)
2. Moderator edits the content
3. Make ANY content change (title, description, etc.)
4. Submit
5. Verify:
   - ✓ Status automatically changed to 'pending'
   - ✓ Content requires re-approval
   - ✓ Toast: "Content updated (pending admin review)"

### 2.5 Moderator Try to Edit Other's Content
**Steps:**
1. Login as Moderator A
2. Admin creates content with author = Moderator B
3. Moderator A tries to view/edit that content
4. Verify:
   - ✓ Content NOT visible in list
   - ✓ If accessing directly via URL: 403 error or "Not Found"

### 2.6 Moderator Try to Delete Other's Content
**Steps:**
1. Same setup as 2.5
2. Try to delete content of another user
3. Verify:
   - ✓ 403 Unauthorized error
   - ✓ Content not deleted

---

## Test Scenario 3: Quick Status Buttons (Moderator)

### 3.1 Draft Content - Submit Button
**Steps:**
1. Moderator creates content but doesn't submit (status = draft)
2. In list, verify buttons: [Submit] [Edit] [Delete]
3. Click "Submit" button (NOT Edit)
4. Confirm dialog appears
5. Click confirm
6. Verify:
   - ✓ Status changes to 'pending'
   - ✓ Content appears in admin's approval queue
   - ✓ No form opened (quick action)

### 3.2 Pending Content - Withdraw Button
**Steps:**
1. Content in pending status
2. Verify buttons: [Withdraw] [Edit] [Delete]
3. Click "Withdraw"
4. Verify:
   - ✓ Status changes to 'draft'
   - ✓ Removed from admin approval queue

### 3.3 Published Content - Archive Button
**Steps:**
1. Content in published status (admin approved)
2. Verify buttons: [Archive] [Edit] [Delete]
3. Click "Archive" (NOT Edit)
4. Confirm dialog appears
5. Verify:
   - ✓ Status changes to 'archived'
   - ✓ Content hidden from public
   - ✓ No form opened

### 3.4 Archived Content - Restore Button
**Steps:**
1. Content in archived status
2. Verify buttons: [Restore] [Delete]
3. Click "Restore"
4. Verify:
   - ✓ Status changes to 'draft'
   - ✓ Moderator can edit and resubmit

---

## Test Scenario 4: User Deletion Edge Case

### 4.1 Orphaned Content Handling
**Steps:**
1. Moderator creates content (author_id = moderator ID)
2. Admin deletes that moderator user
3. Check database:
   - ✓ Content still exists
   - ✓ `author_id` = NULL (onDelete: set null)
   - ✓ `created_by` = NULL
   - ✓ `updated_by` = NULL

### 4.2 Admin Reassign Orphaned Content
**Steps:**
1. Admin edits the orphaned content (author_id = NULL)
2. Select new author from dropdown
3. Submit
4. Check database:
   - ✓ `author_id` = new user's ID
   - ✓ Content now belongs to new user
   - ✓ `updated_by` = admin's ID

---

## Test Scenario 5: Status Workflow & Approval

### 5.1 Moderator → Admin Approval Flow
**Steps:**
1. Moderator creates product (status = pending)
2. Admin login → Navigate to "Approval Management"
3. Verify:
   - ✓ "Approval Management" menu visible (admin only)
   - ✓ Badge shows count = 1
   - ✓ Pending item appears in list
   - ✓ Shows author name (moderator)
   - ✓ Shows created date
   - ✓ Shows "Pending Review" badge

### 5.2 Admin Approve Content
**Steps:**
1. In Approval Management, click "Approve" button
2. Confirm dialog appears
3. Click confirm
4. Verify:
   - ✓ Item disappears from pending list
   - ✓ Badge count decreases to 0
   - ✓ Content status = 'published' in database
   - ✓ Content visible on public site
   - ✓ Toast: "Content approved and published!"

### 5.3 Admin Reject Content
**Steps:**
1. Moderator creates another content
2. Admin clicks "Reject" button
3. Verify:
   - ✓ Reject dialog opens with textarea
4. Enter reason: "Content needs more details"
5. Click "Reject"
6. Verify:
   - ✓ Item disappears from pending list
   - ✓ Status = 'draft' in database
   - ✓ Toast: "Content rejected: {reason}"
   - ✓ Moderator can see it in their draft list

### 5.4 Admin Edit Pending Content
**Steps:**
1. In Approval Management, click "Edit" icon button
2. Verify:
   - ✓ Navigate to edit form
   - ✓ Can modify content
   - ✓ Can change author
   - ✓ Can approve by changing status to 'published'
3. Change status to published
4. Submit
5. Verify:
   - ✓ Content approved without going back to approval page

### 5.5 Bulk Approve
**Steps:**
1. Moderators create 3 pending items
2. Admin navigates to Approval Management
3. Select all 3 items (checkboxes)
4. Click "Approve Selected (3)" button
5. Verify:
   - ✓ All 3 items approved
   - ✓ All 3 disappear from list
   - ✓ Badge count updates correctly

---

## Test Scenario 6: Display Created/Updated Info

### 6.1 View Creation Info
**Steps:**
1. Moderator creates content
2. Moderator edits the content
3. Open edit form
4. Verify display section shows:
   - ✓ "Created by: {Moderator Name} ({date/time})"
   - ✓ "Last updated by: {Moderator Name} ({date/time})"

### 6.2 View After Admin Edit
**Steps:**
1. Admin edits moderator's content
2. Open edit form
3. Verify:
   - ✓ "Created by: {Moderator Name} ({original date})"
   - ✓ "Last updated by: Admin ({new date/time})"

---

## Test Scenario 7: Status-Only vs Content Edit Detection

### 7.1 Quick Status Change (No Content Edit)
**Steps:**
1. Published content exists
2. Click "Archive" button (quick action)
3. Verify:
   - ✓ Status changes to archived
   - ✓ `updated_by` should IDEALLY not change (status-only)
   - ✓ No form was opened

### 7.2 Content Edit (Form Submit)
**Steps:**
1. Published content exists
2. Click "Edit" button (opens form)
3. Change title or description
4. Submit
5. Verify:
   - ✓ For moderator: Status forced to 'pending'
   - ✓ `updated_by` changes to current user
   - ✓ For admin: Can keep published status

---

## Test Scenario 8: API Response Validation

### 8.1 Check API Responses
**Action:** Make GET request to `/api/products/{id}`, `/api/articles/{id}`, `/api/videos/{id}`

**Expected Response Structure:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Product Name",
    "status": "pending",
    "author_id": 123,
    "created_by": 123,
    "updated_by": 456,
    "author": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "..."
    },
    "creator": {
      "id": 123,
      "name": "John Doe"
    },
    "updater": {
      "id": 456,
      "name": "Admin User"
    },
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Verify:**
- ✓ All new fields present
- ✓ Relationships loaded correctly
- ✓ No N+1 query issues (check server logs)

---

## Test Scenario 9: Cross-Content Type Testing

Repeat ALL above tests for:
- ✓ Products (all 5 categories: tool, book, pot, accessory, suggestion)
- ✓ Articles (Technique)
- ✓ Videos

Ensure consistent behavior across all content types.

---

## Test Scenario 10: Edge Cases

### 10.1 Empty Users List
**Steps:**
1. Delete all users except admin
2. Admin tries to create content
3. Verify:
   - ✓ Author dropdown shows only admin
   - ✓ No errors
   - ✓ Can still create content

### 10.2 Moderator with No Content
**Steps:**
1. Login as new moderator (no content yet)
2. Navigate to Product List
3. Verify:
   - ✓ Empty state message shown
   - ✓ "My Content Only" chip displayed
   - ✓ No errors

### 10.3 Public Access
**Steps:**
1. Logout (public access)
2. Access product/article/video list
3. Verify:
   - ✓ Only 'published' content visible
   - ✓ Draft, pending, archived content hidden
   - ✓ Direct access to non-published content returns 404

---

## Checklist Summary

### Database
- [ ] Migrations run successfully without errors
- [ ] Foreign keys created with onDelete('set null')
- [ ] Indexes created for author_id, created_by, updated_by
- [ ] Status enums updated to include 'pending'

### Backend API
- [ ] Admin can create with custom author_id
- [ ] Moderator creates with auto author_id = self
- [ ] Moderator filtered to own content only (index())
- [ ] Moderator edit published → auto pending
- [ ] Moderator quick status change → direct transition
- [ ] Moderator cannot edit/delete other's content (403)
- [ ] API responses include author, creator, updater

### Frontend Forms
- [ ] Admin sees author dropdown
- [ ] Admin sees 4-option status dropdown
- [ ] Moderator sees no dropdowns, only alerts
- [ ] Created by / Updated by info displayed correctly
- [ ] Forms receive users prop

### Frontend UI
- [ ] ContentStatusBadge shows correct colors/icons
- [ ] QuickStatusButtons render correctly per status
- [ ] Approval Management menu visible (admin only)
- [ ] Badge shows pending count
- [ ] "My Content Only" chip for moderator

### Approval Workflow
- [ ] Pending items appear in Approval Management
- [ ] Approve button works
- [ ] Reject dialog works
- [ ] Edit button navigates to edit form
- [ ] Bulk approve works
- [ ] Tabs filter correctly (Products/Articles/Videos)

### End-to-End
- [ ] No console errors
- [ ] No API errors (check Network tab)
- [ ] All status transitions work as expected
- [ ] Database integrity maintained after user deletion

---

## Common Issues & Troubleshooting

**Issue**: Moderator sees all content instead of own only
- **Check**: Backend ProductController index() has `where('author_id', $user->id)` for moderator

**Issue**: Moderator can set status to published
- **Check**: Frontend ProductForm forces status to 'pending' for moderator
- **Check**: Backend canSetStatus() returns false for 'published' when moderator

**Issue**: Created by / Updated by shows "Unknown"
- **Check**: API responses include creator/updater relationships
- **Check**: Controllers use `->with(['author', 'creator', 'updater'])`

**Issue**: User deletion breaks content
- **Check**: Migrations use `->onDelete('set null')` not `->onDelete('cascade')`

**Issue**: Quick status button doesn't work
- **Check**: handleQuickStatusChange only sends `{ status: newStatus }` (no other fields)
- **Check**: Backend detects $isStatusOnly correctly

---

## Performance Checks

- [ ] No N+1 queries (check Laravel query log)
- [ ] Indexes improve query performance
- [ ] Approval Management loads quickly with many pending items
- [ ] Bulk operations don't timeout

---

## Security Validation

- [ ] Moderator CANNOT access other's content (API returns 403)
- [ ] Moderator CANNOT change author_id
- [ ] Moderator CANNOT set status to 'published' directly
- [ ] Public users cannot access draft/pending/archived content
- [ ] Authorization checks prevent unauthorized actions

---

## Migration Rollback Test

**Steps:**
1. Run: `php artisan migrate:rollback --step=4`
2. Verify:
   - ✓ created_by, updated_by columns removed
   - ✓ Status enums reverted
   - ✓ No errors
3. Run: `php artisan migrate` again
4. Verify:
   - ✓ Migrations re-run successfully
   - ✓ All columns recreated

---

## Final Verification

After all tests pass:
1. Review all TODO checkboxes above
2. Check no TypeScript errors: `npm run build`
3. Check no linter warnings
4. Verify responsive design (mobile/tablet/desktop)
5. Test dark mode for all new components
6. Document any remaining issues or future enhancements

---

**Test Date:** _______________
**Tester:** _______________
**Pass/Fail:** _______________
**Notes:** _______________

