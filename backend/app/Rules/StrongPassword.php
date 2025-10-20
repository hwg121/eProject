<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrongPassword implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Check minimum length
        if (strlen($value) < 8) {
            $fail('The :attribute must be at least 8 characters.');
        }

        // Check for at least one uppercase letter
        if (!preg_match('/[A-Z]/', $value)) {
            $fail('The :attribute must contain at least one uppercase letter.');
        }

        // Check for at least one lowercase letter
        if (!preg_match('/[a-z]/', $value)) {
            $fail('The :attribute must contain at least one lowercase letter.');
        }

        // Check for at least one number
        if (!preg_match('/[0-9]/', $value)) {
            $fail('The :attribute must contain at least one number.');
        }

        // Check for at least one special character
        // In character class: \/ for slash, \\\\ for backslash (escaped twice for PHP string then regex)
        if (!preg_match('/[!@#$%^&*()\[\]{}<>,.?":;|_+=\-\/\\\\`~\']/', $value)) {
            $fail('The :attribute must contain at least one special character (!@#$%^&*...).');
        }

        // Check maximum length
        if (strlen($value) > 128) {
            $fail('The :attribute must not exceed 128 characters.');
        }
    }
}

