import { useState, useEffect } from 'react';
import { Rate, Input, Button, Table, Space, Tag, Card, Row, Col, Statistic, Empty, Select } from 'antd';
import { StarOutlined, DeleteOutlined } from '@ant-design/icons';

export function DanhGia() {
  const [list, setList] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [star, setStar] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('danhgia');
    if (saved) setList(JSON.parse(saved));
    
    const nvSaved = localStorage.getItem('nhanvien');
    if (nvSaved) setEmployees(JSON.parse(nvSaved));
  }, []);

  useEffect(() => {
    localStorage.setItem('danhgia', JSON.stringify(list));
  }, [list]);

  const add = () => {
    if (!selectedEmployee) {
      alert('Vui lòng chọn nhân viên');
      return;
    }
    if (!text.trim() || star === 0) {
      alert('Vui lòng nhập đánh giá và chọn số sao');
      return;
    }

    const employee = employees.find(e => String(e.id) === selectedEmployee);
    
    setList([...list, { 
      id: Date.now(),
      employeeId: selectedEmployee,
      employeeName: employee?.ten || 'Không xác định',
      star, 
      text,
      date: new Date().toLocaleDateString('vi-VN')
    }]);
    setText('');
    setStar(0);
    setSelectedEmployee('');
  };

  const avg = list.length > 0
    ? list.reduce((a, b) => a + b.star, 0) / list.length
    : 0;

  // Tính toán đánh giá trung bình theo từng nhân viên
  const employeeStats = employees.map(emp => {
    const empRatings = list.filter(r => String(r.employeeId) === String(emp.id));
    const empAvg = empRatings.length > 0
      ? empRatings.reduce((a, b) => a + b.star, 0) / empRatings.length
      : 0;
    return {
      id: emp.id,
      ten: emp.ten,
      avg: empAvg.toFixed(1),
      count: empRatings.length
    };
  }).filter(e => e.count > 0);

  const del = (id: number) => {
    setList(list.filter(i => i.id !== id));
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Đánh giá nhân viên" style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
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

      {employeeStats.length > 0 && (
        <Card title={`Đánh giá từng nhân viên (${employeeStats.length})`} style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Table
            rowKey="id"
            dataSource={employeeStats}
            pagination={false}
            columns={[
              {
                title: "Tên nhân viên",
                dataIndex: "ten",
                key: "ten"
              },
              {
                title: "Đánh giá TB",
                dataIndex: "avg",
                key: "avg",
                width: 150,
                render: (avg: string) => (
                  <Tag color={parseFloat(avg) >= 4 ? 'green' : parseFloat(avg) >= 3 ? 'orange' : 'red'}>
                    {avg} ⭐
                  </Tag>
                )
              },
              {
                title: "Số lần đánh giá",
                dataIndex: "count",
                key: "count",
                width: 150
              }
            ]}
          />
        </Card>
      )}

      <Card title="Gửi đánh giá nhân viên mới" style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Chọn nhân viên</label>
            <Select
              placeholder="Chọn nhân viên cần đánh giá"
              style={{ width: '100%' }}
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              options={employees.map(emp => ({
                label: emp.ten,
                value: String(emp.id)
              }))}
            />
          </div>
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
        <Card title={`Các đánh giá nhân viên (${list.length})`} style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <Table
            rowKey="id"
            dataSource={list}
            pagination={{ pageSize: 8, position: ['bottomCenter'] }}
            columns={[
              {
                title: "Nhân viên",
                dataIndex: "employeeName",
                key: "employeeName",
                width: 150
              },
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
              },
              {
                title: "Hành động",
                key: "action",
                width: 80,
                render: (_, record: any) => (
                  <Button 
                    type="text" 
                    danger 
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => del(record.id)}
                  />
                )
              }
            ]}
          />
        </Card>
      ) : null}
    </Space>
  );
}