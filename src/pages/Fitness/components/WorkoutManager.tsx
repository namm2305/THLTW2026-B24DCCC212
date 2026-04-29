import { Table, Button, Modal, Form, Input, Select, DatePicker, Popconfirm, Space, InputNumber, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    setData(workouts);
    setFilteredData(workouts);
  }, []);

  useEffect(() => {
    let result = [...data];
    
    // Search filter
    if (searchText) {
      result = result.filter((item: any) => 
        item.type?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.note?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // Type filter
    if (typeFilter) {
      result = result.filter((item: any) => item.type === typeFilter);
    }
    
    // Date range filter
    if (dateRange) {
      result = result.filter((item: any) => {
        const itemDate = moment(item.date);
        return itemDate.isBetween(dateRange[0], dateRange[1], null, '[]');
      });
    }
    
    setFilteredData(result);
  }, [searchText, typeFilter, dateRange, data]);

  const save = (d: any[]) => {
    setData(d);
    localStorage.setItem('workouts', JSON.stringify(d));
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
      date: moment(record.date)
    });
    setOpen(true);
  };

  const handleDelete = (key: number) => {
    save(data.filter((item: any) => item.key !== key));
  };

  const onFinish = (values: any) => {
    const workoutData = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };

    if (editingRecord) {
      // Update existing
      const newData = data.map((item: any) => 
        item.key === editingRecord.key ? { ...item, ...workoutData } : item
      );
      save(newData);
    } else {
      // Add new
      const newData = [
        ...data,
        {
          ...workoutData,
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
      title: 'Loại bài tập',
      dataIndex: 'type',
      filters: [
        { text: 'Cardio', value: 'Cardio' },
        { text: 'Yoga', value: 'Yoga' },
        { text: 'HIIT', value: 'HIIT' },
        { text: 'Gym', value: 'Gym' },
        { text: 'Other', value: 'Other' },
      ],
      onFilter: (value: any, record: any) => record.type === value,
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      sorter: (a: any, b: any) => a.duration - b.duration,
    },
    {
      title: 'Calo',
      dataIndex: 'calo',
      sorter: (a: any, b: any) => a.calo - b.calo,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: string) => {
        let color = 'default';
        if (status === 'Hoàn thành') color = 'green';
        else if (status === 'Bỏ lỡ') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
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
            title="Bạn có chắc chắn muốn xóa buổi tập này?"
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

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên bài tập..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo loại"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setTypeFilter(value)}
            options={[
              { value: 'Cardio', label: 'Cardio' },
              { value: 'Yoga', label: 'Yoga' },
              { value: 'HIIT', label: 'HIIT' },
              { value: 'Gym', label: 'Gym' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <RangePicker
            onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment] | null)}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Space>
      </Space>

      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Thêm buổi tập
      </Button>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="key"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRecord ? 'Sửa buổi tập' : 'Thêm buổi tập mới'}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={editingRecord || { status: 'Hoàn thành' }}
        >
          <Form.Item
            name="date"
            label="Ngày tập"
            rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại bài tập"
            rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}
          >
            <Select
              options={[
                { value: 'Cardio', label: 'Cardio' },
                { value: 'Yoga', label: 'Yoga' },
                { value: 'HIIT', label: 'HIIT' },
                { value: 'Gym', label: 'Gym' },
                { value: 'Other', label: 'Other' },
              ]}
              placeholder="Chọn loại bài tập"
            />
          </Form.Item>

          <Form.Item name="duration" label="Thời lượng (phút)">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập thời lượng" />
          </Form.Item>

          <Form.Item name="calo" label="Calo">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số calo" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select
              options={[
                { value: 'Hoàn thành', label: 'Hoàn thành' },
                { value: 'Bỏ lỡ', label: 'Bỏ lỡ' },
              ]}
            />
          </Form.Item>

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