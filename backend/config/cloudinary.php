<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Cloudinary image and video management service.
    | Get these values from your Cloudinary dashboard.
    |
    */

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    
    /*
    |--------------------------------------------------------------------------
    | Upload Presets
    |--------------------------------------------------------------------------
    |
    | Different upload presets for different types of content
    |
    */
    
    'upload_presets' => [
        'featured_images' => env('CLOUDINARY_FEATURED_IMAGES_PRESET', null),
        'thumbnails' => env('CLOUDINARY_THUMBNAILS_PRESET', null),
        'covers' => env('CLOUDINARY_COVERS_PRESET', null),
        'product_images' => env('CLOUDINARY_PRODUCT_IMAGES_PRESET', null),
        'about_us' => env('CLOUDINARY_ABOUT_US_PRESET', null),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Default Transformations
    |--------------------------------------------------------------------------
    |
    | Default image transformations for different use cases
    |
    */
    
    'transformations' => [
        'thumbnail' => 'w_300,h_200,c_fill,f_auto,q_auto',
        'medium' => 'w_800,h_600,c_fill,f_auto,q_auto',
        'large' => 'w_1200,h_800,c_fill,f_auto,q_auto',
        'responsive' => 'f_auto,q_auto',
        'avatar' => 'w_150,h_150,c_fill,r_max,f_auto,q_auto',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Folders
    |--------------------------------------------------------------------------
    |
    | Organize images in different folders
    |
    */
    
    'folders' => [
        'featured_images' => 'featured-images',
        'thumbnails' => 'thumbnails',
        'covers' => 'covers',
        'product_images' => 'product-images',
        'about_us' => 'about-us',
        'avatars' => 'avatars',
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    |
    | Security settings for uploads
    |
    */
    
    'security' => [
        'max_file_size' => 10 * 1024 * 1024, // 10MB
        'allowed_formats' => ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        'allowed_mime_types' => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ],
];
