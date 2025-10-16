<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Traits\AuthorizesContent;

class ProductController extends Controller
{
    use AuthorizesContent;

    /**
     * Display a listing of products.
     */
    public function index(Request $request)
    {
        try {
        $query = Product::query()->with(['tags', 'authorUser', 'creator', 'updater']);

            // Filter by status
            // Check if user is authenticated admin/moderator
            $user = auth()->user();
            $isAdmin = $user && $user->role === 'admin';
            $isModerator = $user && $user->role === 'moderator';
            
            // Debug logging
            \Log::info('ProductController::index - Debug', [
                'isAdmin' => $isAdmin,
                'user_id' => auth()->id(),
                'user_role' => auth()->user() ? auth()->user()->role : 'not_authenticated',
                'status_param' => $request->get('status'),
                'has_status' => $request->has('status')
            ]);
            
            if ($isAdmin) {
                // Admin can see all, but if status param provided, filter by it
                if ($request->has('status') && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
                // If no status param or status=all, show all products for admin
            } else if ($isModerator) {
                // Moderator only sees their own content
                $query->where('author_id', $user->id);
                
                // Filter by status if provided
                if ($request->has('status') && $request->status !== 'all') {
                    $query->where('status', $request->status);
                }
            } else {
                // Public access: only show published products
                $query->where('status', 'published');
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

        // Sort - Featured items first, then by sortBy
        $query->orderBy('is_featured', 'desc');
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
            \Log::error('ProductController::index failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
                'user_id' => auth()->id(),
            ]);
            
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
            // Check if user is authenticated admin/moderator
            $user = auth()->user();
            $isAdmin = $user && $user->role === 'admin';
            $isModerator = $user && $user->role === 'moderator';
            
            if ($isAdmin) {
                // Admin can view any product (including archived)
                $product = Product::with(['tags', 'authorUser', 'creator', 'updater'])->findOrFail($id);
            } else if ($isModerator) {
                // Moderator can view their own products (any status)
                $product = Product::with(['tags', 'authorUser', 'creator', 'updater'])
                    ->where('author_id', $user->id)
                    ->findOrFail($id);
            } else {
                // Public can only view published products
                $product = Product::with(['tags', 'authorUser', 'creator', 'updater'])->published()->findOrFail($id);
            }
            
            // Use atomic increment to prevent race conditions
            Product::where('id', $id)->increment('views');
            $product->refresh();
            
            return response()->json([
                'success' => true,
                'data' => new ProductResource($product)
            ]);
        } catch (\Exception $e) {
            \Log::error('ProductController::show failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'user_id' => auth()->id(),
            ]);
            
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
            $products = Product::with('tags')
                ->published()
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
            $products = Product::with('tags')
                ->published()
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
            
            // Set default status based on role
            if (!isset($data['status']) || !$this->canSetStatus($data['status'])) {
                $data['status'] = $this->getDefaultStatus();
            }
            
            // Admin can set author_id, moderator cannot
            if (auth()->user()->role === 'admin') {
                // Admin can specify author_id from request, default to self
                if (!isset($data['author_id'])) {
                    $data['author_id'] = auth()->id();
                }
            } else {
                // Moderator: force author to self
                $data['author_id'] = auth()->id();
            }
            
            // Remove fields that shouldn't be created (both camelCase and snake_case)
            $fieldsToRemove = ['id', 'created_at', 'updated_at', 'createdAt', 'updatedAt', 
                              'category_id', 'images', 'main_image'];
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
            
            // Extract tags for pivot table syncing
            $tags = [];
            if (isset($data['tags'])) {
                if (is_array($data['tags'])) {
                    $tags = $data['tags'];
                } elseif (is_string($data['tags']) && $data['tags'] !== '' && $data['tags'] !== 'null') {
                    $decoded = json_decode($data['tags'], true);
                    $tags = is_array($decoded) ? $decoded : [];
                }
                // Remove tags from data since it's no longer a fillable column
                unset($data['tags']);
            }
            
            // Handle boolean fields: convert string/number to boolean
            $booleanFields = ['is_featured', 'drainage_holes', 'is_waterproof', 'is_durable'];
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
                'name' => 'required|string|min:2|max:100',
                'slug' => 'sometimes|string|max:255|unique:products',
                'description' => 'required|string|min:10|max:5000',
                'content' => 'nullable|string',
                'category' => 'required|in:tool,book,pot,accessory,suggestion',
                'subcategory' => 'nullable|string|max:100',
                'price' => 'nullable|numeric|min:0|max:999999',
                'image' => 'nullable|string|max:255',
                'images_json' => 'nullable|array',
                'brand' => 'nullable|string|max:50',
                'material' => 'nullable|string|max:100',
                'size' => 'nullable|string|max:50',
                'color' => 'nullable|string|max:50',
                'status' => 'nullable|in:draft,pending,published,archived',
                'is_featured' => 'nullable|boolean',
                'rating' => 'nullable|numeric|min:0|max:5',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                'author_id' => auth()->user()->role === 'admin' ? 'nullable|exists:users,id' : 'nullable',
                // Category-specific fields
                'usage' => 'nullable|string',
                'video_url' => 'nullable|string',
                'author' => 'nullable|string|min:2|max:100',
                'pages' => 'nullable|integer|min:1|max:10000',
                'published_year' => 'nullable|integer|min:1900|max:2100',
                'drainage_holes' => 'nullable|boolean',
                'is_waterproof' => 'nullable|boolean',
                'is_durable' => 'nullable|boolean',
                'difficulty_level' => 'nullable|in:beginner,intermediate,advanced',
                'season' => 'nullable|string|max:50',
                'plant_type' => 'nullable|string|max:100',
                'estimated_time' => 'nullable|string|max:50',
                'link' => 'nullable|string',
            ]);

