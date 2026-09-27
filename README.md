# List3D

Cổng tra cứu các công ty, nền tảng và website liên quan đến **3D / 360 / Tour ảo / VR-AR / Digital Twin / Reality Capture**.

## Dữ liệu hiện tại

- 152 đơn vị
- 50 đơn vị tại Việt Nam
- 102 đơn vị quốc tế

## Chức năng

- Tìm kiếm tức thời theo tên, quốc gia và mô tả dịch vụ
- Lọc Việt Nam / Quốc tế
- Sắp xếp theo tên A→Z, Z→A và quốc gia
- Giao diện responsive cho desktop/mobile
- Không cần backend, database hay API
- Có thể chạy trực tiếp bằng GitHub Pages

## Cấu trúc

```text
list3D/
├── index.html
├── README.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Cập nhật dữ liệu

Dữ liệu đang được nhúng trong `index.html` qua hai mảng:

- `vnCompanies`
- `intCompanies`

Mỗi bản ghi có dạng:

```js
{
  name: "Tên đơn vị",
  country: "Quốc gia",
  region: "vn",
  services: "Mô tả dịch vụ",
  url: "https://example.com"
}
```

Sau khi cập nhật và push lên `main`, workflow GitHub Pages sẽ tự chạy.

> Dữ liệu mang tính tham khảo. Nên kiểm chứng website và thông tin doanh nghiệp trước khi sử dụng cho mục đích chính thức.
