<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
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
            'id' => $contactMessage->id,
            'created_at' => $contactMessage->created_at,
            'message' => 'Thank you for contacting us! We will respond as soon as possible.'
        ], 201);
    }

    public function index(): JsonResponse
    {
        try {
            $messages = ContactMessage::orderBy('created_at', 'desc')->get();
            return response()->json($messages, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching contact messages: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $message = ContactMessage::findOrFail($id);
            return response()->json($message, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Contact message not found'
            ], 404);
        }
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

        return response()->json($message, 200);
    }

    public function destroy($id): JsonResponse
    {
        try {
            $message = ContactMessage::findOrFail($id);
            $messageName = $message->name;
            $messageSubject = $message->subject;
            $message->delete();
            
            // Log contact message deletion
            $user = Auth::user();
            $description = $user 
                ? "{$user->name} deleted contact message from {$messageName}: {$messageSubject}"
                : "Contact message deleted: {$messageSubject}";
            
            ActivityLog::logPublic(
                'deleted',
                'contact_message',
                $id,
                $messageSubject,
                $description
            );

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting contact message: ' . $e->getMessage()
            ], 500);
        }
    }
}

