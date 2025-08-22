# Instagram Feed Setup Instructions

## Overview
The website now includes an Instagram feed that displays real posts from @danielscoffeeandmore. Currently, it shows fallback images until you configure the Instagram API.

## Quick Setup (5 minutes)

### Step 1: Create Facebook Developer Account
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click "Get Started" and create an account
3. Verify your account if prompted

### Step 2: Create a Facebook App
1. Click "Create App" → "Consumer" → "Next"
2. Enter app details:
   - **App Name**: "Daniel's Coffee Website"
   - **App Contact Email**: Your email
3. Click "Create App"

### Step 3: Add Instagram Basic Display
1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Click "Create New App" if prompted

### Step 4: Configure Instagram Basic Display
1. Go to Instagram Basic Display → Basic Display
2. Add Instagram Test User:
   - Click "Add or Remove Instagram Testers"
   - Add the Instagram username: `danielscoffeeandmore`
3. Accept the invitation in Instagram:
   - Go to Instagram app → Settings → Apps and Websites
   - Accept the tester invitation

### Step 5: Generate Access Token
1. In Basic Display settings, click "Generate Token"
2. Select the Instagram account: `danielscoffeeandmore`
3. Authorize the app (login to Instagram if needed)
4. Copy the generated access token

### Step 6: Update Website Configuration
1. Open `script.js` in your code editor
2. Find this line:
   ```javascript
   accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE',
   ```
3. Replace `YOUR_INSTAGRAM_ACCESS_TOKEN_HERE` with your actual token:
   ```javascript
   accessToken: 'IGQVJXa1FxYourActualTokenHere...',
   ```
4. Save the file

## Testing
1. Refresh your website
2. Scroll to the Instagram section
3. You should see real Instagram posts loading

## Troubleshooting

### "Unable to load Instagram posts"
- Check that your access token is correct
- Ensure the Instagram account accepted the tester invitation
- Verify the app is in Development mode (not Live)

### Posts not updating
- Instagram Basic Display tokens expire every 60 days
- You'll need to regenerate the token periodically
- Consider upgrading to Instagram Graph API for longer-lived tokens

### Rate Limits
- Instagram Basic Display allows 200 requests per hour
- The website caches posts to minimize API calls

## Advanced Configuration

### Customize Number of Posts
In `script.js`, change the `limit` value:
```javascript
limit: 9, // Shows 9 posts instead of 6
```

### Custom Post Template
You can customize how posts appear by modifying the `template` in `script.js`.

### Automatic Token Refresh
For production use, consider implementing server-side token refresh to avoid manual updates every 60 days.

## Production Considerations

1. **Move to Server-Side**: For better security, move API calls to your server
2. **Cache Posts**: Store posts in a database to reduce API calls
3. **Error Handling**: Implement robust error handling and fallbacks
4. **Token Management**: Set up automatic token refresh

## Support
If you need help with setup, the fallback posts will continue to show until the API is configured. The website remains fully functional either way.

## Current Status
- ✅ Instagram feed section added
- ✅ Fallback posts working
- ✅ Loading states implemented
- ✅ Error handling in place
- ⏳ Waiting for Instagram API configuration
