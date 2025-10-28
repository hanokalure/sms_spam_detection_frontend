# ⚡ Quick Setup - Connect Vercel to Hugging Face

## 🎯 What You Need to Do (3 Steps)

### 1️⃣ Go to Vercel
👉 https://vercel.com/dashboard

### 2️⃣ Add Environment Variable
```
Project → Settings → Environment Variables → Add New

Name:  REACT_APP_API_URL
Value: https://hanokalure-sms-spam-detector.hf.space

✅ Check: Production, Preview, Development
```

### 3️⃣ Redeploy
Vercel will auto-deploy after saving. Wait 2-3 minutes.

---

## ✅ Your Backend Status

Test URL: https://hanokalure-sms-spam-detector.hf.space

Current Status: **🟢 ONLINE**
- ✅ 4 models loaded (XGBoost, SVM, DistilBERT, RoBERTa)
- ✅ CORS enabled
- ✅ All endpoints working

---

## 🧪 Test Locally First

```bash
cd C:\sms_spam_detection\frontend
npm start
```

Should connect to HF automatically (`.env` file configured).

---

## 🔍 Verify Backend Anytime

```bash
node test_hf_connection.js
```

---

## ❓ What Was Wrong Before?

**Before:**
```
Frontend → localhost:8000 ❌ (doesn't exist on Vercel)
```

**Now:**
```
Frontend → https://hanokalure-sms-spam-detector.hf.space ✅
```

---

That's it! Super simple. 🚀
