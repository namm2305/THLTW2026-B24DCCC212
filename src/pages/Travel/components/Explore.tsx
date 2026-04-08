import { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Select, Input, Button, Tag, Rate, Space, message } from 'antd';
import { getPlaces, getItinerary, saveItinerary } from '../services/travelService';
import type { TravelPlace } from '../services/travelService';

const { Option } = Select;

export default function Explore() {
  const [places, setPlaces] = useState<TravelPlace[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tất cả');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    setPlaces(getPlaces());
  }, []);

  const filteredPlaces = useMemo(() => {
    return places
      .filter((place) => {
        if (typeFilter !== 'Tất cả' && place.type !== typeFilter) {
          return false;
        }
        if (ratingFilter > 0 && place.rating < ratingFilter) {
          return false;
        }
        return (
          place.name.toLowerCase().includes(search.toLowerCase()) ||
          place.city.toLowerCase().includes(search.toLowerCase()) ||
          place.description.toLowerCase().includes(search.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (sortBy === 'priceAsc') {
          return a.price - b.price;
        }
        if (sortBy === 'priceDesc') {
          return b.price - a.price;
        }
        return b.rating - a.rating;
      });
  }, [places, search, typeFilter, ratingFilter, sortBy]);

  const addToItinerary = (place: TravelPlace) => {
    const itinerary = getItinerary();
    const existed = itinerary.some((item) => item.placeId === place.id);
    if (existed) {
      message.warning('Điểm đến này đã có trong lịch trình.');
      return;
    }
    const newItem = {
      id: `${place.id}-${Date.now()}`,
      placeId: place.id,
      day: 1,
      createdAt: new Date().toISOString(),
    };
    saveItinerary([...itinerary, newItem]);
    message.success('Đã thêm vào lịch trình.');
  };

  return (
    <>
      <h2>Khám phá điểm đến</h2>
      <Space wrap style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm điểm đến, thành phố"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: 240 }}
        />
        <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 160 }}>
          <Option value="Tất cả">Tất cả loại</Option>
          <Option value="Biển">Biển</Option>
          <Option value="Núi">Núi</Option>
          <Option value="Thành phố">Thành phố</Option>
        </Select>
        <Select value={ratingFilter} onChange={setRatingFilter} style={{ width: 160 }}>
          <Option value={0}>Tất cả đánh giá</Option>
          <Option value={4}>4.0+</Option>
          <Option value={4.5}>4.5+</Option>
          <Option value={4.8}>4.8+</Option>
        </Select>
        <Select value={sortBy} onChange={setSortBy} style={{ width: 180 }}>
          <Option value="rating">Sắp xếp theo rating</Option>
          <Option value="priceAsc">Giá tăng dần</Option>
          <Option value="priceDesc">Giá giảm dần</Option>
        </Select>
      </Space>

      <Row gutter={[16, 16]}>
        {filteredPlaces.map((place) => (
          <Col key={place.id} xs={24} sm={12} md={12} lg={8} xl={6}>
            <Card
              hoverable
              cover={<img alt={place.name} src={place.image} style={{ height: 180, objectFit: 'cover' }} />}
              actions={[
                <Button key={`add-${place.id}`} type="primary" block onClick={() => addToItinerary(place)}>
                  Thêm vào lịch trình
                </Button>,
              ]}
            >
              <Tag color="blue">{place.type}</Tag>
              <h3>{place.name}</h3>
              <p>{place.city}</p>
              <Rate disabled defaultValue={place.rating} allowHalf />
              <p>{place.rating} / 5</p>
              <p>Giá tham khảo: {place.price.toLocaleString()}k</p>
              <p>{place.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
