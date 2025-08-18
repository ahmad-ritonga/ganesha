<?php

// RegisteredUserController.php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'recaptcha_site_key' => config('services.recaptcha.site_key')
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'phone' => 'nullable|string|max:15|regex:/^[0-9\-\+\(\)\ ]+$/',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'g-recaptcha-response' => 'required',
        ], [
            'g-recaptcha-response.required' => 'Please verify that you are not a robot.',
        ]);

        // Verify reCAPTCHA
        $this->verifyRecaptcha($request->input('g-recaptcha-response'));

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'user', // Default role for new registrations
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Redirect new users to home page (not dashboard)
        return redirect()->intended(route('home', absolute: false));
    }

    /**
     * Verify reCAPTCHA response
     */
    private function verifyRecaptcha(string $recaptchaResponse): void
    {
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret_key'),
            'response' => $recaptchaResponse,
            'remoteip' => request()->ip(),
        ]);

        $result = $response->json();

        if (!$result['success']) {
            throw new \Illuminate\Validation\ValidationException(
                validator([], []),
                ['g-recaptcha-response' => ['reCAPTCHA verification failed. Please try again.']]
            );
        }
    }
}
