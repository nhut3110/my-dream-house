# Nội thất & giấy phép — Phương án 01

## Model tải từ internet và đã dùng trong cảnh

- **Sheen Wood Leather Sofa**: sofa tại phòng khách tầng một và phòng sinh hoạt tầng hai.
  - Nguồn: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenWoodLeatherSofa
  - Bản gốc: Fran Calvente, Poly Haven `sofa_03`, CC0 (2021).
  - Cải tiến model: Eric Chadwick / Darmstadt Graphics Group GmbH (2024), **CC BY 4.0**. Demo sử dụng phiên bản cải tiến và ghi nhận tác giả tại đây.
  - File: `public/models/sofa.glb`. Clone, đặt kích thước rộng 2,35 m ở tầng một; 1,50 m tầng hai, xoay dọc phòng, giữ tỉ lệ model.
- **Sheen Chair**: ghế bành tầng một.
  - Nguồn: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/SheenChair
  - Eric Chadwick / Wayfair LLC (2020), **CC0**.
  - File: `public/models/chair.glb`. Rộng 0,72 m, giữ tỉ lệ model.

Hai file README giấy phép nguyên gốc lưu cùng GLB trong `public/models`.

## Dựng theo thông số bằng code

Đường bao, tường có cửa thật, sàn có ô thang/giếng sáng, cầu thang, mái, lan can, pergola, giường, chăn gối, tủ, bếp, bàn ghế ăn, bàn trà, thiết bị WC/giặt, cây và đèn: hình học tham số trong `src/house.js`. Vật liệu gỗ/vữa tạo bằng canvas; không phụ thuộc ảnh texture từ dịch vụ ngoài.

## Công cụ / skill

- Three.js 0.181.0 (MIT), Vite 7.2.0 (MIT).
- Skill `interior-design-expert` của curiositech/some_claude_skills (MIT), cài riêng tại `.agents/skills/interior-design-expert`. Dùng để tham khảo khoảng đi lại, tỉ lệ nội thất và bảng màu Japandi; không dùng để xác nhận kết cấu/quy chuẩn xây dựng.
- Các skill Three.js fundamentals, lighting, loaders, interaction có sẵn trong môi trường.

Đây là mô hình ý tưởng có thể xuất GLB, không phải sản phẩm mô phỏng kết cấu hoặc hồ sơ thi công.

## Cập nhật tầng một — 14/11/2026

- Thay sofa cổ bằng **Glam Velvet Sofa** (mẫu Mercer41 Frankie), Eric Chadwick / Wayfair LLC, 2021, **CC BY 4.0**.
- Nguồn: https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/GlamVelvetSofa
- `public/models/modern-sofa.glb` (~3 MiB), sofa tầng một dài 2,10 m, hướng vào TV bên trái. Điều chỉnh tông vải xám olive; bỏ đèn punctual nhúng để giữ ánh sáng chung của ngôi nhà. README gốc lưu tại `public/models/MODERN-SOFA-LICENSE.md`.
- Model sofa cổ và ghế trước đó giữ làm tài liệu nguồn; không còn tải trong cảnh. Sofa tầng hai dùng cùng mẫu mới.
- Hai xe máy là mô hình tham số để kiểm tra sân đỗ (khung bố trí 1,85 × 0,68 m mỗi xe), không phải model sản phẩm cụ thể.

## Sofa hiện đang dùng

Sofa chữ L 2,30 × 1,62 m là mô hình tham số tự dựng trong `src/house.js` (sectionalSofa). GLB GlamVelvetSofa cũ không còn được tải, giữ lại để tham khảo cùng giấy phép gốc.

## Tủ lạnh tham chiếu — 15/11/2026

- Mô hình tham số theo **Samsung RS62R5001M9**, 2 cánh side-by-side: rộng 912 × sâu 716 × cao 1780 mm. Kích thước mô hình gồm cả cánh, không cộng cánh ra ngoài chiều sâu tham chiếu.
- Thông số hãng: https://www.samsung.com/th/refrigerators/side-by-side/655l-gentle-silver-matt-rs62r5001m9-st/
- Hướng dẫn lắp đặt Samsung (tham khảo chung; cần đối chiếu máy mua thực): https://www.samsung.com/vn/support/home-appliances/how-to-install-a-samsung-side-by-side-refrigerator/ — hai bên 100 mm, phía trên 50 mm, phía sau 50 mm. Mô hình chừa 100 mm hai bên, 55 mm nóc và trên 50 mm sau lưng; không bịt kín khe thoáng.
- Đã đối chiếu thêm Panasonic NR-YW590YMMV 4 cánh: 750 × 750 × 1890 mm (R × S × C), https://www.panasonic.com/vn/consumer/home-appliances/fridge/prime-edition/nr-yw590ymmv.html . Đây là mẫu cao hơn; không mặc định rằng mọi tủ 4 cánh đều lắp vừa khoang hiện tại.

## Compact worship furniture reference · 2026-11-15

- [Tâm Việt TT215](https://banthotamviet.vn/shop/phong-tho-gia-tien-va-tho-phat-tt215/): reference for ancestor table 153 × 61 × 107 cm and higher Buddhist tabletop.
- [Nét Việt PT16](https://banthonetviet.com/khong-gian-phong-tho-pt16): coordinated timber furniture, restrained traditional/modern apron and matching secondary table.
- [Tâm Phát BT-1082](https://noithattamphat.com/phong-tho-phat-va-gia-tien-dep-mau-bt-1082): separate matching tables, Buddhist table higher than ancestor table.
- [bantho.net combined room](https://bantho.net/mau-ban-tho-phat-va-2-ban-tho-gia-tien-chung-phong-tho): 127 × 61 cm Buddhist table reference footprint.

Original procedural geometry; reference images/models are not copied or redistributed. Current option keeps owner-requested Buddha-front / ancestors-back arrangement, not a claim of universal ritual correctness. Ancestor tabletop 153 × 61 × 107 cm, Buddhist tabletop 127 × 61 × 127 cm. The 100 mm gap is an intentional compact furniture separation, not a walking/service aisle; servicing is from the sides. Side screen reduced 185 → 145 cm, retains concealment of legs/cable route; front tabletop overhangs screen by 15 mm.
