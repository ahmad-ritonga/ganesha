<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        // Determine the view path based on user role
        $viewPath = $isAdmin ? 'admin/settings/profile' : 'settings/profile';

        return Inertia::render($viewPath, [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'user' => $user->only(['id', 'name', 'email', 'phone', 'role']),
            'isAdmin' => $isAdmin,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Redirect based on user role
        if ($user->role === 'admin') {
            return to_route('admin.settings.profile.edit')->with('status', 'Profile updated successfully.');
        }

        return to_route('profile.edit')->with('status', 'Profile updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Show appropriate message based on role
        if ($isAdmin) {
            return redirect('/')->with('status', 'Admin account deleted successfully.');
        }

        return redirect('/')->with('status', 'Account deleted successfully.');
    }

    /**
     * Show admin user management profile edit (for editing other users)
     */
    public function editUser(Request $request, $userId): Response
    {
        // Only admin can edit other users
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $user = \App\Models\User::findOrFail($userId);

        return Inertia::render('admin/users/edit', [
            'editUser' => $user->only(['id', 'name', 'email', 'phone', 'role']),
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update other user's profile (admin only)
     */
    public function updateUser(ProfileUpdateRequest $request, $userId): RedirectResponse
    {
        // Only admin can edit other users
        if ($request->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $user = \App\Models\User::findOrFail($userId);
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return to_route('admin.users.index')->with('status', 'User profile updated successfully.');
    }
}
