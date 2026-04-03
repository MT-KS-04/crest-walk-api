# Crest Walk API - Hệ Thống Bán Giày 👟

Chào mừng đến với **Crest Walk API**, dự án Backend xây dựng hệ thống API cho nền tảng thương mại điện tử chuyên cung cấp và bán lẻ giày thời trang. Dự án này cung cấp các dịch vụ cốt lõi cần thiết để vận hành và quản lý một cửa hàng bán giày trực tuyến.

---

## 🚀 Tính năng nổi bật (Dự kiến)

- **Quản lý Sản phẩm (Giày):** CRUD (Tạo, Đọc, Cập nhật, Xóa) thông tin giày, phân loại theo thương hiệu, kích thước, màu sắc và danh mục.
- **Quản lý Người dùng:** Đăng ký, Đăng nhập, Quản lý hồ sơ cá nhân và phân quyền (Admin / Khách hàng).
- **Quản lý Đơn hàng:** Đặt hàng, theo dõi trạng thái đơn hàng, lịch sử mua hàng.
- **Quản lý Giỏ hàng:** Thêm, sửa, xóa sản phẩm trong giỏ hàng.
- **Bảo mật cao:** Tích hợp bảo vệ chống các cuộc tấn công phổ biến, Rate Limiting, Helmet...
- **Xử lý Tối ưu:** Compression để nén dữ liệu phản hồi, Winston để ghi log hệ thống rõ ràng.

---

## 🛠 Công nghệ Cốt lõi

Hệ thống được thiết kế theo cấu trúc module linh hoạt, sử dụng các công nghệ hiện đại hàng đầu:

- **Môi trường & Ngôn ngữ:** [Node.js](https://nodejs.org/) (Sử dụng ES Modules)
- **Framework Web:** [Express (v5.x)](https://expressjs.com/)
- **Cơ sở Dữ liệu:** [MongoDB](https://www.mongodb.com/) thông qua [Mongoose](https://mongoosejs.com/)
- **Bảo mật & Tối ưu:**
  - `helmet`: Tăng cường bảo mật HTTP Headers.
  - `cors`: Quản lý Cross-Origin Resource Sharing.
  - `express-rate-limit`: Chống Spam/DDoS API.
  - `compression`: Nén phản hồi giúp API trả về nhanh hơn.
- **Logging & System:** `winston` (ghi log thông minh).

---

## 📂 Cấu trúc Thư mục

```text
crest-walk-api-JS/
├── src/
│   ├── config/             # Tệp tin cấu hình (Môi trường, biến global)
│   ├── middleware/         # Các Middleware tùy chỉnh (Mongoose, Rate Limit, Winston,...)
│   ├── router/             # Định nghĩa các Route (API endpoints) của dự án
│   │   └── index.router.js # Router chính (Entry point cho các v1 APIs)
│   └── server.js           # Khởi tạo Server, kết nối DB và áp dụng các cấu hình
├── .env                    # Lưu trữ các biến môi trường nhạy cảm
├── package.json            # Thông tin dự án và các dependencies
└── README.md               # File tài liệu bạn đang đọc này
```

---

## ⚙️ Yêu cầu Hệ thống

- **Node.js**: Phiên bản `>= 18.x.x`
- **MongoDB**: Đang chạy qua Local hoặc tích hợp [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

---

## 💻 Cài đặt và Chạy Thử (Local Development)

### Bước 1: Clone dự án hoặc tải mã nguồn

```bash
git clone <URL_REPO_CỦA_BẠN>
cd crest-walk-api-JS
```

### Bước 2: Cài đặt Dependencies

```bash
npm install
```

### Bước 3: Cấu hình Môi trường

Tạo file `.env` (nếu chưa có) từ file mẫu hoặc điền các thông tin:

```env
PORT=3000
NODE_ENV=development
MONGOOSE_URL=mongodb://localhost:27017/crest-walk-api
LOG_LEVELS=info
```

### Bước 4: Chạy Máy chủ ở Chế độ Development

```bash
npm run dev
```

> Server sẽ khởi động và tự động reload mỗi khi bạn thay đổi code. Bạn có thể truy cập API cơ bản tại: `http://localhost:3000/api/v1/`

---

## 📖 API Documentation Chú Thích

Hiện tại Entry Point (`/api/v1/`) cung cấp phản hồi kiểm tra sức khỏe hệ thống (Health Check):

```json
{
  "message": "API is live",
  "status": "ok",
  "serviceName": "crest-walk-api",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 12.345,
  "server": "Express + Node.js",
  "docs": "https://docs.crest-walk-api.mk-ts-04.com",
  "timestamp": "2026-03-21T16:12:00.000Z"
}
```

_(Chi tiết các endpoint như `/users`, `/shoes`, `/orders` sẽ được cập nhật trong những đợt release tiếp theo!)_

---

## 📜 Giấy phép & Tác giả

- **Tác giả:** MK-TS-04
- **License:** Apache-2.0

> Cảm ơn bạn đã quan tâm đến dự án **Crest Walk API**! 👟🚀
