# 🚀 Quick Reference: Railway Backend Integration

## 📍 API Endpoint
```
https://web-production-b9056.up.railway.app/api/query
```

## 🔧 Quick Code Update

### Replace This:
```tsx
fetch("http://127.0.0.1:8000/api/query", {
```

### With This:
```tsx
fetch("https://web-production-b9056.up.railway.app/api/query", {
```

## 🧪 Quick Test
```powershell
curl -Method POST -Uri https://web-production-b9056.up.railway.app/api/query -Headers @{'Content-Type'='application/json'} -Body '{"query":"plumber near lahore"}'
```

## ✅ What to Expect
- ✅ Real provider data (Pakistani businesses)
- ✅ Usage analytics in console
- ✅ Proper JSON responses
- ✅ 3-20 providers per query
- ✅ No CORS issues

## 🐛 Troubleshooting
1. Check browser console (F12)
2. Test API with curl first
3. Verify request payload format
4. Look for CORS errors

**Status:** 🟢 Live and Ready!
