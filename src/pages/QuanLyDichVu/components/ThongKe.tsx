import { Card, Row, Col, Statistic, Space, Divider, Tag } from 'antd';
import { ShoppingOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';

export function ThongKe() {
  const dv = JSON.parse(localStorage.getItem('dichvu') || '[]');
  const nv = JSON.parse(localStorage.getItem('nhanvien') || '[]');
  const lich = JSON.parse(localStorage.getItem('lich') || '[]');
  const danhgia = JSON.parse(localStorage.getItem('danhgia') || '[]');

  const avgRating = danhgia.length > 0 ? (danhgia.reduce((a: any, b: any) => a + b.star, 0) / danhgia.length).toFixed(1) : '0';

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card 
        title="Thống kê tổng quan" 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: 6, border: '1px solid #1890ff20', background: '#1890ff08', textAlign: 'center' }}>
              <Statistic
                title="Dịch vụ"
                value={dv.length}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: 6, border: '1px solid #52c41a20', background: '#52c41a08', textAlign: 'center' }}>
              <Statistic
                title="Nhân viên"
                value={nv.length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: 6, border: '1px solid #faad1420', background: '#faad1408', textAlign: 'center' }}>
              <Statistic
                title="Lịch hẹn"
                value={lich.length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card style={{ borderRadius: 6, border: '1px solid #eb2f9620', background: '#eb2f9608', textAlign: 'center' }}>
              <Statistic
                title="Đánh giá nhân viên"
                value={avgRating}
                suffix="⭐"
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card 
        title="Tổng hợp" 
        style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Tag color="blue">Tổng cộng {dv.length + nv.length + lich.length} mục dữ liệu đã tạo</Tag>
          </div>
          <div>
            <Tag color="green">Hệ thống hoạt động bình thường</Tag>
          </div>
          <div>
            <Tag color="cyan">Mức độ hài lòng: {avgRating}/5 từ {danhgia.length} khách hàng</Tag>
          </div>
        </Space>
      </Card>
    </Space>
  );
}