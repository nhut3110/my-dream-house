# Nhà mình — ba tầng minimalist

Xem http://localhost:4190/ (`npm run dev`). Trái/phải luôn tính từ sân nhìn vào. Đơn vị mét. Giữ dữ liệu thửa đất 7 đỉnh gốc; phương án hiện tại bo lồi góc hiên theo yêu cầu, chưa phải ranh xây dựng đã xác minh.

## Bố cục hiện tại

- Hiên sâu 2,30 m, cốt -0,30 m; hai bậc cao 150 mm. Ba xe kích thước Lead đỗ song song. Góc trước bo lồi bán kính khoảng 240 mm.
- Sofa chữ L bên trái (2,30 × 1,62 m), TV bên phải. Thang chữ L vẫn trái: 4 cổ bậc đầu rồi vế dài dọc tường lên cao độ tầng hai 3,30 m đang giả định.
- Bốn bậc đầu đặc, có tủ thấp. Hệ tủ phụ và tủ lạnh vẫn dưới thang trái.
- Bếp nấu/rửa bên phải, từ z=5,65 đến 8,50 m. Cửa thoát sau bếp ở tường phải, tâm z=9,50 m.
- Bàn ăn bốn chỗ ở giữa, xoay ngang. Đo cảnh 3D: lối phía bếp 956 mm, phía tủ phụ 713 mm; phía tủ phụ hẹp hơn khi thao tác mở cánh.
- Cuối nhà: WC nhỏ bên trái khoảng 1,5 × 1,9 m; lavabo ở ngoài, trước WC. Phòng hai giường đơn bên phải, cửa riêng từ khu chung. Bên trái và sau không mở cửa sổ.

- Tầng 2: master phía trước có ban công, giường 1,8 × 2 m, tủ áo và bàn làm việc; phòng nhỏ phía sau có giường 1,4 × 2 m, tủ áo, bàn 0,8 m và ghế nhỏ. Cả hai có WC riêng. Khu giữa có hai ghế lười và bàn thấp, hành lang cạnh thang rộng khoảng 0,95 m.

## Xem và kiểm tra

- 3D: tập trung phòng khách. Tổng thể: xem cả tầng. Mặt bằng: sân ở phía dưới màn hình.
- Nút Thang ẩn/hiện thang để xem hệ tủ và lavabo. Xuất GLB vẫn bao gồm thang.
- Người tham chiếu cao 1,70 m (mặc định ẩn).
- Ảnh mới: `evidence/26-right-kitchen-overview.png`, `27-right-kitchen-plan.png`, `28-right-kitchen-no-stair.png`.
- File 3D hiện tại: `plans/phong-khach-minimalist.glb`.
- Bản trước khi đổi: `revisions/before-right-kitchen/`.

`npm run check` kiểm tra đường bao, hướng nội thất, chiều cao thang, gầm tủ lạnh, lối bếp và vị trí cửa; `npm run build` đóng gói Vite. Nguồn/giấy phép ở `ASSETS.md`; nội thất hiện tại là mô hình tham số tự dựng. Đây là bản bố trí thử, chưa kiểm định kết cấu, cấp thoát nước, thông gió WC hoặc quy chuẩn thi công.

## Chỉnh mới nhất: tủ khít gầm thang và sảnh chung

