<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        try {
        $query = Product::query();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            } else {
                $query->published();
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
                $query->byCategory($request->category);
            }

            // Filter by subcategory
            if ($request->has('subcategory') && $request->subcategory) {
                $query->where('subcategory', $request->subcategory);
            }

            // Filter by featured
            if ($request->has('featured') && $request->featured) {
                $query->featured();
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('content', 'like', "%{$search}%");
                });
        }

        // Sort
        $sortBy = $request->get('sortBy', 'created_at');
        $sortOrder = $request->get('sortOrder', 'desc');
        $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 15), 50);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
                'data' => ProductResource::collection($products->items()),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching products: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        try {
            $product = Product::published()->findOrFail($id);
            
            // Increment views
            $product->increment('views');
            
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
    }

    /**
     * Get products by category (for backward compatibility)
     */
    public function getByCategory($category)
    {
        try {
            $products = Product::published()
                ->byCategory($category)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => ProductResource::collection($products)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching products: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured products
     */
    public function getFeatured()
    {
        try {
            $products = Product::published()
                ->featured()
                ->orderBy('created_at', 'desc')
                ->get();

        return response()->json([
            'success' => true,
                'data' => ProductResource::collection($products)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching featured products: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        try {
            // Prepare data for validation
            $data = $request->all();
            
            // Remove fields that shouldn't be created (both camelCase and snake_case)
            $fieldsToRemove = ['id', 'created_at', 'updated_at', 'createdAt', 'updatedAt', 
                              'category_id', 'author_id', 'images', 'main_image'];
            foreach ($fieldsToRemove as $field) {
                unset($data[$field]);
            }
            
            // Handle title -> name mapping (frontend uses 'title', backend uses 'name')
            if (isset($data['title']) && !isset($data['name'])) {
                $data['name'] = $data['title'];
            }
            if (isset($data['title'])) {
                unset($data['title']); // Remove title since DB uses 'name'
            }
            
            // Auto-generate slug from name if not provided
            if (!isset($data['slug']) || empty($data['slug'])) {
                if (isset($data['name'])) {
                    $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
                }
            }
            
            // Handle images_json: Laravel cast will auto-convert array to JSON
            if (isset($data['images_json'])) {
                if ($data['images_json'] === '' || $data['images_json'] === null || $data['images_json'] === 'null') {
                    $data['images_json'] = null;
                } elseif (is_string($data['images_json']) && $data['images_json'] !== '') {
                    // If string, decode it to array for Laravel cast
                    $decoded = json_decode($data['images_json'], true);
                    $data['images_json'] = is_array($decoded) ? $decoded : null;
                }
                // If already array, leave it as is - Laravel cast will handle
            }
            
            // Handle tags: Laravel cast will auto-convert array to JSON
            if (isset($data['tags'])) {
                if ($data['tags'] === '' || $data['tags'] === null || $data['tags'] === 'null') {
                    $data['tags'] = null;
                } elseif (is_string($data['tags']) && $data['tags'] !== '') {
                    // If string, decode it to array for Laravel cast
                    $decoded = json_decode($data['tags'], true);
                    $data['tags'] = is_array($decoded) ? $decoded : null;
                }
                // If already array, leave it as is - Laravel cast will handle
            }
            
            // Handle boolean fields: convert string/number to boolean
            $booleanFields = ['is_featured', 'is_published', 'drainage_holes', 'is_waterproof', 'is_durable'];
            foreach ($booleanFields as $field) {
                if (isset($data[$field])) {
                    if (is_string($data[$field])) {
                        $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN);
                    } elseif (is_numeric($data[$field])) {
                        $data[$field] = (bool) $data[$field];
                    } else {
                        $data[$field] = (bool) $data[$field];
                    }
                }
            }
            
            // Handle numeric fields: ensure they are numbers, handle empty strings
            if (isset($data['price'])) {
                $data['price'] = ($data['price'] === '' || $data['price'] === null) ? null : 
                                (is_numeric($data['price']) ? (float) $data['price'] : 0);
            }
            if (isset($data['rating'])) {
                $data['rating'] = ($data['rating'] === '' || $data['rating'] === null) ? 0 : 
                                (is_numeric($data['rating']) ? (float) $data['rating'] : 0);
            }
            if (isset($data['pages'])) {
                $data['pages'] = ($data['pages'] === '' || $data['pages'] === null) ? null : 
                               (is_numeric($data['pages']) ? (int) $data['pages'] : 0);
            }
            if (isset($data['published_year'])) {
                $data['published_year'] = ($data['published_year'] === '' || $data['published_year'] === null) ? null : 
                                         (is_numeric($data['published_year']) ? (int) $data['published_year'] : null);
            }
            if (isset($data['views'])) {
                $data['views'] = ($data['views'] === '' || $data['views'] === null) ? 0 : 
                               (is_numeric($data['views']) ? (int) $data['views'] : 0);
            }
            if (isset($data['likes'])) {
                $data['likes'] = ($data['likes'] === '' || $data['likes'] === null) ? 0 : 
                               (is_numeric($data['likes']) ? (int) $data['likes'] : 0);
            }
            
            // Merge prepared data back to request
            $request->replace($data);
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'sometimes|string|max:255|unique:products',
                'description' => 'nullable|string',
                'content' => 'nullable|string',
                'category' => 'required|in:tool,book,pot,accessory,suggestion',
                'subcategory' => 'nullable|string|max:255',
                'price' => 'nullable|numeric|min:0',
                'image' => 'nullable|string|max:255',
                'images_json' => 'nullable|array',
                'brand' => 'nullable|string|max:255',
                'material' => 'nullable|string|max:255',
                'size' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:255',
                'status' => 'nullable|in:draft,published,archived',
                'is_featured' => 'nullable|boolean',
                'is_published' => 'nullable|boolean',
                'rating' => 'nullable|numeric|min:0|max:5',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                // Category-specific fields
                'usage' => 'nullable|string',
                'video_url' => 'nullable|string',
                'author' => 'nullable|string|max:255',
                'pages' => 'nullable|integer|min:0',
                'published_year' => 'nullable|integer|min:1900|max:' . date('Y'),
                'drainage_holes' => 'nullable|boolean',
                'is_waterproof' => 'nullable|boolean',
                'is_durable' => 'nullable|boolean',
                'difficulty_level' => 'nullable|in:beginner,intermediate,advanced',
                'season' => 'nullable|string|max:255',
                'plant_type' => 'nullable|string|max:255',
                'estimated_time' => 'nullable|string|max:255',
                'tags' => 'nullable|array',
                'link' => 'nullable|string',
            ]);

            $product = Product::create($validated);

        return response()->json([
            'success' => true,
                'data' => new ProductResource($product),
                'message' => 'Product created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating product: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            
            // Log update attempt for debugging
            Log::info('Product update attempt', [
                'product_id' => $id,
                'user_id' => $request->user() ? $request->user()->id : null,
                'data_keys' => array_keys($request->all())
            ]);
            
            // Handle camelCase mapping first
            $data = $request->all();
            
            // Map camelCase to snake_case
            if (isset($data['imageUrl'])) {
                $data['image'] = $data['imageUrl'];
                unset($data['imageUrl']);
            }
            if (isset($data['isDurable'])) {
                $data['is_durable'] = $data['isDurable'];
                unset($data['isDurable']);
            }
            if (isset($data['isWaterproof'])) {
                $data['is_waterproof'] = $data['isWaterproof'];
                unset($data['isWaterproof']);
            }
            if (isset($data['title'])) {
                $data['name'] = $data['title'];
                unset($data['title']);
            }
            
            // Handle boolean fields - convert string representations to actual booleans
            $booleanFields = ['is_featured', 'is_published', 'drainage_holes', 'is_waterproof', 'is_durable'];
            foreach ($booleanFields as $field) {
                if (isset($data[$field])) {
                    // Convert various string representations to boolean
                    if (is_string($data[$field])) {
                        $data[$field] = filter_var($data[$field], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
                    } elseif (is_numeric($data[$field])) {
                        $data[$field] = (bool) $data[$field];
                    }
                    // If already boolean, leave as is
                }
            }
            
            // Handle array fields properly for Laravel casts
            if (isset($data['tags'])) {
                if (is_string($data['tags'])) {
                    // If tags is string, try to decode JSON or convert to array
                    if ($data['tags'] === '' || $data['tags'] === 'null') {
                        $data['tags'] = null;
                    } else {
                        $decoded = json_decode($data['tags'], true);
                        $data['tags'] = is_array($decoded) ? $decoded : null;
                    }
                }
                // If already array or null, keep as is
            }
            
            if (isset($data['images_json'])) {
                if (is_string($data['images_json'])) {
                    // If images_json is string, try to decode JSON or convert to null
                    if ($data['images_json'] === '' || $data['images_json'] === 'null') {
                        $data['images_json'] = null;
                    } else {
                        $decoded = json_decode($data['images_json'], true);
                        $data['images_json'] = is_array($decoded) ? $decoded : null;
                    }
                }
                // If already array or null, keep as is
            }
            
            // Remove fields that shouldn't be updated
            unset($data['id'], $data['createdAt'], $data['updatedAt']);
            
            // If slug not provided but name changed, generate new slug with ID to prevent conflicts
            if (!isset($data['slug']) && isset($data['name'])) {
                $data['slug'] = \Illuminate\Support\Str::slug($data['name']) . '-' . $id;
            }
            
            // Merge back to request for validation
            $request->merge($data);
            
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:products,slug,' . $id,
                'description' => 'sometimes|required|string',
                'content' => 'nullable|string',
                'category' => 'sometimes|required|string|in:tool,book,pot,accessory,suggestion',
                'subcategory' => 'nullable|string|max:255',
                'price' => 'nullable|numeric|min:0',
                'image' => 'nullable|string|max:255',
                'images_json' => 'nullable',
                'brand' => 'nullable|string|max:255',
                'material' => 'nullable|string|max:255',
                'size' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:255',
                'status' => 'sometimes|required|in:draft,published,archived',
                'is_featured' => 'nullable|boolean',
                'is_published' => 'nullable|boolean',
                'rating' => 'nullable|numeric|min:0|max:5',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                'usage' => 'nullable|string',
                'video_url' => 'nullable|string',
                'author' => 'nullable|string|max:255',
                'pages' => 'nullable|integer|min:0',
                'published_year' => 'nullable|integer|min:1900|max:' . date('Y'),
                'drainage_holes' => 'nullable|boolean',
                'is_waterproof' => 'nullable|boolean',
                'is_durable' => 'nullable|boolean',
                'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced',
                'season' => 'nullable|string|max:255',
                'plant_type' => 'nullable|string|max:255',
                'estimated_time' => 'nullable|string|max:255',
                'tags' => 'nullable',
                'link' => 'nullable|string',
            ]);

            $product->update($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $product
            ]);
        } catch (\Throwable $e) {
            // Debug tạm thời, không giữ lại khi đưa lên production
            return response()->json([
                'success' => false,
                'error_type' => get_class($e),
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Simple test endpoint
     */
    public function test(Request $request, $id)
    {
        return response()->json([
            'success' => true,
            'message' => 'Test endpoint working!',
            'product_id' => $id,
            'method' => $request->method(),
            'data' => $request->all()
        ]);
    }

    /**
     * Test update endpoint without role check
     */
    public function testUpdate(Request $request, $id)
    {
        try {
            $product = Product::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Test update endpoint working!',
                'product_id' => $id,
                'method' => $request->method(),
                'data' => $request->all(),
                'product_name' => $product->name
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Test update error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified product.
     */
    public function destroy($id)
    {
        try {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting product: ' . $e->getMessage()
            ], 500);
        }
    }
}