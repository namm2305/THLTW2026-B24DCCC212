import { Card, Button, Form, Input, Select, DatePicker, Popconfirm, Space, InputNumber, Progress, Row, Col, Segmented, Drawer, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined, StopOutlined } from '@ant-design/icons';
import moment from 'moment';

type GoalType = 'Giảm cân' | 'Tăng cơ' | 'Cải thiện sức bền' | 'Khác';
type GoalStatus = 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';

const statusOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đang thực hiện', value: 'Đang thực hiện' },
  { label: 'Đã đạt', value: 'Đã đạt' },
  { label: 'Đã hủy', value: 'Đã hủy' },
];

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form] = Form.useForm();

  useEffect(() => {
    const goals = JSON.parse(localStorage.getItem('goals') || '[]');
    setData(goals);
    setFilteredData(goals);
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item: any) => item.status === statusFilter));
    }
  }, [statusFilter, data]);

  const save = (d: any[]) => {
    setData(d);
    localStorage.setItem('goals', JSON.stringify(d));
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      deadline: record.deadline ? moment(record.deadline) : null
    });
    setOpen(true);
  };

  const handleDelete = (key: number) => {
    save(data.filter((item: any) => item.key !== key));
  };

  const handleUpdateCurrentValue = (key: number, newValue: number) => {
    const newData = data.map((item: any) => {
      if (item.key === key) {
        const progress = Math.min(100, Math.round((newValue / item.targetValue) * 100));
        const newStatus = progress >= 100 ? 'Đã đạt' : item.status;
        return { ...item, currentValue: newValue, progress, status: newStatus };
      }
      return item;
    });
    save(newData);
  };

  const onFinish = (values: any) => {
    const progress = Math.min(100, Math.round(((values.currentValue || 0) / values.targetValue) * 100));
    const goalData = {
      ...values,
      deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : null,
      progress,
      status: values.status || 'Đang thực hiện',
    };

    if (editingRecord) {
      const newData = data.map((item: any) => 
        item.key === editingRecord.key ? { ...item, ...goalData } : item
      );
      save(newData);
    } else {
      const newData = [
        ...data,
        {
          ...goalData,
          key: Date.now()
        }
      ];
      save(newData);
    }
    
    setOpen(false);
    form.resetFields();
  };

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'Đã đạt':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Đã hủy':
        return <StopOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusColor = (status: GoalStatus): string => {
    switch (status) {
      case 'Đã đạt':
        return '#52c41a';
      case 'Đã hủy':
        return '#ff4d4f';
      default:
        return '#1890ff';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Segmented
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as string)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mục tiêu
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {filteredData.map((goal: any) => (
          <Col key={goal.key} xs={24} sm={12} md={8}>
            <Card
              actions={[
                <EditOutlined key="edit" onClick={() => handleEdit(goal)} />,
                <Popconfirm
                  key="delete"
                  title="Bạn có chắc chắn muốn xóa mục tiêu này?"
                  onConfirm={() => handleDelete(goal.key)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <DeleteOutlined />
                </Popconfirm>
              ]}
            >
              <Card.Meta
                avatar={getStatusIcon(goal.status)}
                title={goal.name}
                description={
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Tag color="blue">{goal.type}</Tag>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 'bold' }}>Mục tiêu: </span>
                      {goal.targetValue} {goal.unit}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: 'bold' }}>Hiện tại: </span>
                      <InputNumber
                        size="small"
                        value={goal.currentValue}
                        onChange={(value) => handleUpdateCurrentValue(goal.key, value || 0)}
                        style={{ width: 80, marginLeft: 4 }}
                        min={0}
                      />
                      {' '}{goal.unit}
                    </div>
                    <Progress 
                      percent={goal.progress} 
                      status={goal.status === 'Đã đạt' ? 'success' : goal.status === 'Đã hủy' ? 'exception' : 'active'}
                      strokeColor={getStatusColor(goal.status)}
                    />
                    {goal.deadline && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                        Deadline: {goal.deadline}
                      </div>
                    )}
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Drawer
        title={editingRecord ? 'Sửa mục tiêu' : 'Thêm mục tiêu mới'}
        width={500}
        onClose={() => setOpen(false)}
        visible={open}
        extra={
          <Space>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {editingRecord ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: 'Đang thực hiện',
            currentValue: 0,
            type: 'Giảm cân',
          }}
        >
          <Form.Item
            name="name"
            label="Tên mục tiêu"
            rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}
          >
            <Input placeholder="Nhập tên mục tiêu" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 'Giảm cân', label: 'Giảm cân' },
                { value: 'Tăng cơ', label: 'Tăng cơ' },
                { value: 'Cải thiện sức bền', label: 'Cải thiện sức bền' },
                { value: 'Khác', label: 'Khác' },
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="targetValue"
                label="Giá trị mục tiêu"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập giá trị mục tiêu" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="unit" label="Đơn vị">
                <Input placeholder="kg, calo, ..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="currentValue" label="Giá trị hiện tại">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập giá trị hiện tại" />
          </Form.Item>

          <Form.Item name="deadline" label="Deadline">
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="Chọn ngày deadline" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select
              options={[
                { value: 'Đang thực hiện', label: 'Đang thực hiện' },
                { value: 'Đã đạt', label: 'Đã đạt' },
                { value: 'Đã hủy', label: 'Đã hủy' },
              ]}
            />
          </Form.Item>
          <Form.Item style={{ marginTop: 24 }}>
  <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Button onClick={() => setOpen(false)}>
      Hủy
    </Button>
    <Button type="primary" htmlType="submit">
      {editingRecord ? 'Cập nhật' : 'Xác nhận'}
    </Button>
  </Space>
</Form.Item>    
        </Form>
      </Drawer>
    </div>
  );
};