- Bỏ cửa sổ sau TV; chỉ giữ cửa sổ phòng ngủ bên phải.
- Tủ gầm thang dạng cánh cắt vát theo đáy bản thang, khe trên 25 mm; tận dụng cả khoang thấp và khoang phía trên tủ lạnh.
- Tủ lạnh side-by-side mẫu kích thước 912 × 716 × 1.780 mm, hai cánh đứng. Dịch từ z=9,85 về z=9,28 m, mặt tủ lạnh lùi so với mặt tủ gầm thang khoảng 14 cm. Giữ khoảng thoáng quanh khoang; chưa chốt model thương mại cụ thể.
- Lavabo ngoài WC thu còn mặt 400 × 440 mm, đặt trong hốc bên trái trước cửa WC; WC giữ khoảng 1,5 × 1,9 m.
- Mặt trước phòng ông bà ở z=10,10 m; cửa trượt rộng 850 mm chuyển sang vách bên trái, tâm z=10,64 m, mở vào sảnh chung trước WC. Mặt trước phòng không còn cửa.
- Cửa thoát phải dịch về z=9,50 m, mép ô cách vách trước phòng ông bà 125 mm.
- Đã kiểm tra browser: lavabo tách khỏi hệ tủ 230 mm theo chiều dọc; tủ lạnh kết thúc trước lavabo 924 mm. Đã kiểm tra hướng cửa và số cửa sổ.
- Ảnh mới: `evidence/29-fitted-storage-overview.png`, `30-fitted-storage-exposed.png`, `31-shared-vestibule-plan.png`.

## Nới sảnh và tối giản phòng ông bà

Bỏ khoang tủ cuối cao nhất sau tủ lạnh: hệ tủ dừng tại z=10,10 m thay vì 10,43 m. Nắn vách đoạn cửa phòng ông bà sang phải 300 mm, tạo hốc vào rộng hơn; phần WC giữ nguyên. Hai giường đơn 1 × 2 m xoay ngang, đầu giường về phía cửa sổ bên phải. Tủ quần áo cánh trượt 1.300 × 580 × 2.250 mm đặt sát vách chung với WC, trong phần lõm bên trái phòng; tường phía trước giữ thẳng. Lối giữa hai khung giường khoảng 570 mm; từ mặt tủ đến chân giường khoảng 659 mm, không cấn cửa phòng. Ảnh mới: `evidence/34-wardrobe-wc-wall.png`, `35-wardrobe-wc-wall-plan.png`.

## Cập nhật vách cạnh tủ lạnh và tủ phòng ông bà

Bỏ toàn bộ khoang tủ cao phía sau tủ lạnh hướng WC, chỉ giữ vách kết thúc dày 25 mm. Tủ quần áo sát vách chung WC kéo dài từ 1,30 lên 1,90 m (z=11,20–13,10 m), chừa khe lắp đặt hai đầu; không đổi vị trí giường hoặc cửa. Ảnh: `evidence/36-fridge-panel-long-wardrobe.png`.

Lavabo ngoài WC và gương cùng dịch 330 mm về phía khoảng trống cạnh tủ lạnh (tâm z=10,55 m). Mép gương cách vách WC khoảng 270 mm, không còn chạm vách; mép lavabo cách vách kết thúc tủ khoảng 534 mm. Ảnh: `evidence/37-basin-mirror-spacing.png`.

## Thử tăng hiên thêm nửa mét

Dời cửa kính và hai bậc vào trong 500 mm: hiên sâu 2,30 m, phòng khách giảm chiều sâu 500 mm. Giữ nguyên cầu thang và các khu phía sau. Thu gọn mảng ốp sau TV để không vượt ra hiên, dịch đèn sàn và bàn trà nhẹ vào trong.

## Chế độ kích thước phòng

Nút `Kích thước phòng` mở sơ đồ 2D theo tỉ lệ và bảng ngang × sâu (khung bao lớn nhất), diện tích đa giác theo bố trí hiện tại. Hiên tính theo đường bao sân; phòng khách và bếp–ăn là các khu mở chia tại đầu thang. Khu bếp–ăn gồm thang và tủ. WC và phòng ngủ theo mặt trong vách; diện tích chưa trừ nội thất. Bảng có thể cuộn để xem đủ các khu. Chọn các chế độ 3D/mặt bằng khác để đóng.

## Sửa đèn, bậc đầu và ba xe

Chuyển đèn sàn sang cạnh cuối sofa, tách khỏi khung ghế và lối vào. Bỏ các lớp mặt đứng chồng lên thân bậc dưới, chỉnh thân bậc kết thúc tại đáy mặt bậc. Hiên bố trí ba xe kích thước Lead 714 × 1.844 mm song song, kiểm tra đường bao và khoảng cách từng cặp.

## Đèn thay bàn cạnh sofa và camera tự do

