# Bộ xuất bản vẽ kiến trúc

## Sử dụng

Advanced → Xuất bản vẽ. Bộ bản vẽ mở trong tab riêng:

- **In / Lưu PDF**: khổ A3 ngang, tỷ lệ 100% (Actual size), tắt header/footer trình duyệt. Tỷ lệ chỉ có ý nghĩa khi không dùng Fit to page.
- **SVG tờ đang chọn**: vector kích thước giấy 420 × 297 mm. Mặt đứng có ảnh raster nhúng và được ghi không tỷ lệ.
- **DXF mặt bằng**: giao tuyến thật giữa mesh và mặt phẳng cắt; đơn vị mm, ba tầng đặt cạnh nhau cách 10 m, layer PLAN_1–3. Đây là linework, không phải BIM hoặc bản vẽ CAD có đầy đủ block/ký hiệu.
- **Số liệu JSON**: ranh gốc, đường bao phương án, thông số thang, vị trí cột minh hoạ, đa giác phòng, phần trừ diện tích, từng cạnh/góc/toạ độ.

Mô-đun chỉ tải khi bấm xuất. Không thêm thư viện PDF/CAD vào bundle khởi động. Bộ xuất dùng in PDF của trình duyệt; không có server lưu hồ sơ.

## Thành phần

- Danh mục và tình trạng hồ sơ.
- Ranh đất / định vị sơ bộ 1:100: phân biệt ranh truy từ ảnh và đường bao bo hiên đề xuất.
- Ba mặt bằng 1:75: cắt ngang mesh tại cao độ sàn +1,10 m; trục dọc 1–5, kích thước bao / nhịp, số khu và diện tích.
- Mặt cắt dọc 1:75 qua vế thang, đường cao độ, thông số thang.
- Hình chiếu trực giao mặt trước / mặt bên từ mô hình (không tỷ lệ, không thay thế bản mặt đứng kỹ thuật có đầy đủ ghi chú).
- Bảng cạnh/góc/toạ độ của tất cả khu và phần trừ diện tích, không bỏ các cạnh ngắn. Đơn vị chiều dài mm, cao độ m, diện tích m².

Giao tuyến mô hình có thể chứa đồ đạc hoặc chi tiết trang trí cắt qua mặt phẳng; không phải hình học tường BIM. Không thể suy thông số kết cấu từ độ dày mesh.

## Nghiên cứu hồ sơ tại Việt Nam · 16/11/2026

Nguồn tra cứu:

1. Cổng DVC Quốc gia, hồ sơ nhà ở: https://dichvucong.gov.vn/p/home/dvc-tthc-thu-tuc-hanh-chinh-chi-tiet.html?ma_thu_tuc=244547
   Trang này là thủ tục **có thời hạn**, còn dẫn nhiều văn bản cũ; dùng để đối chiếu nhóm bản vẽ và tỷ lệ, không coi là xác nhận quy trình hiện hành áp dụng cho nhà này.
2. Bộ Xây dựng, trả lời về hồ sơ: https://moc.gov.vn/vn/pages/ChiTietHoiDap.aspx?chID=10730
   Kết quả tìm kiếm dẫn Điều 60 Nghị định 217/2026/NĐ-CP. Lần mở trang đầy đủ lỗi 502; đối chiếu thêm nội dung điều 60 tại https://vanban.org/van-ban/nghi-dinh-217-2026-nd-cp-luat-xay-dung-quan-ly-hoat-dong-xay-dung/dieu-60 . Không chốt thẩm quyền, lệ phí hoặc thời hạn xử lý từ kết quả tìm kiếm.
3. VSQI, danh mục chính thức TCVN 5671:2012 (hồ sơ thiết kế kiến trúc): https://tieuchuan.vsqi.gov.vn/tieuchuan/view?sohieu=TCVN+5671%3A2012
4. VSQI, danh mục chính thức TCVN 5571:2012 (khung tên): https://tieuchuan.vsqi.gov.vn/tieuchuan/view?sohieu=TCVN+5571%3A2012

Hai tiêu chuẩn VSQI xác nhận phạm vi thành phần/ký hiệu và khung tên. Bộ xuất hiện tại tham khảo cách tổ chức bản vẽ, chưa được kiểm tra đầy đủ theo từng điều của tiêu chuẩn và không tuyên bố đạt chuẩn nộp phép.

Nhóm hồ sơ cần có: mặt bằng trên lô đất kèm sơ đồ vị trí; mặt bằng các tầng, mặt đứng, mặt cắt chính; mặt bằng/mặt cắt móng; sơ đồ đấu nối cấp điện/cấp nước/thoát nước; an toàn nhà liền kề và các hồ sơ pháp lý/thẩm tra/PCCC khi áp dụng. Đơn vị thiết kế cần xác nhận thành phần và quy định hiện hành với cơ quan tiếp nhận tại địa chỉ nhà.

## Phần chưa đủ để xin phép / thi công

- Thiếu khảo sát và toạ độ ranh pháp lý; góc đất hiện được nội suy từ ảnh, bo hiên chưa được xác nhận trong ranh.
- Thiếu quy hoạch, chỉ giới, khoảng lùi, điều kiện mở cửa ra kiệt và xác nhận mốc cao độ chống ngập.
- Chưa thiết kế móng, dầm, sàn, cốt thép; cột 250 mm chỉ minh hoạ.
- Chưa có bản vẽ đấu nối điện nước, bảng cửa và đầy đủ chi tiết kiến trúc / kết cấu.
- Chưa có chủ trì thiết kế, kiểm tra, chữ ký/xác nhận hoặc cam kết công trình liền kề.

Không tự tạo chữ ký, con dấu, toạ độ khảo sát hay số liệu chịu lực. Bản xuất ghi rõ “phương án”, để mang trao đổi với kiến trúc sư/kỹ sư hoàn thiện hồ sơ.
