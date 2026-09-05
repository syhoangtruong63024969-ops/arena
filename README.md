# Voicekey — API giọng nói cho nhà sáng tạo

Giao diện cửa hàng tiếng Việt cho gói **ElevenLabs API · 10.000 credits · 1 tháng**, được xây dựng bằng React, TypeScript và Vite. Phong cách sáng, điểm nhấn terracotta, minh họa sóng âm 3D và chuyển động nhẹ nhàng.

> **Trạng thái mặc định: bản xem trước.** Giá **49.000đ/tháng là giá minh họa**, không phải giá đã được người bán xác nhận. Website chưa thu tiền, chưa gửi email, chưa cấp API key và không đại diện cho ElevenLabs. Voice Studio dùng giọng đọc của trình duyệt, không gọi API ElevenLabs.

## Đã có những gì?

- Landing page, bảng giá một gói, sidebar theo vị trí cuộn, menu điện thoại và thông báo tương tác.
- Animation bằng Framer Motion; tôn trọng `prefers-reduced-motion`.
- **Kéo-thả file `.txt` UTF-8** vào trình soạn thảo; kiểm tra đuôi file, dung lượng, mã hóa và nội dung. Giới hạn bản thử: **100 KB/file, 500 ký tự Unicode code point, một file/lần**. File không hợp lệ không ghi đè văn bản đang soạn.
- **Kéo để sắp xếp phong cách đọc**, hoặc dùng phím mũi tên trái/phải trên tay nắm kéo. Các phong cách chỉ thay đổi tốc độ và cao độ của giọng trên thiết bị.
- Chọn tiếng Việt/English, tốc độ đọc, nghe/dừng bằng Web Speech API; thông báo rõ khi thiết bị không có giọng tương ứng. Có thể tải **văn bản `.txt`**, không giả lập xuất file âm thanh.
- Luồng chọn gói → thông tin tham khảo → xác nhận → lưu/tải **đơn nháp**. Không tạo giao dịch hay hóa đơn giả.
- Lịch sử tối đa 30 bản nháp trong `localStorage`, có xuất/xóa. Chỉ lưu thông tin gói; **không lưu tên, email hoặc API key**. Tên/email chỉ được đưa vào tệp khi khách chủ động tải ngay sau bước tạo.
- Ví dụ tích hợp backend Node.js, Python và cURL, có nút sao chép, bảo vệ khóa bằng biến môi trường và xử lý HTTP lỗi.
- FAQ, quyền riêng tư, điều khoản và khu vực hỗ trợ có nội dung thực tế phù hợp với bản demo.
- Dialog native với focus trap/Escape; nhãn cho form, điều khiển bằng bàn phím, contrast được kiểm tra bằng axe.
- Font tiếng Việt tự host, hình WebP tối ưu, không phụ thuộc CDN font hay ảnh bên ngoài.

## Chạy trên máy

Yêu cầu **Node.js 22.12 trở lên** (khuyến nghị nhánh Node 22, có `.nvmrc`).

```bash
npm ci
npm run dev
```

Mở địa chỉ Vite in ra. Dev server bind `0.0.0.0:5173` và cho phép preview host `*.e2b.app`. Mã chạy trong trình duyệt không gọi backend qua `localhost`.

```bash
npm run build     # TypeScript + production build → dist/
npm run preview   # Xem bản build
```

## Thay đổi giá, thanh toán và liên hệ

```bash
cp .env.example .env
```

| Biến                  | Mặc định | Ý nghĩa                                                                                                                       |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `VITE_PLAN_PRICE_VND` | `49000`  | Giá nguyên dương bằng VND. Giá lỗi sẽ trở về giá mẫu.                                                                         |
| `VITE_CHECKOUT_URL`   | trống    | URL **HTTPS** của trang thanh toán bên ngoài đã được cấu hình. Không nhận URL HTTP, JavaScript hay URL kèm username/password. |
| `VITE_SUPPORT_EMAIL`  | trống    | Email hỗ trợ công khai, hiển thị trong cửa sổ hỗ trợ.                                                                         |
| `BASE_PATH`           | `/`      | Đường dẫn public khi build; dùng `/arena/` nếu triển khai dưới GitHub Pages của repo này.                                     |

Cấu hình sản phẩm nằm tại `src/config/product.ts`. Đổi thương hiệu/logo tại `src/components/Brand.tsx`; nội dung chính được tách thành các component trong `src/components/`.

**Cần khởi động lại Vite hoặc build lại sau khi đổi `.env`.** `VITE_*` là cấu hình **công khai** được đưa vào bundle; không phải nơi lưu bí mật.

### Hai chế độ checkout

1. **Không có URL thanh toán hợp lệ:** luôn ghi rõ giá mẫu, chỉ tạo bản nháp cục bộ, không có request mua hàng gửi đi.
2. **Có `VITE_CHECKOUT_URL` hợp lệ:** hiển thị phần tổng kết và liên kết mở trang thanh toán bên ngoài. Website không chuyển tên/email vào URL, không thu thập thẻ, không nhận kết quả thanh toán và không tự cấp key. Đây chỉ là điều hướng sang nhà cung cấp; giá/sản phẩm thực tế phải được kiểm soát tại máy chủ của nhà cung cấp.

Đừng chỉ thêm một URL rồi coi hệ thống bán API đã hoàn chỉnh. Hãy hoàn thành checklist bên dưới trước khi nhận tiền.

## Trước khi mở bán thật