Bỏ bàn tròn giữa sofa và cầu thang, đặt đèn vào đúng tâm vị trí bàn cũ. Nút `Tự do` chuyển sang camera phối cảnh: kéo chuột trái để nhìn, WASD/phím mũi tên di chuyển ngang mặt đất, Q xuống/E lên, Shift nhanh, con lăn tiến/lùi, Escape về góc nhìn thường. Các chế độ thường cũng nhận phím di chuyển sau khi bấm vào cảnh. Di chuyển dừng khi mất focus hoặc mở hộp thoại/bảng đo. Camera tự do không có va chạm, có thể xuyên tường để khảo sát.

## Chuẩn bị tầng 2 và giao cầu thang

Giữ thang rộng 950 mm, 20 cổ bậc × 165 mm lên cốt +3,30 m. Tay vịn vế dài nối qua đúng đầu trụ. Chiếu tới 950 × 950 mm, để hở bên phải ra sàn tầng hai; bỏ thanh chắn dọc lối ra. Sàn tầng hai dày giả định 180 mm, khoét ô theo vế thang và chiếu tới; lan can ô thang cao 1.050 mm. Phần trần trước ô mở có khoảng thông thủy tối thiểu tính toán 2,13 m. Đây là kiểm tra hình học mô hình, chưa phải thẩm định kết cấu/quy chuẩn. Thêm chọn Tầng hai / Liên tầng; tầng hai mới có sàn và ô thang, chưa chia phòng.

## Hai phòng ngủ khép kín và bo hiên

Đường biên demo bo lồi R≈240 mm qua phần góc lõm cũ. Dữ liệu sổ đỏ giữ trong `plot-geometry.json`, hình mới là phương án thẩm mỹ có lấn ra phần lõm cũ, cần kiểm tra quyền sử dụng/ranh khi thi công. Mối giao tầng: tường vươn đến đáy sàn +3,12 m; bỏ khe 80 mm bên ô thang, bỏ trụ đen trùng và lan can sát tường thừa; thân chiếu tới dừng dưới lớp mặt bậc để không trùng mặt ở +3,30 m.

Tầng hai chia master trước với ban công/WC riêng, phòng nhỏ sau với WC riêng, khu chung ghế lười ở giữa. Master giường 1,8 × 2 m, tủ 1,7 m, bàn làm việc 1,2 m; phòng nhỏ giường 1,4 × 2 m, tủ 1,6 m, bàn 0,8 m và ghế. Cửa phòng nhỏ dùng cửa trượt để không quét vào bàn. Đã dò khối bao giường/bàn/tủ để tránh chồng nhau. WC master cần giải pháp hút gió/đường kỹ thuật; bản này chưa thiết kế MEP/kết cấu. Bảng kích thước hỗ trợ cả hai tầng. Bản trước ở `revisions/before-upper-bedrooms`.

## Giao diện toàn màn hình và mobile

Bỏ sidebar cố định. Dock dưới gồm Info (sheet bên trái), chọn tầng, góc nhìn, camera tự do, đo phòng và công cụ. Popover công cụ giữ đủ ẩn tường/thang, nhãn, người, số đo gốc, reset, lưu ảnh và xuất GLB. Các icon SVG thống nhất và có nhãn truy cập/title. Mobile có safe-area, dock gọn, Info cuộn riêng; camera tự do có pad giữ để di chuyển lên/xuống/trái/phải/tiến/lùi. Màn dọc mở góc tổng thể hẹp phương ngang, DPR tối đa 1,3 và shadow 1.024 trên thiết bị cảm ứng. Đã kiểm tra desktop, viewport iPhone dọc/ngang; chưa đo trên thiết bị thật.

## Tạm dọn tầng 2

Theo yêu cầu mới, bỏ toàn bộ vách ngăn phòng/WC và nội thất tầng 2 khỏi cảnh hiện tại. Giữ sàn, vách bao, ban công/cửa kính, ô thang và cầu thang. Mở trang mặc định ở mặt bằng tầng 2. Bố cục có phòng được lưu tại `revisions/furnished-upper-floor/`. Bảng đo tầng 2 chỉ còn ban công và sàn trống, trừ phần ô thang mở.

