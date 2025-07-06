# Deployment Instructions for Vercel

## Prerequisites

1. **Firebase Project Setup**: Your Firebase project should be configured with:

   - Authentication enabled
   - Firestore database
   - Storage (if using images)

2. **GitHub Repository**: Your code should be pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Get Your Firebase Configuration

Go to Firebase Console → Project Settings → General tab → "Your apps" section.

Copy these values for your environment variables:

### 2. Deploy to Vercel

1. **Go to Vercel** ([vercel.com](https://vercel.com))
2. **Connect GitHub**: Link your GitHub repository
3. **Import Project**: Click "Import" on your repository
4. **Vercel will auto-detect Next.js** and configure build settings automatically

### 3. Set Environment Variables in Vercel

In your Vercel dashboard, go to **Settings → Environment Variables** and add:

#### Firebase Client Configuration (Required)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Firebase Admin Configuration (For server-side operations)

```
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
```

**Note**: For the private key, copy the entire key from your service account JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts.

### 4. Configure Domain (Optional)

- Set up a custom domain in Vercel settings
- Configure DNS records as instructed

## Important Security Notes

⚠️ **Never commit sensitive files to your repository:**

- `service-account-key.json` should NOT be in your git repository
- Use environment variables for all sensitive data

✅ **Files already excluded from git:**

- `service-account-key.json`
- `.env*` files
- Firebase debug logs

## Production Considerations

### Admin Access

- The admin script (`scripts/make-me-admin.js`) is for local development only
- In production, manage admin users through Firebase Console or create a proper admin management system

### Firebase Security Rules

Make sure your Firestore security rules are properly configured:

```javascript
// Example security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Products can be read by anyone, but only admins can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null &&
                     request.auth.token.role == 'admin';
    }
  }
}
```

### Performance Optimization

- Images are automatically optimized by Vercel
- Static assets are served via CDN
- Vercel handles caching automatically

## Vercel Benefits

✅ **Automatic Next.js optimization**
✅ **Built-in image optimization**
✅ **Edge functions support**
✅ **Automatic HTTPS**
✅ **Global CDN**
✅ **Preview deployments for every push**

## Troubleshooting

**Build fails?**

- Check that all environment variables are set correctly
- Verify Firebase configuration values
- Check Vercel build logs

**Authentication not working?**

- Ensure Firebase Auth domain includes your Vercel domain
- Check Firebase console → Authentication → Settings → Authorized domains

**Admin panel not accessible?**

- Verify user has admin role in Firestore
- Check Firebase security rules allow admin access

## Testing

After deployment:

1. ✅ Test user registration/login
2. ✅ Test product browsing
3. ✅ Test admin login (with your admin account)
4. ✅ Test admin dashboard access
5. ✅ Test all core functionality

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Firebase configuration
4. Check Firebase security rules

## Quick Commands

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy from command line (optional)
vercel --prod
```
