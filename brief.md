# Nhà mới — đề bài và dữ liệu đầu vào

## Nguồn

- `references/01-y-tuong-ba-tang.jpg`: ý tưởng công năng viết tay của chủ nhà.
- `references/02-so-do-dat-nha-hien-trang.jpg`: ảnh sơ đồ ghi TẦNG I và TẦNG LỬNG, nhà cũ hiện tại theo lời chủ nhà. Chưa xác nhận đường bao trong sơ đồ là ranh đất, ranh nhà hay trùng nhau.
- Giữ nguyên hai ảnh gốc, không dùng độ dài pixel trong ảnh chụp xiên làm số đo.

## Chủ nhà xác nhận

- Hiên/cửa chính ở phía góc lõm trên sơ đồ sổ đỏ, tức vùng góc trên trái trên ảnh nguồn. Đây là phía trước để định hướng phương án, chưa suy ra được hướng Bắc hoặc hướng la bàn.
- Sơ đồ hiện trạng là ảnh từ sổ đỏ nhà nước; hiện không có bản scan thẳng, bảng tọa độ, góc hay đường chéo bổ sung.
- Bản viết tay là phác thảo ý tưởng công năng, không dùng tỉ lệ các ô trên giấy làm kích thước phòng.
- Việc xác nhận vị trí hiên không đồng nghĩa chủ nhà đã xác nhận từng số đo được chép từ ảnh.

## Ý tưởng chủ nhà — thứ tự từ phía ghi “hiên” về phía sau trên ảnh phác thảo

### Tầng I

Hiên → phòng khách → cầu thang → bếp và khu “tô lét” → phòng ngủ.

Bếp và WC đang nằm trong cùng một khoang trên phác thảo; chưa có vách ngăn, cửa, kích thước hoặc vị trí thiết bị được xác nhận.

### Tầng II

Hiên → phòng ngủ → cầu thang → phòng sinh hoạt → phòng ngủ.

### Tầng III

Khoảng sân phía trước (chữ trên ảnh cần xác nhận) → phòng thờ → cầu thang → sân thượng phía sau, có ghi máy giặt.

Các chấm vuông trên ảnh chưa được coi là vị trí/kích thước cột kết cấu đã xác nhận. Chưa có vị trí WC tầng trên, giếng trời, trục kỹ thuật, cửa, bề dày tường hay kích thước cầu thang.

## Số đo đọc từ sơ đồ hiện trạng

Xem `plans/kich-thuoc-doc-tu-anh.csv`. Các số đều ở trạng thái đọc từ ảnh, chờ chủ nhà xác nhận; không phải kết quả đo đạc mới.

- Tầng I: cạnh trên 3,44 m; dưới 5,32 m; phải 13,16 m.
- Trái có hai đoạn 7,62 m và 5,10 m, với điểm gãy được vẽ trên hình.
- Góc trên trái có hai đoạn ngắn ghi 1,06 m và 0,80 m.
- Tầng lửng: trên 5,27 m; dưới 5,32 m; hai bên 7,70 m.
- “262,00 m” đi cùng mũi tên ra đường chính là ghi chú đường đi, không dùng làm kích thước nhà/đất.

## Nguyên tắc dựng đúng tỉ lệ

1. Hình đất có các đoạn gãy, không thay bằng hình chữ nhật hoặc tự coi là hình thang vuông.
2. Độ dài các cạnh chưa đủ xác định duy nhất đa giác. Cần góc, đường chéo hoặc tọa độ mốc để khóa hình chính xác; ảnh xiên không bổ sung được các dữ kiện này một cách đáng tin cậy.
3. Hiên ở phía góc lõm theo xác nhận chủ nhà. Khi trình bày, có thể xoay toàn bộ sơ đồ để phía này nằm dưới trang; phải xoay đồng thời đường bao, kích thước và ghi chú đường kiệt, không làm mất đoạn lõm. Chưa chốt cửa chính nằm trên đoạn ngắn nào hoặc chiếm cả cạnh tiếp giáp.
4. Khi đủ dữ liệu, dùng mét làm đơn vị gốc; cùng một tỉ lệ theo hai trục, có đường kích thước và thước tỉ lệ. Không kéo giãn riêng chiều ngang/dọc để bố cục vừa trang.
5. Tỉ lệ in chỉ có ý nghĩa ở đúng khổ giấy, in 100%; hiển thị trên màn hình theo mức zoom không phải kích thước vật lý 1:1.
6. Phân biệt số đo ranh ngoài và kích thước thông thủy sau khi trừ tường. Chưa tự ấn định diện tích phòng hoặc khẳng định bố trí nội thất vừa.
7. Các giả định sẽ được ghi riêng, không biến thành số đo hiện trạng. Phác thảo công năng không phải hồ sơ kết cấu/thi công.

