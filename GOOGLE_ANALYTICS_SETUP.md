# Google Analytics 4 Setup Guide

Google Analytics 4 has been integrated into your CARES Leadership Diagnostic application. Follow these steps to complete the setup:

## Step 1: Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Admin" in the bottom left corner
4. Under "Property", click "Create Property"
5. Enter your property details:
   - Property name: "CARES Leadership Diagnostic" (or your preferred name)
   - Reporting time zone: Select your timezone
   - Currency: Select your currency
6. Click "Next" and complete the business details
7. Click "Create" to finish

## Step 2: Set Up a Data Stream

1. After creating your property, you'll be prompted to set up a data stream
2. Select "Web" as the platform
3. Enter your website URL (e.g., `https://yourdomain.com`)
4. Enter a stream name: "CARES Diagnostic Website"
5. Click "Create stream"

## Step 3: Get Your Measurement ID

1. After creating the stream, you'll see your **Measurement ID** (starts with `G-`)
2. Copy this Measurement ID (e.g., `G-XXXXXXXXXX`)

## Step 4: Add Your Measurement ID to the App

1. Open the file `index.html` in your project
2. Find the two instances of `G-XXXXXXXXXX`
3. Replace both instances with your actual Measurement ID

```html
<!-- Change this: -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>

<!-- To this (using your actual ID): -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC1234567"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-ABC1234567');
</script>
```

4. Also update `src/services/analytics.js` at line 9 to use your Measurement ID:

```javascript
// Change this:
window.gtag('config', 'G-XXXXXXXXXX', {

// To this (using your actual ID):
window.gtag('config', 'G-ABC1234567', {
```

## Step 5: Deploy and Test

1. Rebuild your application: `npm run build`
2. Deploy the updated application
3. Visit your website and perform some actions
4. Go back to Google Analytics
5. Click on "Reports" > "Realtime" to see live user activity

## What's Being Tracked

Your application now tracks the following events:

### User Engagement
- **diagnostic_started**: When a user begins the diagnostic
- **diagnostic_completed**: When a user completes the SCARE assessment (includes score and focus area)
- **modal_opened**: When toolkit or workshop modals are opened
- **modal_closed**: When modals are closed

### Conversion Events
- **action_clicked**: When users click toolkit download, workshop waitlist, or coaching buttons
- **lead_captured**: When users submit their information (includes action type)

### Key Metrics You Can Track
- Total diagnostic starts and completions
- Conversion rate for each action (toolkit, workshop, coaching)
- SCARE score distribution
- Most common focus areas
- User journey through the diagnostic
- Drop-off points

## Viewing Your Data in Google Analytics

### Realtime Report
- Go to "Reports" > "Realtime" to see current users and their actions

### Events Report
- Go to "Reports" > "Engagement" > "Events"
- View all custom events and their counts
- Click on any event to see detailed parameters

### Conversions
- Go to "Admin" > "Events"
- Mark important events as "Conversions" (e.g., `lead_captured`, `diagnostic_completed`)
- These will appear in the "Conversions" report

### Custom Reports
You can create custom reports to analyze:
- Conversion funnels (diagnostic start → completion → action taken)
- SCARE score distributions
- Focus area popularity
- Time spent on each diagnostic stage

## Supabase Database

Your application also stores all lead and event data in Supabase:
- `leads` table: Stores all captured leads
- `diagnostic_events` table: Stores all user actions with metadata

You can query this data directly in the Supabase dashboard for detailed analytics.

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Measurement ID is correct
3. Make sure you've deployed the updated code
4. Check Google Analytics Realtime report to confirm data is flowing