- [ ] Xác minh quyền phân phối, điều khoản của ElevenLabs và quyền sử dụng từng giọng nói. Không chia sẻ/bán lại khóa chủ trái với điều khoản nhà cung cấp.
- [ ] Xác nhận giá chính thức, model được hỗ trợ, quy tắc tiêu hao credits, thời điểm kích hoạt và hết hạn một tháng; công bố rõ cách xử lý credit còn dư.
- [ ] Xác nhận cơ chế **mua một lần, không tự gia hạn** trên trang thanh toán để khớp thông tin cửa hàng.
- [ ] Kết nối cổng thanh toán thực, xác minh chữ ký webhook ở backend, kiểm tra mã sản phẩm/số tiền/phương thức tiền tệ ở server và xử lý sự kiện idempotent.
- [ ] Có cơ sở dữ liệu đơn hàng, tài khoản/xác thực phù hợp, hệ thống cấp quyền hoặc key riêng theo người dùng và kiểm tra hạn mức/hạn sử dụng ở server.
- [ ] Mã hóa bí mật, không log API key; bổ sung rate limit, kiểm soát quyền truy cập và quản lý thu hồi key. Không đưa `ELEVENLABS_API_KEY` vào frontend hay biến `VITE_*`.
- [ ] Nếu thêm TTS thật, trình duyệt chỉ gọi endpoint tương đối như `/api/tts`; backend đã xác thực mới gọi ElevenLabs. Không tạo proxy API công khai không có xác thực/hạn mức.
- [ ] Thêm email giao dịch, liên hệ người bán, chính sách hoàn tiền, điều khoản và quyền riêng tư áp dụng cho hệ thống thực tế.
- [ ] Kiểm thử một giao dịch thật, giao dịch lỗi, webhook gửi lặp và hết hạn/hết credits trước khi công bố.

**Không có một phép quy đổi cố định từ 10.000 credits sang số ký tự hay phút audio được hứa hẹn trên website.**

## Kiểm thử

```bash
npm run lint
npm run test            # Vitest: helpers, nhập file, cấu hình, lưu trữ, checkout
npm run build
npm run check           # lint + unit/component tests + build

npx playwright install --with-deps chromium
npm run test:e2e        # Desktop + mobile: thao tác thật và axe WCAG AA
```

Playwright tự khởi động server nếu chưa có server ở cổng 5173. Có thể dùng `PLAYWRIGHT_BASE_URL` cho server thử nghiệm khác. Với môi trường đã có Chromium, đặt `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` đến binary đó.

Bộ kiểm thử bao gồm nhập file qua file picker và `DataTransfer`, drag bằng pointer và bàn phím, xuất file, lỗi giọng đọc, gọi/dừng Web Speech API với mock, checkbox xác nhận, đơn nháp sau reload, không lưu PII, xóa đơn, clipboard, menu điện thoại, focus trap và Escape. Kiểm thử speech dùng mock có kiểm soát; chất lượng/khả dụng của giọng thật vẫn phụ thuộc thiết bị và trình duyệt.

## Đưa lên GitHub và triển khai

Mã nguồn làm việc trên nhánh **`arena/01a07244-arena`** của repo này. Không có `node_modules`, `dist`, `.env`, ảnh kiểm thử hay báo cáo test trong Git.

### GitHub Actions CI

`.github/workflows/ci.yml` chạy lint, unit tests, build, kiểm tra dependency và E2E trên push/PR. Báo cáo E2E được lưu dưới dạng artifact khi kiểm thử thất bại.

### GitHub Pages (tùy chọn)

Đã có workflow thủ công `.github/workflows/pages.yml`. **Có workflow không có nghĩa website đã được public.** Để xuất bản:

1. Merge pull request để workflow nằm trên nhánh mặc định `main`.
2. Vào **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Nếu cần, đặt các biến cấu hình công khai tại **Settings → Secrets and variables → Actions → Variables**. Không đặt API key ElevenLabs vào các biến Vite.
4. Vào **Actions → Deploy Voicekey to GitHub Pages → Run workflow** trên `main`.
5. Workflow build với `BASE_PATH=/arena/` và hiển thị URL website sau khi deploy thành công.

GitHub Pages chỉ host frontend tĩnh; không chạy backend thanh toán/cấp key. Có thể triển khai thư mục `dist/` lên Vercel, Netlify hoặc static hosting khác với `BASE_PATH=/` cho tên miền gốc. Luôn dùng HTTPS để clipboard và các tính năng trình duyệt hoạt động phù hợp.

## Cấu trúc

```text
src/
  components/       Giao diện, checkout, studio, dialog, FAQ
  config/product.ts Cấu hình công khai và chế độ demo
  hooks/            Vòng đời Web Speech API
  lib/              Nhập file, lưu trữ, mẫu code, helper + unit tests
  test/             Thiết lập Vitest
  styles.css        Thiết kế và responsive
public/
  images/           Minh họa sóng âm WebP
  favicon.svg
e2e/                Playwright và kiểm tra accessibility
.github/workflows/  CI và deploy Pages thủ công
```

## Tài liệu và tài nguyên

- API chuyển văn bản thành giọng nói dùng endpoint `POST /v1/text-to-speech/:voice_id` và header `xi-api-key`: [1](https://elevenlabs.io/docs/api-reference/text-to-speech/convert).
- Mẫu code dùng `eleven_flash_v2_5` để phù hợp nội dung tiếng Việt. Tài liệu ElevenLabs liệt kê tiếng Việt trong các ngôn ngữ bổ sung của Flash v2.5: [2](https://elevenlabs.io/docs/overview/capabilities/text-to-speech). Cần key có quyền truy cập model và voice ID phù hợp; ví dụ chưa được thực thi với tài khoản thật.
- Minh họa sóng âm được tạo bằng AI riêng cho giao diện; không phải ảnh sản phẩm hay tài sản chính thức của ElevenLabs.
- Font Be Vietnam Pro và Lora từ Fontsource; biểu tượng Lucide. Tài nguyên thư viện tuân theo giấy phép tương ứng.
