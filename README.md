# CV Evaluation API

API đánh giá CV bằng AI, hỗ trợ tiếng Việt.

## Tech Stack

- Node.js + Express
- Groq API (Llama 3.3 70B)
- pdf-parse
- Zod

## Cài đặt

```bash
npm install
cp .env.example .env
# Thêm GROQ_API_KEY vào file .env
npm start
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/ai/evaluate/upload` | Upload CV (PDF) |
| POST | `/ai/evaluate/chat` | Chat với AI |
| POST | `/ai/evaluate/job` | So sánh với Job Description |
| GET | `/ai/evaluate/:sessionId` | Lấy session |
| DELETE | `/ai/evaluate/:sessionId` | Xóa session |

## Giới hạn

- 10 lượt chat / session
- File tối đa 10MB
- Session timeout: 1 giờ
