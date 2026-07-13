# 🚀 Quick Start Guide

## Option 1: Batch File (Easiest - Windows)
**Double-click this file:**
```
START-PROJECT.bat
```
✅ Automatically starts both servers in separate windows
✅ Clears old processes
✅ No typing required

## Option 2: PowerShell Script
**Run this in PowerShell:**
```powershell
.\START-PROJECT.ps1
```
✅ More modern approach
✅ Better control and feedback

## Option 3: Manual (If scripts don't work)

**Terminal 1:**
```bash
cd server
npm start
```

**Terminal 2:**
```bash
cd client
npm start
```

---

## ✓ When Everything is Running

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Database**: MongoDB (auto-connected)

---

## 🛑 Stop the Project

- **Batch/PowerShell**: Close the windows (Ctrl+C)
- **Manual**: Press Ctrl+C in each terminal

---

## 🔧 Troubleshooting

**Ports already in use?**
- The scripts automatically kill old processes
- Or manually: `taskkill /F /IM node.exe`

**MongoDB not connecting?**
- Check .env file has correct connection string
- Ensure MongoDB service is running

**Dependencies missing?**
```bash
cd server && npm install
cd ../client && npm install
```

---

**That's it! Just run START-PROJECT.bat** 🎉
