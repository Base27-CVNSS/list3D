# List3D — Global Spatial Technology Directory

**Live:** https://base27-cvnss.github.io/list3D/

List3D là cổng tra cứu có cấu trúc về hệ sinh thái **3D Scan / 360 / VR / AR / Digital Twin / BIM / LiDAR / Photogrammetry / GIS**.

## Trạng thái dữ liệu

- **300 thực thể**
- **152 mục kế thừa** từ danh sách ban đầu
- **148 mục mở rộng** theo các nhóm công nghệ không gian
- Dữ liệu chính: `data/companies.json`
- Ngày chuẩn hóa: **2026-09-27**

## Taxonomy

```text
3D Scan
360
VR
AR
Digital Twin
BIM
LiDAR
Photogrammetry
GIS
3D / Visualization
```

Một thực thể có thể thuộc nhiều taxonomy cùng lúc.

## Chức năng web

- Full-text search theo tên, quốc gia, mô tả và taxonomy
- Lọc Việt Nam / Quốc tế
- Lọc theo 9 nhóm công nghệ lõi
- Lọc theo loại thực thể: company / vendor / software / platform
- Sắp xếp tên và quốc gia
- Phân trang 24 mục/trang
- Responsive desktop/mobile
- Dữ liệu tách khỏi UI, dễ cập nhật và tái sử dụng
- Deploy tự động qua GitHub Actions + GitHub Pages

## Cấu trúc

```text
list3D/
├── index.html
├── assets/
│   ├── app.js
│   └── style.css
├── data/
│   └── companies.json
├── README.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Schema bản ghi

```json
{
  "id": "list3d-001",
  "name": "Tên thực thể",
  "canonical_name": "Tên chuẩn",
  "country": "Quốc gia",
  "region": "vn | int",
  "entity_type": "company | vendor | software | platform",
  "categories": ["3D Scan", "LiDAR"],
  "services": "Mô tả ngắn",
  "url": "https://example.com",
  "source_group": "legacy-152 | curated-2026-09",
  "verified": false
}
```

## Nguyên tắc dữ liệu

Danh bạ ưu tiên **tính tra cứu và khả năng mở rộng**. Trường `verified` được giữ riêng để sau này có thể triển khai quy trình QA/QC từng URL, pháp nhân, sản phẩm và năng lực kỹ thuật mà không làm thay đổi schema.

> Việc xuất hiện trong List3D không phải là chứng nhận, xếp hạng hay khuyến nghị thương mại. Người dùng nên kiểm chứng thông tin tại website chính thức trước khi sử dụng cho quyết định chuyên môn hoặc mua sắm.
