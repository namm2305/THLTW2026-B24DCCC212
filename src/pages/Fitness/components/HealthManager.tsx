import { Table, Button, Modal, Form, DatePicker, Popconfirm, Space, Tag, InputNumber, Card, Row, Col, Statistic } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const getBMICategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: 'Thiểu cân', color: 'blue' };
  if (bmi < 25) return { label: 'Bình thường', color: 'green' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'gold' };
  return { label: 'Béo phì', color: 'red' };
};

const calculateBMI = (weight: number, height: number): number => {
  if (!weight || !height) return 0;
  return weight / ((height / 100) ** 2);
};

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const healthLogs = JSON.parse(localStorage.getItem('healthLogs') || '[]');
    setData(healthLogs);
    setFilteredData(healthLogs);
  }, []);

  const save = (d: any[]) => {
    setData(d);
    localStorage.setItem('healthLogs', JSON.stringify(d));
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = (key: number) => {
    save(data.filter((item: any) => item.key !== key));
  };

  const onFinish = (values: any) => {
    const bmi = calculateBMI(values.weight, values.height);
    const healthData = {
      ...values,
      bmi: bmi.toFixed(1),
      date: values.date ? values.date.format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    };

    if (editingRecord) {
      const newData = data.map((item: any) => 
        item.key === editingRecord.key ? { ...item, ...healthData } : item
      );
      save(newData);
    } else {
      const newData = [
        ...data,
        {
          ...healthData,
          key: Date.now()
        }
      ];
      save(newData);
    }
    
    setOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      sorter: (a: any, b: any) => moment(a.date).diff(moment(b.date)),
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      sorter: (a: any, b: any) => a.weight - b.weight,
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      sorter: (a: any, b: any) => a.height - b.height,
    },
    {
      title: 'BMI',
      dataIndex: 'bmi',
      sorter: (a: any, b: any) => parseFloat(a.bmi) - parseFloat(b.bmi),
      render: (bmi: string) => {
        const bmiValue = parseFloat(bmi);
        const category = getBMICategory(bmiValue);
        return (
          <Space>
            <span>{bmi}</span>
            <Tag color={category.color}>{category.label}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Nhịp tim lúc nghỉ (bpm)',
      dataIndex: 'heartRate',
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      render: (hours: number) => hours ? `${hours} giờ` : '-',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chỉ số này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Calculate average stats
  const avgBMI = data.length > 0 
    ? (data.reduce((sum: number, item: any) => sum + parseFloat(item.bmi || 0), 0) / data.length).toFixed(1)
    : 0;
  
  const avgHeartRate = data.length > 0
    ? Math.round(data.reduce((sum: number, item: any) => sum + (item.heartRate || 0), 0) / data.length)
    : 0;

  const avgSleep = data.length > 0
    ? (data.reduce((sum: number, item: any) => sum + (item.sleepHours || 0), 0) / data.length).toFixed(1)
    : 0;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="BMI trung bình" value={avgBMI} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Nhịp tim TB" value={avgHeartRate} suffix="bpm" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Giờ ngủ TB" value={avgSleep} suffix="giờ" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Số lần đo" value={data.length} />
          </Card>
        </Col>
      </Row>

      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm chỉ số
      </Button>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="key"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRecord ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={editingRecord || { date: moment() }}
        >
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.1} style={{ width: '100%' }} placeholder="Nhập cân nặng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập chiều cao" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="heartRate" label="Nhịp tim lúc nghỉ (bpm)">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập nhịp tim" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sleepHours" label="Giờ ngủ">
                <InputNumber min={0} max={24} step={0.5} style={{ width: '100%' }} placeholder="Nhập giờ ngủ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};