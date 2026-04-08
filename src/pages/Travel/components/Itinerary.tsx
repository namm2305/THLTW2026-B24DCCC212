import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Divider, Empty, message, Progress, Row, Select, Space, Statistic, Tag, Typography } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getItinerary, getPlaces, saveItinerary, ItineraryItem, TravelPlace } from '../services/travelService';

const { Option } = Select;

export default function Itinerary() {
  const [availablePlaces, setAvailablePlaces] = useState<TravelPlace[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    setAvailablePlaces(getPlaces());
    setItinerary(getItinerary());
  }, []);

  const itineraryDetails = useMemo(
    () =>
      itinerary
        .map((item) => {
          const place = availablePlaces.find((placeItem) => placeItem.id === item.placeId);
          return place ? { item, place } : null;
        })
        .filter(Boolean) as { item: ItineraryItem; place: TravelPlace }[],
    [availablePlaces, itinerary],
  );

  const totalBudget = useMemo(
    () =>
      itineraryDetails.reduce(
        (sum, detail) => sum + detail.place.budget.food + detail.place.budget.stay + detail.place.budget.transport,
        0,
      ),
    [itineraryDetails],
  );

  const totalVisitHours = useMemo(
    () => itineraryDetails.reduce((sum, detail) => sum + detail.place.visitTime, 0),
    [itineraryDetails],
  );

  const totalTravelMinutes = useMemo(
    () => (itineraryDetails.length > 1 ? 45 * (itineraryDetails.length - 1) : 0),
    [itineraryDetails],
  );

  const totalDays = useMemo(
    () => (itinerary.length > 0 ? Math.max(...itinerary.map((item) => item.day)) : 0),
    [itinerary],
  );

  const sortedItinerary = useMemo(
    () =>
      [...itineraryDetails].sort((a, b) => a.item.day - b.item.day || a.place.name.localeCompare(b.place.name)),
    [itineraryDetails],
  );

  const addToItinerary = (placeId: string) => {
    const existed = itinerary.some((item) => item.placeId === placeId && item.day === selectedDay);
    if (existed) {
      message.warning('Điểm đến đã có trong ngày này.');
      return;
    }

    const nextItinerary = [
      ...itinerary,
      {
        id: `${placeId}-${Date.now()}`,
        placeId,
        day: selectedDay,
        createdAt: new Date().toISOString(),
      },
    ];
    setItinerary(nextItinerary);
    saveItinerary(nextItinerary);
    message.success('Đã thêm điểm đến vào lịch trình.');
  };

  const removeItem = (itemId: string) => {
    const nextItinerary = itinerary.filter((item) => item.id !== itemId);
    setItinerary(nextItinerary);
    saveItinerary(nextItinerary);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const next = Array.from(itinerary);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setItinerary(next);
    saveItinerary(next);
  };

  const clearItinerary = () => {
    setItinerary([]);
    saveItinerary([]);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Danh sách điểm đến" bordered>
            <Space wrap style={{ marginBottom: 16 }}>
              <span>Ngày lập kế hoạch:</span>
              <Select value={selectedDay} onChange={(value) => setSelectedDay(value)} style={{ width: 120 }}>
                {Array.from({ length: 7 }, (_, index) => index + 1).map((day) => (
                  <Option key={day} value={day}>
                    Ngày {day}
                  </Option>
                ))}
              </Select>
            </Space>

            <Row gutter={[16, 16]}>
              {availablePlaces.map((place) => (
                <Col key={place.id} xs={24} sm={12} md={12} xl={12}>
                  <Card hoverable>
                    <img src={place.image} alt={place.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                    <div style={{ marginTop: 12 }}>
                      <Tag color="blue">{place.type}</Tag>
                      <h4>{place.name}</h4>
                      <p>{place.city}</p>
                      <p>Thời gian tham quan: {place.visitTime} giờ</p>
                      <p>Chi phí dự kiến: {place.budget.food + place.budget.stay + place.budget.transport}k</p>
                      <Button type="primary" block onClick={() => addToItinerary(place.id)}>
                        Thêm vào lịch trình
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Tổng quan lịch trình" bordered>
            <Statistic title="Số ngày" value={totalDays || 0} />
            <Statistic title="Số điểm đến" value={itinerary.length} style={{ marginTop: 12 }} />
            <Statistic title="Tổng ngân sách" value={`${totalBudget}k`} style={{ marginTop: 12 }} />
            <Statistic title="Tổng thời gian" value={`${totalVisitHours} giờ + ${totalTravelMinutes} phút`} style={{ marginTop: 12 }} />
            <Progress percent={Math.min(100, (itinerary.length / 8) * 100)} status={itinerary.length > 7 ? 'exception' : 'active'} style={{ marginTop: 16 }} />
            <Button danger block onClick={clearItinerary} style={{ marginTop: 12 }}>
              Xóa toàn bộ lịch trình
            </Button>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card title="Lịch trình theo ngày" bordered>
        {itinerary.length === 0 ? (
          <Empty description="Chưa có điểm đến nào trong lịch trình" />
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="itinerary-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {sortedItinerary.map((detail, index) => (
                    <Draggable key={detail.item.id} draggableId={detail.item.id} index={index}>
                      {(dragProvided) => (
                        <Card
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          style={{ marginBottom: 12 }}
                        >
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Tag color="green">Ngày {detail.item.day}</Tag>
                              <Typography.Title level={5}>{detail.place.name}</Typography.Title>
                            </Col>
                            <Col>
                              <Button danger onClick={() => removeItem(detail.item.id)}>
                                Xóa
                              </Button>
                            </Col>
                          </Row>
                          <p>{detail.place.city}</p>
                          <Space>
                            <Tag>Thăm: {detail.place.visitTime} giờ</Tag>
                            <Tag>Chi phí: {detail.place.budget.food + detail.place.budget.stay + detail.place.budget.transport}k</Tag>
                          </Space>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Card>
    </>
  );
}
