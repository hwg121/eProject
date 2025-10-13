# Statistics Calculation Logic - Synchronized

## Overview
This document ensures that **Statistics Overview** and **Campaign Settings** use the **EXACT SAME** calculation logic.

## Rules Applied

### 1. **Total Content Items**
- **Logic:** Count only `status = 'published'`
- **Formula:** `Articles (published) + Videos (published) + Products (published)`
- **Backend:** `CampaignSettingController::getCurrentValue('content')`
- **Frontend:** Uses `campaignStats.content.current_value` from backend

### 2. **Total Views**
- **Logic:** Sum views from `status = 'published'` content ONLY
- **Formula:** `Sum(Articles.views WHERE status='published') + Sum(Videos.views WHERE status='published') + Sum(Products.views WHERE status='published')`
- **Backend:** `CampaignSettingController::getCurrentValue('views')`
- **Frontend:** Uses `campaignStats.views.current_value` from backend

### 3. **Average Rating**
- **Logic:** Calculate average from items with `status = 'published'` AND `rating >= 1`
- **Formula:** `AVG(rating) WHERE status='published' AND rating >= 1`
- **Excludes:** Items with rating = 0 or NULL (not yet rated)
- **Backend:** `CampaignSettingController::getCurrentValue('rating')`
- **Frontend:** Uses `campaignStats.rating.current_value` from backend

### 4. **Total Visitors**
- **Logic:** Count distinct visitors by IP hash
- **Formula:** `COUNT(DISTINCT ip_hash) FROM visitor_stats`
- **Backend:** `CampaignSettingController::getCurrentValue('visitors')`
- **Frontend:** Uses `campaignStats.visitors.current_value` or `visitorStats.totalVisitors`

## Implementation

### Backend (CampaignSettingController.php)
```php
case 'views':
    // Total views from published content only
    $articleViews = Article::where('status', 'published')->sum('views') ?? 0;
    $videoViews = Video::where('status', 'published')->sum('views') ?? 0;
    $productViews = Product::where('status', 'published')->sum('views') ?? 0;
    return (float) ($articleViews + $videoViews + $productViews);

case 'content':
    // Total content items (only published)
    $articles = Article::where('status', 'published')->count();
    $videos = Video::where('status', 'published')->count();
    $products = Product::where('status', 'published')->count();
    return (float) ($articles + $videos + $products);

case 'rating':
    // Average rating (only published, rating >= 1)
    $articles = Article::where('status', 'published')
        ->where('rating', '>=', 1)->pluck('rating');
    $videos = Video::where('status', 'published')
        ->where('rating', '>=', 1)->pluck('rating');
    $products = Product::where('status', 'published')
        ->where('rating', '>=', 1)->pluck('rating');
    $allContent = collect()->merge($articles)->merge($videos)->merge($products);
    return $allContent->count() > 0 ? (float) $allContent->avg() : 0.0;
```

### Frontend (StatisticsSection.tsx)
```typescript
const statisticsData = [
  { 
    label: 'Total Views', 
    value: campaignStats?.views?.current_value ?? stats.totalViews,  // Use backend value
  },
  { 
    label: 'Content Items', 
    value: campaignStats?.content?.current_value ?? calculatedTotal, // Use backend value
  },
  { 
    label: 'Avg Rating', 
    value: campaignStats?.rating?.current_value ?? stats.avgRating,  // Use backend value
  }
];
```

### Frontend (AdminDashboard.tsx)
```typescript
// These are fallback calculations, but backend values take priority
const totalViews = [...publishedOnly].reduce((sum, item) => sum + item.views, 0);
const totalContent = publishedArticles.length + publishedVideos.length + publishedProducts.length;
const avgRating = ratedContent.filter(item => item.rating >= 1).avg();
```

## Data Flow
1. **Backend** calculates all metrics using consistent logic
2. **Campaign Settings** displays backend values directly
3. **Statistics Overview** displays backend values (via `campaignStats`)
4. **AdminDashboard** calculates fallback values using same logic (rarely used)

## Result
✅ All statistics are synchronized
✅ Same calculation logic everywhere
✅ Single source of truth (backend)
✅ No more discrepancies between Statistics and Campaign Settings