## Đang chờ xác nhận

- Các số đo và vị trí hai đoạn ngắn ở góc trên trái.
- Hiên đã chốt phía góc lõm; bề rộng cửa và quan hệ sử dụng với hai lối kiệt chưa chốt.
- Đường bao tầng I là ranh đất hay đường bao xây dựng hiện hữu.
- Hiện không có dữ liệu khóa góc/hình đất. Phương án đầu dùng hình bao gần đúng có ghi giả định, không gắn nhãn hình đất chính xác hoặc khẳng định diện tích pháp lý.
- Chữ ghi khoảng sân phía trước tầng III; nhu cầu WC tầng trên, lấy sáng và thông gió.


## Đường bao dựng bằng code — 14/11/2026

Theo yêu cầu chủ nhà, đã chuyển sang dựng mô hình demo trực tiếp từ hình trên ảnh, không chờ dữ liệu bổ sung.

- Chạy `node scripts/extract-plot.mjs` trong thư mục dự án.
- Chọn mốc ban đầu trên ảnh, code tìm nét tối gần đường biên, fit đường thẳng và giao điểm. Điểm gãy gần thẳng hàng E giữ mốc đã chọn để tránh khuếch đại sai lệch giao tuyến.
- Dùng bốn góc hình tầng lửng làm tham chiếu hiệu chỉnh phối cảnh; diễn giải hình này là hình thang cân, cạnh trên 5,27 m, dưới 5,32 m, hai bên 7,70 m. Đây là giả định hiệu chỉnh ảnh, không phải góc đo bổ sung.
- Từ hình đã hiệu chỉnh, giải các ràng buộc để khớp bảy chiều dài đã chép. Các góc chọn theo hình gần với ảnh ban đầu; không tự biến phần lõm thành góc vuông.
- Chiếu mô hình lại lên ảnh để đối chiếu: lệch đỉnh tối đa khoảng 3,2 px trên ảnh 960 × 1280 px. Đây là độ khớp hình ảnh, không phải sai số đo ngoài thực tế.
- Kết quả: `plans/plot-source-overlay.png`, `plans/plot-to-scale.svg`, `plans/plot-to-scale.png`, `plans/plot-geometry.json`.
- SVG khổ 210 × 235 mm, 1 m ứng với 10 mm trên giấy, tức tỉ lệ 1:100 khi in 100%. Góc và diện tích trong JSON là kết quả mô hình tái dựng, không phải thông số pháp lý được xác nhận.

## Bố trí đã sửa theo góc đứng từ sân nhìn vào — 14/11/2026

- Quy chiếu duy nhất: đứng trong sân nhìn vào nhà. Sofa phải, TV và thang trái. Không lật hình thửa đất.
- Cổng rộng khoảng 2,40 m trên cạnh trước 3,44 m; sân trước cửa kính tại z=2,60 m. Hai xe tham chiếu bao kích thước Lead ABS 1.844 × 714 × 1.132 mm.
- Trái/sau giáp hàng xóm, không mở cửa sổ trên các mặt này. Tầng một có hai cửa sổ phải và một cửa thoát bếp phải.
- Thay thang U bằng một vế thẳng rộng 1,00 m; 20 cổ bậc 165 mm, mặt bậc 270 mm, chiều chạy 5,13 m. WC dưới phần cao, lavabo/gương ngoài.
- Hai nệm giường đơn 1 × 2 m cuối tầng một; người tham chiếu cao 1,70 m.
- Các kích thước là mô hình ý tưởng, chưa phải hồ sơ thi công. Khoảng dưới thang, kết cấu và cửa thoát cần kiểm tra kỹ thuật khi phát triển tiếp.

