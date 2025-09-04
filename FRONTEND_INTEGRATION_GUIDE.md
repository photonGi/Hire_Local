# Frontend Integration Guide: Railway Backend

## Overview
This guide explains how to connect your React frontend to the deployed Railway backend API at `https://web-production-b9056.up.railway.app/`

## Backend API Details

### Base URL
```
https://web-production-b9056.up.railway.app/
```

### Available Endpoint
- **POST** `/api/query` - Main chat endpoint for service provider queries

## Frontend Integration Steps

### 1. Update API URL in Components

Replace any localhost URLs with the Railway deployment URL:

**Before:**
```tsx
const resp = await fetch("http://127.0.0.1:8000/api/query", {
```

**After:**
```tsx
const resp = await fetch("https://web-production-b9056.up.railway.app/api/query", {
```

### 2. Example API Call

```tsx
const handleSendMessage = async (query: string) => {
  try {
    const payload = { query };
    console.debug("[chat] Sending payload to server:", payload);
    
    const resp = await fetch("https://web-production-b9056.up.railway.app/api/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(txt || resp.statusText);
    }

    const data = await resp.json();
    console.debug("[chat] Received response from server:", data);
    
    // Handle the response data
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
```

## API Request/Response Format

### Request Format
```json
{
  "query": "plumber near lahore"
}
```

### Response Format
```json
{
  "valid": true,
  "message": "I found 5 plumbers in Lahore for you:",
  "state": "complete",
  "providers": [
    {
      "name": "Quick Fix Plumbing",
      "phone": "+92-321-1234567",
      "details": "Professional plumbing services. Please verify contact details independently.",
      "address": "123 Main St, Lahore, Pakistan",
      "location_note": "EXACT",
      "confidence": "HIGH"
    }
  ],
  "suggestions": ["electrician", "carpenter", "painter"],
  "ai_data": {
    "intent": "service_request",
    "service": "plumber",
    "location": "Lahore",
    "confidence": 0.9
  },
  "usage_report": {
    "model": "gpt-4o-2024-08-06",
    "tokens": {
      "input": 156,
      "output": 234,
      "total": 390
    },
    "cost": {
      "input_cost": 0.00078,
      "output_cost": 0.00351,
      "total_cost": 0.00429
    },
    "pricing": {
      "input_per_1k": 0.005,
      "output_per_1k": 0.015,
      "currency": "USD"
    },
    "timestamp": "2025-09-01T18:45:23.123456",
    "query": "plumber near lahore",
    "provider_count": 5
  }
}
```

## Testing the Integration

### 1. Test API Directly (PowerShell)
```powershell
curl -Method POST -Uri https://web-production-b9056.up.railway.app/api/query -Headers @{'Content-Type'='application/json'} -Body '{"query":"plumber near lahore"}'
```

### 2. Test API Directly (bash/curl)
```bash
curl -X POST https://web-production-b9056.up.railway.app/api/query \
  -H "Content-Type: application/json" \
  -d '{"query":"plumber near lahore"}'
```

### 3. Frontend Testing Checklist

1. **Start your development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open browser console (F12 → Console)**

3. **Send a test message** like "plumber near lahore"

4. **Verify console logs:**
   - ✅ `[chat] Sending payload to server: {query: 'plumber near lahore'}`
   - ✅ `[chat] Received response from server: {response object}`
   - ✅ No CORS errors
   - ✅ Provider data displayed in UI

## Common Issues & Solutions

### CORS Errors
If you see:
```
Access to fetch at 'https://web-production-b9056.up.railway.app/api/query' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:** The backend already includes CORS middleware for localhost origins. If you're running on a different port, let the backend team know.

### Network Errors
- Check if Railway service is running
- Verify the URL is correct
- Check browser network tab for detailed error information

### Response Parsing Errors
- Ensure you're parsing JSON response correctly
- Check if the response format matches the expected structure
- Use console.log to debug response data

## Environment Configuration

### Development vs Production

Create environment variables for different stages:

```tsx
// config.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://web-production-b9056.up.railway.app'
  : 'https://web-production-b9056.up.railway.app'; // Same for now

export const API_ENDPOINTS = {
  query: `${API_BASE_URL}/api/query`
};
```

Then use it in your components:
```tsx
import { API_ENDPOINTS } from '../config';

const resp = await fetch(API_ENDPOINTS.query, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

## Query Examples

The API supports various types of queries:

1. **Service + Location:**
   - "plumber near lahore"
   - "electrician in karachi"
   - "restaurant in islamabad"

2. **General Service:**
   - "need a plumber"
   - "looking for electrician"
   - "find restaurants"

3. **Load More:**
   - "show more"
   - "generate 5 more"
   - "load more providers"

4. **General Questions:**
   - "what services do you offer?"
   - "how does this work?"

## Expected Behavior

- **Service Requests:** Returns 3-5 providers by default
- **Load More:** Returns 5-10 additional providers
- **General Questions:** Returns helpful messages with suggestions
- **Invalid Queries:** Returns error messages with suggestions

## Debugging Tips

1. **Always check browser console** for request/response logs
2. **Use Network tab** to see actual HTTP requests
3. **Verify JSON structure** matches expected format
4. **Test API directly** with curl/Postman first
5. **Check Railway logs** if API isn't responding

## Support

If you encounter issues:
1. Check the console logs first
2. Test the API directly with curl
3. Verify the request payload format
4. Contact the backend team with specific error messages

---

**Last Updated:** September 1, 2025  
**Backend URL:** https://web-production-b9056.up.railway.app/  
**Status:** ✅ Active and Ready for Integration
