/**
 * Simple authentication utilities for admin dashboard
 * Uses environment variables for credentials
 */

export interface AuthUser {
  email: string;
  name: string;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('admin_authenticated') === 'true';
}

// Authenticate user
export function login(email: string, password: string): boolean {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@starz.com';
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
  
  if (email === adminEmail && password === adminPassword) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', email);
      localStorage.setItem('admin_login_time', new Date().toISOString());
    }
    return true;
  }
  return false;
}

// Logout user
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_login_time');
  }
}

// Get current user
export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  if (!isAuthenticated()) return null;
  
  const email = localStorage.getItem('admin_email') || 'admin@starz.com';
  return {
    email,
    name: 'Admin',
  };
}
