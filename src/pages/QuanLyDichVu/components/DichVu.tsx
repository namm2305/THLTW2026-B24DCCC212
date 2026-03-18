import { useEffect, useState } from 'react';
import { Input, Button, Table, Card, Space, Row, Col, InputNumber, Statistic, Empty } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

export function DichVu() {
  const [data, setData] = useState<any[]>([]);
  const [ten, setTen] = useState('');
  const [gia, setGia] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('dichvu');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('dichvu', JSON.stringify(data));
  }, [data]);

  const add = () => {
    if (!ten.trim() || !gia) return;
    setData([...data, { id: Date.now(), ten, gia }]);
    setTen(''); 
    setGia('');
  };

  const del = (id: number) => {
    setData(data.filter(i => i.id !== id));
  };

  const filtered = data.filter(i =>
    i.ten.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card 
        title="Tìm kiếm dịch vụ" 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        <Input 
          placeholder=" Tìm kiếm theo tên dịch vụ..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="large"
          style={{ borderRadius: 4 }}
        />
      </Card>

      <Card 
        title="Thêm dịch vụ mới" 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tên dịch vụ"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              onPressEnter={add}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <InputNumber
              placeholder="Giá (đồng)"
              formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              value={gia ? parseInt(gia) : null}
              onChange={(val) => setGia(val ? val.toString() : '')}
              style={{ width: '100%' }}
              size="large"
            />
          </Col>
          <Col xs={24} md={8}>
            <Button type="primary" block size="large" onClick={add}>
              Thêm dịch vụ
            </Button>
          </Col>
        </Row>
      </Card>

      <Card 
        title={`Danh sách dịch vụ (${filtered.length})`} 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        {filtered.length > 0 ? (
          <Table
            rowKey='id'
            dataSource={filtered}
            pagination={{ pageSize: 8 }}
            columns={[
              {
                title: 'Tên dịch vụ',
                dataIndex: 'ten',
                key: 'ten',
                width: '60%'
              },
              {
                title: 'Giá',
                dataIndex: 'gia',
                key: 'gia',
                width: '20%',
                render: (gia: string) => `₫ ${gia}`
              },
              {
                title: 'Hành động',
                key: 'action',
                width: '20%',
                render: (r: any) => (
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => del(r.id)}
                  >
                    Xóa
                  </Button>
                )
              }
            ]}
          />
        ) : (
          <Empty description="Không có dịch vụ" />
        )}
      </Card>
    </Space>
  );
}