## Cầu thang rẽ phải và thang lên tầng 3

Hai thang dùng chung hình chiếu, lệch cao độ 3,30 m. Mỗi thang có 20 cổ bậc × 165 mm, rộng 950 mm: 4 cổ bậc đầu, 12 cổ bậc dọc tường, chiếu nghỉ rẽ phải ở +2,64 m và 4 cổ bậc cuối lên +3,30 m. Chiếu tới 950 × 950 mm thông ra sàn. Ô sàn tầng 2 đổi thành chữ L theo vế cuối; thang 2→3 tới +6,60 m, chưa dựng sàn/phòng tầng 3. Tầng 2 tiếp tục để trống. Bản trước được lưu trong `revisions/before-right-turn-stairs/`.

### Tinh gọn lan can thang

Bỏ lan can vòng tại lối rẽ vào tầng 2 và tay vịn/cọc quanh bốn bậc đầu của cả hai thang. Dọc cạnh trong ô thang tầng 2 dùng vách đặc dày 100 mm, cao 1,05 m, sát mép thang 2→3; không đổi vị trí hay kích thước bậc.

## Chia hai phòng theo phác thảo đỏ/xanh của chủ nhà

Tầng 2 dựng phòng nhỏ phía sau, phòng lớn chữ L phía ban công và phần nhô bên phải; giữ nguyên đường bao và cầu thang. Nét chéo trong phác thảo là cánh cửa mở, không phải vách chéo. Cửa phòng lớn rộng 950 mm, phòng nhỏ 920 mm theo tim vách; khung cửa chiếm 80 mm. Hai phòng chỉ có vách/cửa, chưa bố trí WC hoặc đồ đạc. Cửa kính ra ban công giữ nguyên. Khu giữa có bục gỗ cao 140 mm, hai ghế lười và quạt đứng; chừa lối sàn phẳng khoảng 1,30 m cạnh bục. Tọa độ ranh phòng nội suy theo nét khoanh trên ảnh; có thể chỉnh tiếp, không coi nét vẽ tay là kích thước chốt. Bản trước lưu tại `revisions/before-owner-room-outline/`.

Điều chỉnh cửa theo yêu cầu tiếp theo: cả hai cửa phòng tầng 2 dùng chung mẫu cửa lùa gỗ phòng ngủ tầng 1, cánh cao 2,15 m, tay nắm đen và ray trên; bỏ cánh giả lập cắt thấp. Có tường phía trên ô cửa. Chế độ tường thấp ẩn cánh cửa như tầng 1.

## Nội thất phòng nhỏ theo sơ đồ tô màu

WC ở trái phía cuối nhà, giường bên phải, cửa sổ vách phải, tủ ở vách phía khu chung. WC lọt lòng khoảng 1,79 × 2,63 m, cửa lùa 750 mm thông từ phòng ngủ; có khu tắm phía sau, bồn cầu quay ngang và lavabo phía trước. Giường nệm 1,40 × 2,00 m, đầu giường quay về tường sau. Tủ 1,90 × 0,58 m, cao 2,55 m; bàn 720 × 400 mm với ghế nhỏ và hai tab đầu giường. Khoảng đi giữa vách WC và khung giường 0,83 m, phía cửa sổ khoảng 0,87 m, chân giường đến mặt tủ 0,90 m. Cửa sổ phải rộng 1,50 m ở vị trí giường; bỏ cửa sổ cũ cắt ngang vị trí tủ/vách phòng nhỏ. Phòng lớn tiếp tục để trống. Bản trước nằm tại `revisions/before-small-room-furniture/`.

## Master theo sơ đồ màu mới