            $product = Product::create($validated);
            
            // Sync tags via pivot table
            if (!empty($tags)) {
                $product->tags()->sync($tags);
                // Load tags relationship to return in response
                $product->load('tags');
            }
            
            // Load relationships for response
            $product->load(['author', 'creator', 'updater']);

        return response()->json([
            'success' => true,
                'data' => new ProductResource($product),
                'message' => 'Product created successfully'
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database-specific errors (duplicate entry, etc.)
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product with this name or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            \Log::error('ProductController::store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
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
            $product = Product::with(['tags', 'author', 'creator', 'updater'])->findOrFail($id);
            
            // Authorization check - moderator can only modify their own content
            if (!$this->canModifyContent($product)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only modify your own content.'
                ], 403);
            }
            
            // Handle camelCase mapping first
            $data = $request->all();
            $user = auth()->user();
            
            // Detect if this is a STATUS-ONLY change (quick action)
            $providedFields = array_keys($data);
            $isStatusOnly = count($providedFields) === 1 && isset($data['status']);
            
            // Detect if content was actually changed
            $contentFields = ['name', 'title', 'description', 'content', 'image', 'price', 'brand', 
                             'material', 'size', 'color', 'author', 'pages', 'published_year', 
                             'drainage_holes', 'is_waterproof', 'is_durable', 'difficulty_level', 
                             'season', 'plant_type', 'estimated_time', 'link', 'subcategory'];
            $isContentChanged = false;
            foreach ($contentFields as $field) {
                if (isset($data[$field]) && $data[$field] != $product->$field) {
                    $isContentChanged = true;
                    break;
                }
            }
            
            \Log::info('Product Update - Detection:', [
                'product_id' => $id,
                'user_role' => $user->role,
                'current_status' => $product->status,
                'new_status' => $data['status'] ?? 'not_set',
                'isStatusOnly' => $isStatusOnly,
                'isContentChanged' => $isContentChanged,
                'provided_fields' => $providedFields
            ]);
            
            // Moderator logic for status validation
            if ($user->role === 'moderator') {
                $currentStatus = $product->status;
                $newStatus = $data['status'] ?? $currentStatus;
                
                if ($isStatusOnly) {
                    // Quick status change - use transition rules
                    if (!$this->canTransitionStatus($currentStatus, $newStatus, false)) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid status transition. You cannot set this status.'
                        ], 403);
                    }
                } else if ($isContentChanged && $currentStatus === 'published') {
                    // Content edit on published item - force to pending
                    $data['status'] = 'pending';
                    \Log::info('Moderator edited published content - forcing to pending', [
                        'product_id' => $id,
                        'user_id' => $user->id,
                        'original_status' => $currentStatus
                    ]);
                }
                
                // Prevent moderator from changing author
                unset($data['author_id']);
            }
            
            // Admin can change author_id if provided
            // (no restrictions for admin)
            
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
            $booleanFields = ['is_featured', 'drainage_holes', 'is_waterproof', 'is_durable'];
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
            
            // Extract tags for pivot table syncing
            $tags = null;
            if (isset($data['tags'])) {
                if (is_array($data['tags'])) {
                    $tags = $data['tags'];
                } elseif (is_string($data['tags'])) {
                    if ($data['tags'] === '' || $data['tags'] === 'null') {
                        $tags = [];
                    } else {
                        $decoded = json_decode($data['tags'], true);
                        $tags = is_array($decoded) ? $decoded : [];
                    }
                }
                // Remove tags from data since it's no longer a fillable column
                unset($data['tags']);
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
            
            // Remove fields that shouldn't be updated
            unset($data['id'], $data['createdAt'], $data['updatedAt']);
            
            // If slug not provided but name changed, generate new slug with ID to prevent conflicts
            if (!isset($data['slug']) && isset($data['name'])) {
                $data['slug'] = \Illuminate\Support\Str::slug($data['name']) . '-' . $id;
            }
            
            // Merge back to request for validation
            $request->merge($data);
            
            $validated = $request->validate([
                'name' => 'sometimes|required|string|min:2|max:100',
                'slug' => 'nullable|string|max:255|unique:products,slug,' . $id,
                'description' => 'sometimes|required|string|min:10|max:5000',
                'content' => 'nullable|string',
                'category' => 'sometimes|required|string|in:tool,book,pot,accessory,suggestion',
                'subcategory' => 'nullable|string|max:100',
                'price' => 'nullable|numeric|min:0|max:999999',
                'image' => 'nullable|string|max:255',
                'images_json' => 'nullable',
                'brand' => 'nullable|string|max:50',
                'material' => 'nullable|string|max:100',
                'size' => 'nullable|string|max:50',
                'color' => 'nullable|string|max:50',
                'status' => 'sometimes|required|in:draft,pending,published,archived',
                'is_featured' => 'nullable|boolean',
                'rating' => 'nullable|numeric|min:0|max:5',
                'views' => 'nullable|integer|min:0',
                'likes' => 'nullable|integer|min:0',
                'author_id' => auth()->user()->role === 'admin' ? 'nullable|exists:users,id' : 'nullable',
                'usage' => 'nullable|string',
                'video_url' => 'nullable|string',
                'author' => 'nullable|string|min:2|max:100',
                'pages' => 'nullable|integer|min:1|max:10000',
                'published_year' => 'nullable|integer|min:1900|max:2100',
                'drainage_holes' => 'nullable|boolean',
                'is_waterproof' => 'nullable|boolean',
                'is_durable' => 'nullable|boolean',
                'difficulty_level' => 'nullable|string|in:beginner,intermediate,advanced',
                'season' => 'nullable|string|max:50',
                'plant_type' => 'nullable|string|max:100',
                'estimated_time' => 'nullable|string|max:50',
                'link' => 'nullable|string',
            ]);

            $product->update($validated);
            
            // Sync tags via pivot table if provided
            if ($tags !== null) {
                $product->tags()->sync($tags);
                // Reload tags relationship after sync
                $product->load('tags');
            }
            
            // Reload relationships for response
            $product->load(['author', 'creator', 'updater']);
            
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => new ProductResource($product)
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database-specific errors (duplicate entry, etc.)
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product with this name or slug already exists.'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Throwable $e) {
            \Log::error('ProductController::update failed', [
                'id' => $id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating product: ' . $e->getMessage()
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
        
        // Authorization check - moderator can only delete their own content
        if (!$this->canModifyContent($product)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only delete your own content.'
            ], 403);
        }
        
        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('ProductController::destroy failed', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting product: ' . $e->getMessage()
            ], 500);
        }
    }
}