import { useState, useEffect } from 'react';
import { Rate, Input, Button, Table, Space, Tag, Card, Row, Col, Statistic, Empty } from 'antd';
import { StarOutlined } from '@ant-design/icons';

export function DanhGia() {
  const [list, setList] = useState<any[]>([]);
  const [star, setStar] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('danhgia');
    if (saved) setList(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('danhgia', JSON.stringify(list));
  }, [list]);

  const add = () => {
    if (!text.trim() || star === 0) return;
    setList([...list, { 
      id: Date.now(),
      star, 
      text,
      date: new Date().toLocaleDateString('vi-VN')
    }]);
    setText('');
    setStar(0);
  };

  const avg = list.length > 0
    ? list.reduce((a, b) => a + b.star, 0) / list.length
    : 0;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Đánh giá dịch vụ" style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12}>
            <Statistic
              title="Đánh giá trung bình"
              value={avg.toFixed(1)}
              suffix="/ 5"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14', fontSize: 32 }}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Statistic
              title="Tổng số đánh giá"
              value={list.length}
              valueStyle={{ color: '#1890ff', fontSize: 32 }}
            />
          </Col>
        </Row>
      </Card>

      <Card title="Gửi đánh giá mới" style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Mức độ hài lòng</label>
            <Rate value={star} onChange={setStar} style={{ fontSize: 24 }} />
          </div>
          <Input.TextArea
            placeholder="Chia sẻ ý kiến của bạn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            showCount
            maxLength={500}
          />
          <Button type="primary" block size="large" onClick={add}>Gửi đánh giá</Button>
        </Space>
      </Card>

      {list.length > 0 ? (
        <Card title={`Các đánh giá từ khách hàng (${list.length})`} style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Table
            rowKey="id"
            dataSource={list}
            pagination={{ pageSize: 8, position: ['bottomCenter'] }}
            columns={[
              {
                title: "Đánh giá",
                dataIndex: "star",
                key: "star",
                width: 100,
                render: (star: number) => (
                  <Tag color={star >= 4 ? 'green' : star >= 3 ? 'orange' : 'red'}>
                    {star} ⭐
                  </Tag>
                )
              },
              {
                title: "Nội dung",
                dataIndex: "text",
                key: "text"
              },
              {
                title: "Ngày",
                dataIndex: "date",
                key: "date",
                width: 120
              }
            ]}
          />
        </Card>
      ) : null}
    </Space>
  );
}