## Chỉ đạo mới nhất — chỉ phòng khách

Bỏ cầu thang, không tự bố trí lại. Bản hiện tại chỉ hoàn thiện phòng khách minimalist: sofa phải, tủ TV trái, bàn trà và thảm cân đối, lối đi thoáng. Các khu phía sau để trống. Không dựng các tầng trên trong bản hiện tại. Mọi bố trí thang/WC/bếp/phòng ngủ trước đó được tạm dừng, chờ chỉ đạo tiếp theo.

## Chỉ đạo mới: thang chữ L phía TV

Vế đầu 3–4 bậc từ phải sang trái theo hướng đứng từ sân; sau đó rẽ đi lên tầng hai dọc tường trái về sau. Phương án dùng 4 cổ bậc đến chiếu nghỉ và 16 cổ bậc vế dài, rộng 950 mm. Giữ nguyên hiên 1,80 m thấp 300 mm, hai bậc cửa và phòng khách sofa L. Chưa bố trí lại bếp/WC/phòng ngủ hoặc tầng hai.

## Phương án thử mới nhất — sofa trái, bếp phải

Theo yêu cầu: đổi sofa sang trái, TV sang phải; bếp nấu/rửa bên phải rồi đến cửa thoát sau. Tủ phụ và tủ lạnh vẫn dưới thang trái. WC nhỏ chuyển về trái, lavabo ngoài; phòng ngủ hai giường bên phải. Giữ đường bao, hiên 1,80 m và chênh cốt 300 mm. Bản trước lưu tại revisions/before-right-kitchen.

## Chỉnh tủ và cửa mới nhất

Bỏ cửa sổ sau TV. Hệ tủ khít theo gầm thang, tủ lạnh hai cánh đứng được kéo về trước và đặt sâu hơn mặt tủ để thoáng sảnh WC. Lavabo ngoài thu nhỏ; WC giữ nhỏ. Cửa phòng ông bà chuyển sang vách bên trái, cùng mở vào sảnh WC; cửa thoát sát vách trước phòng ông bà hơn.

## Chỉ đạo mới nhất: nới sảnh, hai giường và một tủ

Bỏ một khoang tủ cao nhất sau tủ lạnh phía WC. Thu hẹp phần góc vào phòng ông bà 300 mm để nới sảnh; không làm WC lớn thêm. Hai giường đơn xoay ngang, đầu giường hướng cửa sổ bên phải. Tủ quần áo cánh trượt đặt sát vách chung với nhà vệ sinh, trong phần lõm bên trái phòng; tường phía trước vẫn thẳng. Bỏ tủ đầu giường cũ.

## Cập nhật vách cạnh tủ lạnh và tủ phòng ông bà

Bỏ toàn bộ khoang tủ cao phía sau tủ lạnh hướng WC, chỉ giữ vách kết thúc dày 25 mm. Tủ quần áo sát vách chung WC kéo dài từ 1,30 lên 1,90 m (z=11,20–13,10 m), chừa khe lắp đặt hai đầu; không đổi vị trí giường hoặc cửa. Ảnh: `evidence/36-fridge-panel-long-wardrobe.png`.

Lavabo ngoài WC và gương cùng dịch 330 mm về phía khoảng trống cạnh tủ lạnh (tâm z=10,55 m). Mép gương cách vách WC khoảng 270 mm, không còn chạm vách; mép lavabo cách vách kết thúc tủ khoảng 534 mm. Ảnh: `evidence/37-basin-mirror-spacing.png`.

## Thử tăng hiên thêm nửa mét

Dời cửa kính và hai bậc vào trong 500 mm: hiên sâu 2,30 m, phòng khách giảm chiều sâu 500 mm. Giữ nguyên cầu thang và các khu phía sau. Thu gọn mảng ốp sau TV để không vượt ra hiên, dịch đèn sàn và bàn trà nhẹ vào trong.

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