Ban công chỉ giữ phần bên phải, rộng khoảng 1,61 m và sâu 1,45 m (~2,42 m² theo đường bao); hai phần ba còn lại nhập vào phòng, mặt trước xây vách có cửa sổ trên bàn PC. Giường 1,80 × 2,00 m đặt đầu bên trái, hướng chân về TV. WC bên trái gần cửa phòng, lọt lòng khoảng 1,88 × 1,55 m, cửa lùa 750 mm; bố trí tắm, bồn cầu và lavabo gọn. Bàn PC 1,85 × 0,60 m có màn hình, case, bàn phím, chuột và ghế; lối cạnh giường khoảng 0,60 m khi ghế đẩy vào. Bàn trang điểm 1,25 × 0,42 m ở cuối phần nhô; tủ áo dài 2,20 m và hệ TV dài 1,75 m dọc bên phải. Tường/cửa kính ban công, cửa sổ và bảng diện tích đã cập nhật. Phòng nhỏ và khu chung giữ nguyên. Bản trước lưu ở `revisions/before-master-suite/`.

## Nới không gian chung và chỉnh hướng TV

Lùi vách cuối phần master có bàn trang điểm từ Z=7,45 về 6,80 m (650 mm), tăng khoảng 1,4 m² cho khu chung. Bàn trang điểm chuyển theo vách; tủ áo rút từ 2,20 xuống 1,65 m để không cấn. Khu mới để trống cho bàn làm việc/học sau này. Cửa sổ bên phải khu chung rộng 1,10 m, bậu 950 mm. TV chuyển đúng trục Z=2,50 m của giường và lùi sát vách phải phù hợp đường bao. Master có cửa sổ thông gió trên cao rộng 650 mm, cao 650 mm, bậu 1,90 m ở đoạn vách trống trước tủ. Bản trước lưu trong `revisions/before-wider-common/`.

## Cửa master chuyển bên hông, WC mở rộng và bồn tắm

Cửa phòng master chuyển sang vách X=3,15 m, khoảng Z=5,35–6,30 m theo nét cầu vồng, cửa lùa rộng 950 mm. Ô cửa cũ trên vách ngang được xây kín. WC mở từ X=2,15 ra 3,10 m, lọt lòng khoảng 2,83 × 1,55 m; cửa WC chuyển ra vách phía giường để dành vách phải cho lavabo dài 1,10 m, sâu 450 mm. Thử bồn tắm dạng oval rỗng 1,60 × 0,75 m, cao 590 mm, đặt dọc vách sau; khoảng giữa đầu bồn và mặt lavabo khoảng 690 mm. Bồn cầu giữ phía trái vách trước. Bỏ khu tắm đứng riêng và thay bằng bồn tắm trong phương án này. Bỏ bàn trang điểm, thêm tủ áo 1,80 × 0,58 m theo dải xanh, nối bố cục chữ L với tủ bên phải rút còn 1,30 m để không chồng góc. Bản trước lưu tại `revisions/before-master-bathtub/`.

## Trở lại tắm đứng, tab đầu giường và TV sát vách

Bỏ bồn tắm; giữ WC mở rộng. Khu sen trái rộng 1,00 m, sâu 1,46 m, vách kính cố định phía sau chừa lối vào khoảng 740 mm. Bồn cầu về phía giữa vách sau, lavabo 1,10 × 0,45 m sang vách trước; cửa lùa 800 mm chuyển sang vách phải nhìn về tủ, không mở vào phía giường nữa. Giường dời nhẹ 140 mm về phía trước, ghế PC thu vào để giữ khoảng 600 mm cạnh giường. Hai tab gọn 340 × 260 mm có ngăn kéo, phía trên mỗi tab có ổ cắm đôi/USB; không thu nệm giường. TV theo đúng độ nghiêng vách phải, có tấm ốp 40 mm, giá đỡ và khe lắp khoảng 10 mm; tâm màn hình vẫn thẳng trục giường. Tấm ốp vẫn hiện khi hạ tường để tránh cảm giác màn hình nổi. Bản trước lưu tại `revisions/before-master-shower/`.

## Tầng 3 — phòng thờ, sân trước và giặt phơi

