# CV Evaluation API - Flow Documentation

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────────────┐
│                     src/index.js                            │
│                   (Express Server)                          │
├─────────────────────────────────────────────────────────────┤
│                   src/routes/evaluate.js                    │
│                    (API Endpoints)                          │
├───────────────┬─────────────────────┬───────────────────────┤
│  middleware/  │     services/       │      services/        │
│  validation.js│   pdfParser.js      │   aiEvaluator.js      │
│  logger.js    │   sessionStore.js   │                       │
└───────────────┴─────────────────────┴───────────────────────┘
```

---

## 2. Cách AI API hoạt động (QUAN TRỌNG)

### AI API KHÔNG có session management

Groq API (và các AI API khác như OpenAI, Gemini) là **stateless** - không nhớ gì giữa các request.

### Cách project này xử lý:

```
┌─────────────────────────────────────────────────────────────┐
│                  MỖI LẦN GỌI AI API                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Lần 1: User hỏi "Đánh giá CV của tôi"                      │
│  messages = [                                               │
│    { role: "system", content: "Prompt + CV" },              │
│    { role: "user", content: "Đánh giá CV của tôi" }         │
│  ]                                                          │
│                                                             │
│  Lần 2: User hỏi "Cải thiện kỹ năng"                        │
│  messages = [                                               │
│    { role: "system", content: "Prompt + CV" },              │
│    { role: "user", content: "Đánh giá CV của tôi" },  ← COPY│
│    { role: "assistant", content: "CV 75 điểm..." },   ← COPY│
│    { role: "user", content: "Cải thiện kỹ năng" }     ← MỚI │
│  ]                                                          │
│                                                             │
│  Lần 3, 4, 5...: Tiếp tục copy toàn bộ history              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tóm tắt:

| Thành phần | Vai trò | Lưu ở đâu |
|------------|---------|-----------|
| Groq API | Chỉ xử lý 1 request, không nhớ gì | Không lưu |
| sessionStore.js | Lưu chat history | Server RAM |
| Mỗi lần chat | Phải gửi toàn bộ history cho AI | Gửi lại mỗi lần |

### Vì sao giới hạn 10 lượt chat?

| Lượt | Số messages gửi | Tokens ước tính |
|------|-----------------|-----------------|
| 1 | 2 | ~2000 |
| 5 | 10 | ~6000 |
| 10 | 20 | ~10000+ |

→ Càng chat nhiều → càng tốn tokens → càng chậm

---

## 3. Entry Point: src/index.js

**Vai trò:** Khởi tạo Express server

```
┌─────────────────────────────────────────┐
│              index.js                   │
├─────────────────────────────────────────┤
│ 1. Load biến môi trường (.env)          │
│ 2. Cấu hình CORS                        │
│ 3. Cấu hình middleware                  │
│ 4. Đăng ký routes (/ai/evaluate)        │
│ 5. Error handling                       │
│ 6. Cleanup session định kỳ              │
└─────────────────────────────────────────┘
```

**Luồng request:**
```
Request → Logger → CORS → JSON Parser → Routes → Response
```

---

## 4. API Endpoints: src/routes/evaluate.js

| Endpoint | Chức năng |
|----------|-----------|
| POST /upload | Upload CV (PDF) |
| POST /chat | Chat với AI |
| POST /job | So sánh với Job Description |
| GET /:sessionId | Lấy session + history |
| GET / | List sessions của user |
| DELETE /:sessionId | Xóa session |
| POST /:sessionId/clear | Reset chat |

### Flow Upload:
```
Client (PDF) → Multer → pdfParser → sessionStore → Response (sessionId)
```

### Flow Chat:
```
Client (message) → Validation → sessionStore (check limit) → aiEvaluator → Response
                                                                  ↓
                                              Build messages array (copy history)
                                                                  ↓
                                                            Groq API
```

---

## 5. Services

### 5.1 pdfParser.js
- Đọc PDF, trích xuất text
- Nhận diện sections: Contact, Summary, Experience, Education, Skills

### 5.2 sessionStore.js
- Lưu sessions trong RAM (Map)
- Mỗi session: cvText, chatHistory, promptCount
- Giới hạn: 10 lượt chat, hết hạn 1 giờ

### 5.3 aiEvaluator.js
- Gọi Groq API (Llama 3.3 70B)
- Build messages array = system prompt + CV + history + user message
- Retry khi rate limit

---

## 6. Flow chi tiết: Chat với AI

```
┌──────────────────────────────────────────────────────────────┐
│  1. User gửi message                                         │
│           │                                                  │
│           ▼                                                  │
│  2. sessionStore.getChatHistory() - Lấy history từ RAM       │
│           │                                                  │
│           ▼                                                  │
│  3. buildMessages() - Tạo array:                             │
│     [system + CV + history + new message]                    │
│           │                                                  │
│           ▼                                                  │
│  4. Gửi TOÀN BỘ array cho Groq API                           │
│           │                                                  │
│           ▼                                                  │
│  5. Nhận response từ AI                                      │
│           │                                                  │
│           ▼                                                  │
│  6. sessionStore.addMessage() - Lưu user msg + AI response   │
│           │                                                  │
│           ▼                                                  │
│  7. Trả response cho client                                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. Middleware

### validation.js
- Kiểm tra input bằng Zod
- Trả 400 nếu invalid

### logger.js
- Log request/response với thời gian xử lý

---

## 8. Giới hạn hệ thống

| Giới hạn | Giá trị |
|----------|---------|
| Lượt chat / session | 10 |
| Session timeout | 1 giờ |
| File size | 10MB |
| Storage | RAM (mất khi restart) |
