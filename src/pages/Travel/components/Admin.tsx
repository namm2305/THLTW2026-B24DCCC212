import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Divider, Form, Input, InputNumber, message, Row, Select, Space, Statistic, Table, Tag, Typography } from 'antd';
import { getItinerary, getPlaces, savePlaces, TravelPlace } from '../services/travelService';

const { Option } = Select;

export default function Admin() {
  const [places, setPlaces] = useState<TravelPlace[]>([]);
  const [editingPlace, setEditingPlace] = useState<TravelPlace | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setPlaces(getPlaces());
  }, []);

  const itineraries = useMemo(() => getItinerary(), []);

  const stats = useMemo(() => {
    const popular = itineraries.reduce<Record<string, number>>((acc, item) => {
      acc[item.placeId] = (acc[item.placeId] || 0) + 1;
      return acc;
    }, {});

    const placeCounts = Object.entries(popular)
      .sort(([, a], [, b]) => b - a)
      .map(([placeId]) => getPlaces().find((place) => place.id === placeId)?.name || placeId)
      .slice(0, 3);

    const totalRevenue = itineraries.reduce((sum, item) => {
      const place = getPlaces().find((placeItem) => placeItem.id === item.placeId);
      if (!place) {
        return sum;
      }
      return sum + place.budget.food + place.budget.stay + place.budget.transport;
    }, 0);

    return {
      itineraryCount: itineraries.length,
      popularDestinations: placeCounts,
      totalRevenue,
    };
  }, [itineraries]);

  const reload = () => {
    setPlaces(getPlaces());
    form.resetFields();
    setEditingPlace(null);
  };

  const startEdit = (place: TravelPlace) => {
    setEditingPlace(place);
    form.setFieldsValue({
      name: place.name,
      city: place.city,
      type: place.type,
      price: place.price,
      rating: place.rating,
      image: place.image,
      description: place.description,
      visitTime: place.visitTime,
      budgetFood: place.budget.food,
      budgetStay: place.budget.stay,
      budgetTransport: place.budget.transport,
    });
  };

  const onFinish = (values: any) => {
    const nextPlaces = [...places];
    const payload: TravelPlace = {
      id: editingPlace ? editingPlace.id : `place-${Date.now()}`,
      name: values.name,
      city: values.city,
      type: values.type,
      price: values.price,
      rating: values.rating,
      image: values.image,
      description: values.description,
      visitTime: values.visitTime,
      budget: {
        food: values.budgetFood,
        stay: values.budgetStay,
        transport: values.budgetTransport,
      },
    };

    if (editingPlace) {
      const index = nextPlaces.findIndex((place) => place.id === editingPlace.id);
      nextPlaces[index] = payload;
      message.success('Cập nhật điểm đến thành công.');
    } else {
      nextPlaces.push(payload);
      message.success('Thêm điểm đến mới thành công.');
    }

    savePlaces(nextPlaces);
    setPlaces(nextPlaces);
    reload();
  };

  const removePlace = (id: string) => {
    const nextPlaces = places.filter((place) => place.id !== id);
    savePlaces(nextPlaces);
    setPlaces(nextPlaces);
    message.success('Xóa điểm đến thành công.');
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: (image: string) => <img src={image} alt="ảnh" style={{ width: 100, height: 70, objectFit: 'cover' }} />,
    },
    { title: 'Tên', dataIndex: 'name' },
    { title: 'Thành phố', dataIndex: 'city' },
    { title: 'Loại', dataIndex: 'type', render: (type: string) => <Tag>{type}</Tag> },
    { title: 'Giá', dataIndex: 'price', render: (price: number) => `${price}k` },
    { title: 'Rating', dataIndex: 'rating' },
    {
      title: 'Hành động',
      render: (_: any, record: TravelPlace) => (
        <Space>
          <Button onClick={() => startEdit(record)}>Sửa</Button>
          <Button danger onClick={() => removePlace(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Quản lý điểm đến" bordered>
            <Table rowKey="id" dataSource={places} columns={columns} pagination={{ pageSize: 5 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thống kê" bordered>
            <Statistic title="Số lịch trình" value={stats.itineraryCount} />
            <Statistic title="Tổng doanh thu" value={`${stats.totalRevenue}k`} style={{ marginTop: 12 }} />
            <div style={{ marginTop: 16 }}>
              <Typography.Text strong>Địa điểm phổ biến</Typography.Text>
              <ul>
                {stats.popularDestinations.length > 0 ? (
                  stats.popularDestinations.map((destination) => <li key={destination}>{destination}</li>)
                ) : (
                  <li>Chưa có dữ liệu</li>
                )}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title={editingPlace ? 'Chỉnh sửa điểm đến' : 'Thêm điểm đến mới'} bordered>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{
            type: 'Thành phố',
            rating: 4.5,
            price: 0,
            visitTime: 3,
            budgetFood: 0,
            budgetStay: 0,
            budgetTransport: 0,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Tên điểm đến" rules={[{ required: true, message: 'Nhập tên điểm đến' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="city" label="Thành phố" rules={[{ required: true, message: 'Nhập thành phố' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="type" label="Loại hình" rules={[{ required: true }]}>
                <Select>
                  <Option value="Thành phố">Thành phố</Option>
                  <Option value="Biển">Biển</Option>
                  <Option value="Núi">Núi</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="price" label="Giá tham khảo (k)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="rating" label="Rating" rules={[{ required: true }]}>
                <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="visitTime" label="Thời gian tham quan (giờ)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="image" label="URL ảnh" rules={[{ required: true, message: 'Nhập đường dẫn ảnh' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="budgetFood" label="Ngân sách ăn uống (k)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="budgetStay" label="Ngân sách lưu trú (k)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="budgetTransport" label="Ngân sách di chuyển (k)" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingPlace ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={reload}>Hủy</Button>
          </Space>
        </Form>
      </Card>
    </>
  );
}