Sàn ở +6,60 m, ô thang chữ L nối đúng thang tầng 2→3. Phòng thờ cạnh sảnh thang kích thước tim tường 2,75 × 2,60 m (lọt lòng khoảng 2,63 × 2,48 m), bàn thờ 1,55 × 0,60 m dựa vách sau, quay về mặt trước. Cửa lùa bên hông 900 mm và cửa kính phía sân trước; lối bên hông khoảng 1,09 m, không phải đi xuyên phòng để ra hai sân.

Sân trước có bàn tròn Ø860 mm, bốn ghế tay vịn, ghế băng và cây chậu; tường chắn 580 mm + lan can 570 mm. Sân sau có máy giặt và máy sấy riêng, mỗi máy 600 × 650 mm, chung mái che cao 2,55 m và chừa khoảng 955 mm trước mặt máy. Chỗ giặt tay là bồn thấp khoảng 590 mm, ghế đôn 300 mm; giàn phơi 1,60 × 1,60 m cao 1,90 m tách khỏi mái máy. Mái phòng thờ và mái máy hiện ở chế độ tường cao, ẩn khi xem nội thất. Đây là phương án bố trí; kết cấu, chống thấm, thoát nước và an toàn lan can cần được triển khai kỹ thuật riêng trước thi công.

Dock hỗ trợ cả ba tầng, liên tầng và bảng kích thước tầng 3. Mặc định mở tầng 3 để xem phương án mới. Bản trước lưu tại `revisions/before-third-floor/`.

## Deploy

Repo cá nhân: `nhut3110/my-dream-house`, nhánh `main`. Vercel dùng Vite, Node 24, `npm ci`, rồi `npm run check && npm run build`; đầu ra `dist`. Sau khi kết nối repo, push main tự deploy production; pull request có preview. GitHub Actions chạy cùng check/build, không cần deploy token. Không cần backend hoặc Supabase.

Ảnh tham chiếu gốc, lịch sử bản dựng, ảnh QC và GLB xuất ra giữ ở máy local, không đưa vào repo. Website chỉ phục vụ sơ đồ vector không chứa ảnh giấy tờ gốc.

## Chuồng cu kín chung thang và phòng thờ

Thay phòng thờ đứng riêng bằng khối kín từ Z=6,50 đến 10,60 m, chung một mái liền không khoét trên ô thang. Sảnh bên trái và sảnh sau nối hai sân bằng cửa kính đóng kín rộng 900/950 mm, ngưỡng cao 40 mm, rãnh thu nước nằm phía ngoài. Phòng thờ giữ vách ngăn/cửa nội bộ, hướng bàn thờ không đổi. Mái đặc có mặt dưới phẳng ở 3,05 m và lớp trên tạo dốc 1,5% về máng/ống thoát ngoài sảnh thang. Mô hình thể hiện ý tưởng che mưa, chưa phải chi tiết chống thấm/thoát nước thi công.

Máy giặt và sấy quay mặt ra sân, đặt cạnh nhau dọc vách sau, có mặt bàn trên máy và tủ đồ giặt bên cạnh. Bồn giặt tay thấp và ghế ngồi chung mái che; giàn phơi ngoài trời nằm phía đối diện. Từ cửa sân sau đến mặt máy chừa khoảng 1,69 m. Sân trước có cụm bàn tròn cao 780 mm/bốn ghế trên sàn gỗ phía phải, ghế băng phía trước; chừa lối đi rộng bên trái từ cửa ra sân. Bản trước giữ local tại `revisions/before-enclosed-rooftop/`.

## Mái đưa gọn và sân giặt lộ thiên

Hai máy chuyển về phía trái theo hướng từ sân trước nhìn vào, tựa vách sau chuồng cu và quay mặt về sân sau. Mái kim loại mỏng có trần gỗ, gắn vách, đưa khoảng 1,05 m; chỉ che khoang máy rộng 1,57 m, bỏ mái lớn và cột chống giữa sân. Bồn giặt tay/ghế ngồi ở phía phải, giàn phơi giữa sân đều lộ thiên. Action Tường cao/thấp hiện trực tiếp trên dock; icon dùng tâm hình học riêng, không bị chữ ẩn tạo thêm hàng.

