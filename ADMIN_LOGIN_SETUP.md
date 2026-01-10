# Admin Login Setup Guide

## Overview

The admin dashboard is now protected with authentication. You need to set up login credentials using environment variables.

## Setup Instructions

### 1. Add Environment Variables

Add the following variables to your `.env.local` file:

```env
# Admin Login Credentials
NEXT_PUBLIC_ADMIN_EMAIL=admin@starz.com
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

**⚠️ Important Security Notes:**
- Change these default credentials immediately!
- Use a strong password in production
- Never commit `.env.local` to git (it should already be in `.gitignore`)

### 2. Access the Admin Dashboard

1. Navigate to: `http://localhost:3000/admin/login` (or your production URL)
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

### 3. Default Credentials

**Default Email:** `admin@starz.com`  
**Default Password:** `admin123`

**⚠️ Change these immediately after first login!**

## Features

- ✅ Secure login page
- ✅ Session persistence (stays logged in until logout)
- ✅ Automatic redirect to login if not authenticated
- ✅ Logout button in admin dashboard
- ✅ User email display in header

## Security Recommendations

1. **Use Strong Passwords:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Avoid common words or patterns

2. **Change Default Credentials:**
   ```env
   NEXT_PUBLIC_ADMIN_EMAIL=your-secure-email@starz.com
   NEXT_PUBLIC_ADMIN_PASSWORD=YourStrongPassword123!@#
   ```

3. **For Production:**
   - Consider implementing Firebase Authentication for better security
   - Add rate limiting to prevent brute force attacks
   - Use HTTPS only
   - Consider adding 2FA (two-factor authentication)

## Troubleshooting

**Can't log in?**
- Check that environment variables are set correctly
- Restart your Next.js dev server after changing `.env.local`
- Clear browser localStorage if session is stuck

**Session expires unexpectedly?**
- Check browser settings (private mode may clear localStorage)
- Ensure cookies/localStorage are enabled

## Future Enhancements

- [ ] Firebase Authentication integration
- [ ] Multiple admin users
- [ ] Password reset functionality
- [ ] Session timeout
- [ ] Activity logging
- [ ] Two-factor authentication
