# Nếp — mặt đứng nhiệt đới đương đại

Phương án hoàn thiện mặt trước và mặt hông phải, giữ nguyên mặt bằng và các lỗ cửa.

## Ý đồ — bản chỉnh gọn mặt bên và ban công

- Giữ khung lớn ôm góc, nhưng bỏ toàn bộ mảng xanh, gốm gân hông và gốm trên chuồng cu. Tầng 2 và khối mái thống nhất trắng ngà; giữ sắc đất nung ở mảng cửa mặt trước.
- Ban công master dùng tường đặc liên tục cao 1,10 m, dày 160 mm, có nắp bo nối liền qua góc; thay lan can sắt đen và các bồn cây rủ bằng một chậu hoa nhỏ trên nắp tường.
- Tầng trệt ốp porcelain tông greige sáng giả đá limestone mờ, khổ 600×1200 mm, mạch 3 mm. Hai trụ cạnh cổng, góc cong và mặt bên cùng tông; không ốp lên cánh cổng gỗ.
- Nền hiên dùng gạch cùng tông 600×600 mm, ý đồ bề mặt nhám chống trượt (khi mua cần kiểm tra cấp chống trượt thực tế, ưu tiên R11 cho chỗ dễ ướt). Giữ nền phẳng, cao độ, dốc mép cổng và ba vị trí xe hiện có; không lát lấn ra đường hẻm.
- Cửa sổ và cửa thoát hiểm được trừ khỏi từng viên bằng phép trừ hình chữ nhật. Không tạo nhiều lỗ khoét chồng nhau trên một tấm lớn: cách cũ gây tam giác phủ lên kính khi lỗ cửa và lỗ cục nóng giao nhau.
- Lớp gạch ngoài tường được chia tại chỗ ranh đất đổi hướng, tự ẩn cùng lớp mặt đứng khi xem tường thấp.

## Tham khảo đã xem

1. [HOIKIENG19 / Hinzstudio, Đà Nẵng](https://www.archdaily.com/1038304/hoikieng19-house-hinzstudio): khối bo liên tục, lớp hiên che nắng và cây xanh.
2. [Nam House / 90odesign](https://www.archdaily.com/1037034/nam-house-90odesign): sắc ấm, khung mặt đứng có chiều sâu và lớp đệm riêng tư.
3. [Nature Curtain House / Sense Design Studio](https://www.archdaily.com/1011752/nature-curtain-house-sense-design-studio): lớp lọc sáng và cây trong hẻm hẹp.
4. [The Umbrella / AD+studio](https://www.archdaily.com/903000/the-umbrella-ad-plus-studio): mái bảo vệ và khoảng ngoài trời cho nhà góc hẻm.

Toàn bộ chi tiết mới là mesh dựng bằng code; không đưa ảnh tham khảo hoặc model của các công trình trên vào bản phân phối.

## Giới hạn

Đây là phối cảnh ý tưởng, chưa phải hồ sơ thi công. Khung ban công nhô tới khoảng 340 mm, viền sân thượng 180 mm và mái che cửa 300 mm so với đường dựng tương ứng; cần kiểm tra lại ranh đất, quyền đua ra hẻm, kết cấu neo, thoát nước và chống thấm với kiến trúc sư/kỹ sư tại chỗ. Các khung và lam là lớp kiến trúc mới, chưa tính tải trọng, neo giữ, chống gió bão hoặc bảo trì. Mô phỏng không xác nhận cấp chống cháy hay độ bền của sản phẩm thực tế.

### Chỉnh tiếp giáp

Bỏ các khung đứng trang trí tại ban công/cửa trước, giữ một lớp viền bo ngang và một mặt dưới màu gỗ. Phần cây rủ sân thượng vươn ra ngoài viền để không xuyên qua mái. Gạch hông tầng 1 lên một cao độ liên tục; bổ sung mặt trong hai vách hiên, mặt sau tường cổng và nắp tường nối qua góc bo.

### Cập nhật lan can và cầu thang

Khôi phục lan can thanh đen ban công master theo chu vi cũ, bỏ tường đặc; chậu hoa đặt xuống sàn. Hai cầu thang dùng mặt bậc và chiếu nghỉ vân gỗ, chân thanh lan can ra ngoài mép, bản mã bắt hông bậc dưới cao độ mặt đi. Đây là mô phỏng chi tiết, cần kỹ sư xác định loại neo và liên kết thực tế. Vách sau phòng thờ là một đoạn liền, thay cho vách sau và vách chắn thang đặt song song sát nhau; giữ vị trí bàn thờ, lối đi sau và vách bao mép ngoài ô thang.

## Master front: rounded balcony niche study

- Reference: the two owner-supplied narrow-house facade images, using recessed balcony depth, an asymmetric soft corner, warm timber and restrained planting.
- Added a curved ivory head with its vertical return on the existing master dividing wall; no new freestanding column or room-layout change.
- Recessed timber ceiling and warm inset strip, greige study-window field, muted timber reveals and shallow battens.
- Compact 430 × 690 mm corner planter with a small branched tree; black balcony rail retained. Existing balcony door and floor dimensions unchanged.
- Checked front/oblique daylight and night views. `npm run check`, `npm run build` and `git diff --check` pass. Screenshots: evidence/223–225.

## Privacy guard and fixture corrections

- Master balcony: continuous curved 695 mm solid base with black rail to 1.12 m, sharing one path through the front/side corner. Removed the old separate rail pieces.
- Facade lamp now fits on its timber backing; number plaque and downlight attach flush to finished gate tiles. Removed the triangular address-light overlay and changed the plaque to a lit matte material.
- Ground porch: removed the wall sconces, replaced with two compact ceiling downlights attached to the timber soffit. Their geometry is batched separately and hidden with the soffit in cutaway mode.
- Model checks, build and whitespace validation pass; day/night screenshots inspected (226–229).

### Revised master guard proportions

Raised the solid wall/coping to 865 mm and shortened the exposed rail to 255 mm (60% of its former 425 mm). Total rail height remains 1.12 m. Removed the bottom horizontal rail; vertical bars embed 10 mm into the coping. Rail and handrail use the shared warm bronze-brown palette (#655c4d). Daylight view inspected in evidence/230; model check and build pass. Push held at the owner's request.
