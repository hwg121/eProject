<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        // Get client IP and User Agent
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        // Create contact message
        $contactMessage = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'unread',
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        // In a real app, you would send an email notification here
        // Mail::to('info@greengroves.com')->send(new ContactMail($contactMessage));

        return response()->json([
            'message' => 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.',
            'success' => true,
            'data' => [
                'id' => $contactMessage->id,
                'created_at' => $contactMessage->created_at
            ]
        ], 201);
    }

    public function index(): JsonResponse
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->get();
        return response()->json($messages);
    }

    public function show($id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        return response()->json($message);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'sometimes|in:unread,read,replied',
            'admin_reply' => 'nullable|string|max:2000',
        ]);

        if (isset($validated['admin_reply'])) {
            $validated['replied_at'] = now();
            $validated['status'] = 'replied';
        }

        $message->update($validated);

        return response()->json([
            'message' => 'Contact message updated successfully',
            'data' => $message
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Contact message deleted successfully'
        ]);
    }
}