## Điều hòa hai phòng tầng 2

Master: dàn lạnh 880 × 290 × 210 mm trên khoảng trống vách phải, giữa khu TV và cửa thông gió. Phòng nhỏ: dàn lạnh 800 × 290 × 210 mm trên vách phải, phía chân giường, trước cửa sổ. Mép dưới hai máy ở 2,63 m, còn khoảng 200 mm tới đáy sàn trên.

Hai dàn nóng 820 × 600 × 320 mm treo vách phải (từ sân nhìn vào), có giá đỡ và khe sau máy 150 mm. Đáy máy cao 2,43 m so với sàn tầng 2; hai cụm nằm cạnh cửa sổ theo phương ngang để không che ô lấy sáng. Có tuyến ống cao sát trần, đoạn xuống ngoài vách và ống nước ngưng về WC từng phòng. Đây là vị trí/kích thước tham khảo để bố trí; công suất, chiều dài ống cho phép và thông số lắp đặt cần chọn theo máy thực tế.

Bục gỗ khu chung kéo dài tới z=6,90 m, kích thước 2,52 × 2,18 m; giữ nguyên lối đi bằng phẳng cạnh cầu thang và khoảng cách tới vách master.

Sân trước tầng 3 bỏ bộ bàn ghế, giữ khoảng giữa thoáng; bố trí chậu cây và bồn cây rủ theo lan can. Mái che máy giặt có hai trụ thép hộp 55 mm ở hai góc ngoài, tách khỏi ống thoát nước.

### Nội thất, an ninh và cây xanh bổ sung

- Master có kệ sách/trưng bày đồ chơi 1,26 × 0,32 × 1,72 m trong khoảng giữa TV và tủ áo, dưới cửa thông gió.
- Cửa sổ khu chung căn giữa khoảng tường từ z=6,80 đến 9,20 m (tâm z=8,00 m); kính theo góc chuyển nhẹ của mặt bên nhà.
- Tủ TV và bếp tầng 1 bám vách phải, chừa khe lắp đặt khoảng 10 mm; bếp có phần bù theo góc đổi hướng mặt tường.
- Ba xe đặt chéo 45° song song. Kích thước bao theo Honda LEAD ABS: 1.844 × 714 × 1.132 mm, nguồn https://www.honda.com.vn/xe-may/san-pham/lead-abs. Đây là mô hình so kích thước, không phải mẫu 3D chính hãng. Có kệ giày 800 × 280 mm sát phải hiên.
- Cổng/tường hiên cao 2,20 m tính từ sân thấp. Ba camera mô phỏng: góc hiên; vách phải phòng nhỏ tầng 2 nhìn chéo ra đường; bên trong phòng ông bà.
- Bồn cây rủ dùng chung cho ban công tầng 2 và lan can tầng 3, tán dày và dây rủ dài khoảng 1,05–1,85 m. Cây là hình học tĩnh, không có vòng lặp animation.


### Ngày/đêm và bố trí đèn

Mặc định mở toàn cảnh đủ ba tầng, tường cao và khung camera vừa toàn nhà. Nút trăng trong dock chuyển ngày/đêm với chuyển tiếp 650 ms (tắt chuyển động nếu hệ điều hành yêu cầu giảm animation).

Danh mục `src/lighting-plan.js` có 59 đèn: downlight phòng khách/bếp/hành lang, đèn thả bàn ăn, đèn ốp trần phòng ngủ, đèn trần WC/khu tắm, đèn lavabo và đèn dưới tủ bếp; đèn dẫn bậc đi theo cao độ hai vế thang; đèn hiên, ban công, sân trước/sau và dưới mái giặt. Đèn tường thân đen, mặt kính sáng và hắt lên/xuống theo ảnh tham khảo; khu tường thấp có chiều hắt lên ngắn hơn. Phòng ngủ/khu ở dùng tông khoảng 3000 K, khu tác vụ và WC khoảng 3500 K. Biển số nhà hai dòng “356/73 / HOÀNG DIỆU” đặt cạnh cổng.

