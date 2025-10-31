```markdown
# PhimT-c

Web xem phim thế hệ mới!  
Một dự án viết bằng TypeScript (chiếm ~99% codebase) nhằm cung cấp trải nghiệm xem phim hiện đại, nhanh và thân thiện.

## Mục lục
- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ](#công-nghệ)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt & chạy dự án](#cài-đặt--chạy-dự-án)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Chạy ở môi trường phát triển](#chạy-ở-môi-trường-phát-triển)
- [Xây dựng & Triển khai](#xây-dựng--triển-khai)
- [Kiểm thử](#kiểm-thử)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)
- [Liên hệ](#liên-hệ)

## Giới thiệu
PhimT-c là một nền tảng web để duyệt, tìm kiếm và xem phim. Mục tiêu là cung cấp UI/UX mượt mà, tìm kiếm nhanh, hỗ trợ nhiều thiết bị và tích hợp các tính năng cần thiết cho người xem phim (như danh sách yêu thích, đánh dấu đang xem, phụ đề, v.v.).

## Tính năng chính (gợi ý)
- Danh mục phim theo thể loại, năm, quốc gia
- Trang chi tiết phim có trailer, tập phim, mô tả, đạo diễn, diễn viên
- Tìm kiếm nhanh và lọc nâng cao
- Hệ thống tài khoản người dùng (đăng ký, đăng nhập)
- Danh sách theo dõi / yêu thích
- Hỗ trợ chơi video với phụ đề
- Quản trị nội dung (thêm/sửa/xóa phim, tập)

## Công nghệ
- Ngôn ngữ chính: TypeScript
- Framework/Library (gợi ý): Next.js / Express / NestJS / React (tùy repo)
- Cơ sở dữ liệu: (Postgres / MongoDB / MySQL — tùy cấu hình)
- Công cụ quản lý gói: npm / pnpm / yarn
- Build: tsc / bundler (Vite/Next/Webpack)

(Cập nhật phần "Công nghệ" chính xác theo stack thực tế trong repo.)

## Yêu cầu hệ thống
- Node.js >= 16 (khuyến nghị 18+)
- npm >= 8 / pnpm / yarn
- CSDL và các dịch vụ khác (nếu dùng): xem file cấu hình / .env

## Cài đặt & chạy dự án (cơ bản)
1. Clone repo
   git clone https://github.com/VyyKa/PhimT-c.git
2. Vào thư mục dự án
   cd PhimT-c
3. Cài phụ thuộc
   - Với npm:
     npm install
   - Hoặc với pnpm:
     pnpm install
   - Hoặc với yarn:
     yarn install

## Cấu hình môi trường
Tạo file .env dựa trên `.env.example` (nếu có). Một số biến môi trường thường thấy:
- NODE_ENV=development
- PORT=3000
- DATABASE_URL=postgres://user:pass@host:port/dbname
- JWT_SECRET=your_jwt_secret
- NEXT_PUBLIC_API_URL=http://localhost:3000/api

(Hãy cập nhật danh sách biến theo thực tế của dự án.)

## Chạy ở môi trường phát triển
- Với npm:
  npm run dev
- Với pnpm:
  pnpm dev
- Với yarn:
  yarn dev

Truy cập http://localhost:3000 (hoặc cổng đã cấu hình).

## Xây dựng & Triển khai
- Build:
  npm run build
- Chạy production:
  npm start

Tùy framework, câu lệnh có thể khác (ví dụ Next.js: next build && next start). Cập nhật theo script trong package.json.

## Kiểm thử
Nếu repo chứa test:
- Chạy test:
  npm test

Nếu chưa có test, khuyến nghị thêm unit/integration tests bằng Jest / Vitest / Testing Library.

## Đóng góp
Rất hoan nghênh mọi đóng góp! Một hướng dẫn đóng góp ngắn:
1. Fork repository
2. Tạo nhánh feature: git checkout -b feat/ten-tinh-nang
3. Commit thay đổi rõ ràng: git commit -m "feat: mô tả ngắn"
4. Push và mở Pull Request

Vui lòng tuân thủ coding style, viết test cho tính năng mới và cập nhật README nếu thêm biến môi trường hoặc thay đổi lớn.

## Giấy phép
Miễn phí sử dụng — MIT License. (Nếu muốn dùng giấy phép khác, cập nhật file LICENSE.)

## Liên hệ
- Tác giả / maintainer: @VyyKa
- Mô tả repo: Web xem phim thế hệ mới!

Gợi ý tiếp theo: thêm file .env.example, cấu hình CI (GitHub Actions) để build và test tự động, và một CONTRIBUTING.md chi tiết nếu dự án có nhiều cộng tác viên.
```
