import { useEffect, useState } from 'react';
import { DatePicker, Select, Button, Table, Card, Space, Row, Col, Tag, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export function LichHen() {
  const [data, setData] = useState<any[]>([]);
  const [time, setTime] = useState<any>();
  const [nv, setNv] = useState('');
  const [dv, setDv] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('lich');
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('lich', JSON.stringify(data));
  }, [data]);

  // Load employees from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nhanvien');
    if (saved) {
      const empList = JSON.parse(saved);
      setEmployees(empList.map((e: any) => ({
        value: e.id,
        label: e.ten
      })));
    }
  }, []);

  // Load services from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dichvu');
    if (saved) {
      const svcList = JSON.parse(saved);
      setServices(svcList.map((s: any) => ({
        value: s.id,
        label: s.ten
      })));
    }
  }, []);

  const add = () => {
    if (!nv || !dv || !time) {
      message.warning('Vui lòng chọn nhân viên, dịch vụ và thời gian!');
      return;
    }

    // Get employee name and service name
    const empName = employees.find(e => e.value === nv)?.label || 'N/A';
    const svcName = services.find(s => s.value === dv)?.label || 'N/A';

    const trung = data.some(
      i => i.nhanVienId === nv && dayjs(i.time).isSame(time, 'minute')
    );

    if (trung) {
      message.error('Trùng lịch!');
      return;
    }

    setData([...data, {
      id: Date.now(),
      nhanVienId: nv,
      nhanVien: empName,
      dichVuId: dv,
      dichVu: svcName,
      time,
      status: 'Chờ'
    }]);

    message.success('Đặt lịch thành công!');
    setNv('');
    setDv('');
    setTime(null);
  };

  const del = (id: number) => {
    setData(data.filter(item => item.id !== id));
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Đặt lịch hẹn" style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <DatePicker 
              showTime 
              placeholder="Chọn thời gian"
              value={time}
              onChange={(v) => setTime(v)} 
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn nhân viên"
              style={{ width: '100%' }}
              value={nv}
              onChange={setNv}
              options={employees}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Chọn dịch vụ"
              style={{ width: '100%' }}
              value={dv}
              onChange={setDv}
              options={services}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" block size="large" onClick={add}>Đặt lịch</Button>
          </Col>
        </Row>
      </Card>

      <Card title={`Danh sách lịch hẹn (${data.length})`} style={{ borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
        <Table
          rowKey="id"
          dataSource={data}
          pagination={{ pageSize: 8 }}
          columns={[
            { title: 'Nhân viên', dataIndex: 'nhanVien', key: 'nhanVien', width: '20%' },
            { title: 'Dịch vụ', dataIndex: 'dichVu', key: 'dichVu', width: '20%' },
            {
              title: 'Thời gian',
              key: 'time',
              width: '25%',
              render: (r: any) => dayjs(r.time).format('DD/MM/YYYY HH:mm')
            },
            {
              title: 'Trạng thái',
              key: 'status',
              width: '15%',
              render: (_, r: any) => (
                <Tag color={r.status === 'Chờ' ? 'processing' : 'success'}>
                  {r.status}
                </Tag>
              )
            },
            {
              title: 'Hành động',
              key: 'action',
              width: '10%',
              render: (_, record: any) => (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    del(record.id);
                    message.success('Xóa lịch thành công');
                  }}
                >
                  Xóa
                </Button>
              )
            }
          ]}
        />
      </Card>
    </Space>
  );
}