import { useState, useEffect } from 'react';
import { Input, Button, Table, Space, Card, Row, Col, Statistic, Empty } from 'antd';
import { DeleteOutlined, UserAddOutlined, TeamOutlined } from '@ant-design/icons';
import { message } from 'antd';

export function NhanVien() {
  const [data, setData] = useState<any[]>([]);
  const [ten, setTen] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('nhanvien');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('nhanvien', JSON.stringify(data));
  }, [data]);

  const add = () => {
    if (!ten.trim()) {
      message.warning('Vui lòng nhập tên nhân viên');
      return;
    }
    setData([...data, { id: Date.now(), ten }]);
    setTen('');
    message.success('Thêm nhân viên thành công');
  };

  const del = (id: number) => {
    setData(data.filter(item => item.id !== id));
    message.success('Xóa nhân viên thành công');
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card 
        title="Quản lý nhân viên" 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        <Row gutter={24}>
          <Col xs={24} sm={12}>
            <Statistic
              title="Tổng nhân viên"
              value={data.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
        </Row>
      </Card>

      <Card 
        title="Thêm nhân viên mới" 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={16}>
            <Input
              placeholder="Nhập tên nhân viên"
              prefix={<UserAddOutlined />}
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              onPressEnter={add}
              size="large"
            />
          </Col>
          <Col xs={24} sm={8}>
            <Button type="primary" block size="large" onClick={add}>
              Thêm
            </Button>
          </Col>
        </Row>
      </Card>

      <Card 
        title={`Danh sách nhân viên (${data.length})`} 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        {data.length > 0 ? (
          <Table
            rowKey="id"
            dataSource={data}
            pagination={{ pageSize: 10 }}
            columns={[
              { 
                title: "Tên nhân viên", 
                dataIndex: "ten", 
                key: "ten",
                width: '80%'
              },
              {
                title: "Hành động",
                key: "action",
                width: '20%',
                render: (_, record: any) => (
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => del(record.id)}
                  >
                    Xóa
                  </Button>
                )
              }
            ]}
          />
        ) : (
          <Empty description="Không có nhân viên" />
        )}
      </Card>
    </Space>
  );
}