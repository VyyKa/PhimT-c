# PhimTộc - Ứng dụng xem phim trực tuyến

Một ứng dụng web hoàn chỉnh giống PhimTộc được xây dựng với React, TypeScript và TailwindCSS.

## 🚀 Tính năng chính

### 🏠 Trang chủ (Home Page)
- Hiển thị phim theo danh mục: PhimTộc Originals, Trending Now, Action & Adventure, Comedies
- Giao diện dạng lưới với poster phim chất lượng cao
- Hero section với phim nổi bật
- Hover effects với thông tin chi tiết và nút hành động

### 🎬 Trang chi tiết phim (Movie Detail Page)
- Thông tin đầy đủ: tiêu đề, mô tả, thể loại, thời lượng, đánh giá IMDB
- Trình phát video nhúng từ YouTube
- Nút thêm vào danh sách yêu thích
- Thông tin diễn viên và đạo diễn

### 🔐 Xác thực người dùng (Authentication)
- Trang đăng nhập với validation form
- Trang đăng ký với xác nhận mật khẩu
- Quản lý session với localStorage
- Protected routes cho các trang yêu cầu đăng nhập

### 👤 Trang người dùng (User Profile)
- Hiển thị thông tin cá nhân
- Chỉnh sửa thông tin profile
- Thống kê phim yêu thích và lịch sử xem
- Phân quyền admin/user

### 🔍 Trang tìm kiếm (Search Page)
- Tìm kiếm theo tên phim và thể loại
- Hiển thị kết quả dạng grid
- Real-time search với debouncing

### 📚 Trang duyệt phim (Browse Page)
- Lọc phim theo danh mục
- Sắp xếp theo tên, năm, đánh giá
- Pagination hoặc infinite scroll

### ❤️ Trang yêu thích (Favorites Page)
- Danh sách phim đã thêm vào yêu thích
- Quản lý localStorage để lưu trữ

### 🛠️ Trang quản trị (Admin Dashboard)
- Tổng quan thống kê hệ thống
- Quản lý phim: thêm, sửa, xóa
- Quản lý người dùng
- Chỉ admin mới có quyền truy cập

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form + Yup validation
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 📦 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd netflix-clone

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

## 🎯 Cách sử dụng

### Đăng nhập Demo
- **Admin**: admin@phimtoc.com / 123456
- **User**: user@test.com / 123456

### Tính năng chính
1. **Xem phim**: Click vào poster để xem chi tiết và phát video
2. **Tìm kiếm**: Sử dụng thanh tìm kiếm ở header
3. **Yêu thích**: Click nút tim để thêm/xóa khỏi danh sách yêu thích
4. **Duyệt phim**: Lọc và sắp xếp phim theo ý muốn
5. **Quản trị**: Truy cập trang admin để quản lý nội dung (chỉ admin)

## 🎨 Thiết kế UI/UX

### Màu sắc chủ đạo
- **Đen**: #000000 (Background chính)  
- **Đỏ PhimTộc**: #E50914 (Accent color)
- **Xám**: #1f2937, #374151 (Secondary backgrounds)

### Typography
- Font chữ: Inter (system font fallback)
- Heading: 24px - 72px, font-weight: 700
- Body: 14px - 18px, font-weight: 400
- Line height: 1.5 (body), 1.2 (headings)

### Responsive Design
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Shared components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── MovieCard.tsx   # Movie card component
│   ├── MovieRow.tsx    # Horizontal movie row
│   ├── Layout.tsx      # Main layout wrapper
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── data/              # Mock data
│   └── movies.ts      # Movie data and utilities
├── pages/             # Page components
│   ├── HomePage.tsx
│   ├── MovieDetailPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── SearchPage.tsx
│   ├── BrowsePage.tsx
│   ├── FavoritesPage.tsx
│   ├── ProfilePage.tsx
│   └── AdminPage.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## 🔧 Tính năng nâng cao

### Authentication System
- JWT-like token simulation với localStorage
- Protected routes với role-based access
- Auto-redirect sau khi đăng nhập/đăng xuất

### State Management
- Context API cho global state
- Local state cho component-specific data
- Persistent storage cho favorites và user session

### Performance Optimizations
- Lazy loading cho images
- Debounced search
- Memoized components
- Optimized re-renders

### User Experience
- Loading states cho tất cả async operations
- Error boundaries và error handling
- Toast notifications cho user feedback
- Smooth animations và transitions

## 🚀 Deployment

### Build Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect repository to deployment platform
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to main branch

## 🔮 Tính năng tương lai

- [ ] Real-time notifications
- [ ] Video streaming với HLS/DASH
- [ ] Social features (comments, ratings)
- [ ] Recommendation engine
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Progressive Web App (PWA)
- [ ] Real database integration (Supabase/Firebase)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- Email: your.email@example.com
- Project Link: [https://github.com/yourusername/phimtoc-clone](https://github.com/yourusername/phimtoc-clone)

---

⭐ Nếu project này hữu ích, hãy cho một star nhé!