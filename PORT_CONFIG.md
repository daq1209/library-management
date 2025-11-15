# 📌 Port Configuration

## Fixed Ports - DO NOT CHANGE

### Backend API Server
- **Port:** `4001`
- **URL:** `http://localhost:4001`
- **Health Check:** `http://localhost:4001/health`
- **API Base:** `http://localhost:4001/api/v1`

### Frontend React App
- **Port:** `5173`
- **URL:** `http://localhost:5173`
- **Strict Mode:** Enabled (will fail if port is occupied)

---

## Configuration Files

### Backend Port
File: `backend/.env`
```env
PORT=4001
CORS_ORIGIN=http://localhost:5173
```

### Frontend Port
File: `frontend/vite.config.js`
```javascript
server: {
  port: 5173,
  strictPort: true, // Will error if port is busy
  host: true
}
```

File: `frontend/.env`
```env
VITE_API_URL=http://localhost:4001/api
```

---

## If Port is Already in Use

### Find and Kill Process

**Windows:**
```powershell
# Find PID
netstat -ano | findstr :4001
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find and kill
lsof -ti:4001 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## ⚠️ Important Notes

1. **Always use these ports** - Don't change unless absolutely necessary
2. **If port occupied** - Kill the old process, don't change port numbers
3. **Both must match** - Frontend .env must point to correct backend port
4. **Restart required** - Changes to port config need server restart

---

## Quick Start Commands

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should see: Server running on: http://localhost:4001

# Terminal 2 - Frontend  
cd frontend
npm run dev
# Should see: Local: http://localhost:5173/
```

---

**Last Updated:** 2025-11-12