Ánh sáng phối cảnh dùng tối đa 12 nguồn trực tiếp không đổ bóng bổ sung, kết hợp bề mặt phát sáng và mảng hắt ánh sáng nhẹ. Chuyển ngày/đêm giữ nguyên số light slot để tránh biên dịch lại shader; hình học vỏ đèn được gộp theo vật liệu/tầng. Đây là phối cảnh bố trí, chưa phải mô phỏng lux hoặc bản thiết kế điện thi công.


### Thử nới ban công và hoàn thiện mái

Ban công master nới 300 mm về trái: vách x=3,15 m gióng vách WC/lối vào. Phòng nhỏ giữ giường 1,40 × 2,00 m, chuyển tâm giường sang x=3,15 m; WC còn khoảng 1,45 × 2,63 m lọt lòng. Hai lối cạnh khung giường khoảng 0,60–0,61 m. Loggia nằm trong ranh nhà, dài 1,80 m, sâu sử dụng tối thiểu khoảng 0,66 m; cửa kính lùa 860 mm, hai chậu cây treo trên lan can. Cửa sổ chuyển về bàn học, rộng 700 mm; dàn nóng chuyển về z=9,45 m, tránh cửa sổ và loggia. Bố cục này nhỏ gọn, ưu tiên một góc chăm cây.

Các cửa sổ ngoài nhà có mái kim loại mỏng, mặt dưới gỗ, nhô khoảng 430 mm, có mép hắt nước và giằng mảnh. Bồn nước đứng danh định 1.000 L và thang thép rộng 460 mm đặt trên/sau mái chuồng cu; thang tránh cửa sân sau và hai máy. Vị trí bồn là bố trí concept, chưa tính kết cấu chịu tải mái.

Đèn trang trí vách phải tầng 1–2 gióng theo cùng hai vị trí z=4,95 / 8,80 m, cao 2,10 m trên sàn mỗi tầng. Tăng sáng phòng khách/nội thất, bổ sung hai đèn tường và bốn đèn trụ cho sân trước. Khi xem riêng một tầng, hình học đèn trần chuyển opacity 12% để không che nội thất; chuyển toàn nhà sẽ trở lại vật liệu đặc.


### Thử bếp chữ L và cửa thoát hiểm cạnh TV

Cửa thoát hiểm rộng 0,95 m chuyển đến z=5,65 m, sau mép tủ TV và trước dãy bếp mới. Dãy bếp dài 3,286 m dọc tường phải, nhánh ngang sâu 0,64 m tựa vách phòng ông bà; bếp từ và hút mùi ở dãy dọc, chậu rửa ở nhánh ngang. Có kệ gia vị, thanh dao, ống dụng cụ, thớt và nồi chiên không dầu. Máy lọc nước hai vòi cong đặt cuối nhánh ngang, đối diện tủ lạnh; sau khi xoay 90° ngược chiều kim đồng hồ, mặt vòi hướng về phòng khách. Bàn ăn dịch đến x=2,80 / z=7,35 m để giữ khoảng đứng bếp hơn 0,80 m sau ghế; đèn bàn ăn và đèn tác vụ bếp đi theo bố cục mới. Đây là phương án thử bố trí, chưa phải bản vẽ kỹ thuật lắp đặt điện/nước.


### Các chỉnh sửa hoàn thiện tầng một

Cổng ngoài sân là gỗ trượt hai cánh xếp cùng một phía, bấm/chạm để đóng mở; cửa vào phòng khách vẫn là kính. Vách phòng ông bà phía bếp gióng với vách cuối tủ lạnh. Lan can mặt quay ra cửa lớn chỉ thêm ở cầu thang tầng một, bám mép bậc và chiếu nghỉ, không chặn lối lên. Khung ảnh gia đình sau sofa hiện dùng hình minh họa để thay ảnh thật sau. Bảng kích thước dùng một vùng cuộn chung trên desktop và mobile, hỗ trợ bàn phím. Biển số nhà đặt bên phải gần cổng, chữ không bị phản chiếu và có đèn chiếu trên biển.
