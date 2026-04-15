import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Form, message } from 'antd';
import type { Phong } from './types';
import ApplicationTable from './ApplicationTable';
import MemberTable from './MemberTable';

const { Option } = Select;

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Phong[]>([]);
  const [editing, setEditing] = useState<Phong | null>(null);
  const [form] = Form.useForm();

  const [search, setSearch] = useState('');
  const [loai, setLoai] = useState('');
  const [nguoi, setNguoi] = useState('');
  const [asc, setAsc] = useState(true);


  useEffect(() => {
    const saved = localStorage.getItem('phongHoc');
    if (saved) setData(JSON.parse(saved));
  }, []);

  // 🔥 Lưu dữ liệu
  useEffect(() => {
    localStorage.setItem('phongHoc', JSON.stringify(data));
  }, [data]);

  const handleSubmit = (values: Phong) => {
    const exist = data.find(d => d.ma === values.ma && d !== editing);
    if (exist) {
      message.error('Mã bị trùng');
      return;
    }

    if (editing) {
      setData(prev => prev.map(d => (d === editing ? values : d)));
      setEditing(null);
    } else {
      setData(prev => [...prev, values]);
    }

    form.resetFields();
  };

  const filtered = data
    .filter(d =>
      (d.ma + d.ten).toLowerCase().includes(search.toLowerCase()) &&
      (!loai || d.loai === loai) &&
      (!nguoi || d.nguoi === nguoi)
    )
    .sort((a, b) => (asc ? a.so - b.so : b.so - a.so));

  return (
    <div style={{ padding: '20px' }}>
      <h2>Quản Lý Phòng Học</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Thêm/Chỉnh Sửa Phòng Học</h3>
        <MemberTable onSubmit={handleSubmit} form={form} editing={editing} />
      </div>

      <div>
        <h3>Danh Sách Phòng Học</h3>

        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Input
            placeholder="Tìm kiếm mã/tên phòng"
            onChange={e => setSearch(e.target.value)}
            style={{ width: '200px' }}
          />
          <Select
            placeholder="Lọc theo loại"
            onChange={setLoai}
            allowClear
            style={{ width: '150px' }}
          >
            <Option value="Lý thuyết">Lý thuyết</Option>
            <Option value="Thực hành">Thực hành</Option>
            <Option value="Hội trường">Hội trường</Option>
          </Select>
          <Select
            placeholder="Lọc theo người phụ trách"
            onChange={setNguoi}
            allowClear
            style={{ width: '180px' }}
          >
            <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
            <Option value="Trần Thị B">Trần Thị B</Option>
            <Option value="Lê Văn C">Lê Văn C</Option>
          </Select>
          <Button onClick={() => setAsc(!asc)} style={{ width: '120px' }}>
            {asc ? 'Sắp xếp ↑' : 'Sắp xếp ↓'}
          </Button>
        </div>

        <ApplicationTable
          data={filtered}
          onEdit={(p) => {
            setEditing(p);
            form.setFieldsValue(p);
          }}
          onDelete={(p) =>
            setData(prev => prev.filter(d => d !== p))
          }
        />
      </div>
    </div>
  );
};

export default Dashboard;