import { useEffect, useMemo, useState } from 'react';
import { Pie } from '@ant-design/plots';
import { Alert, Button, Card, Col, Input, InputNumber, Row, Space, Statistic } from 'antd';
import useLocalStorage from '../hooks/useLocalStorage';
import { getItinerary, getPlaces } from '../services/travelService';
import type { BudgetItem } from '../services/travelService';

export default function Budget() {
  const [budget, setBudget] = useLocalStorage<BudgetItem[]>('budget', [
    { type: 'Ăn uống', value: 700 },
    { type: 'Lưu trú', value: 900 },
    { type: 'Di chuyển', value: 450 },
  ]);
  const [limit, setLimit] = useLocalStorage('budgetLimit', 2500);
  const [actualExpense, setActualExpense] = useState(0);
  const [newType, setNewType] = useState('');
  const [newValue, setNewValue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const itinerary = getItinerary();
    const places = getPlaces();
    const actual = itinerary.reduce((sum, item) => {
      const place = places.find((placeItem) => placeItem.id === item.placeId);
      if (!place) return sum;
      return sum + place.budget.food + place.budget.stay + place.budget.transport;
    }, 0);
    setActualExpense(actual);
  }, [budget]);

  const totalPlanned = useMemo(
    () => budget.reduce((sum, entry) => sum + entry.value, 0),
    [budget],
  );

  const overBudget = totalPlanned > limit || actualExpense > limit;

  const handleAddBudgetItem = () => {
    const trimmedType = newType.trim();
    if (!trimmedType) {
      setError('Vui lòng nhập tên loại chi phí');
      return;
    }

    if (budget.some((item) => item.type.toLowerCase() === trimmedType.toLowerCase())) {
      setError('Loại chi phí này đã tồn tại');
      return;
    }

    setBudget([...budget, { type: trimmedType, value: newValue }]);
    setNewType('');
    setNewValue(0);
    setError(null);
  };

  const config = {
    data: budget,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  };

  return (
    <>
      <h2>Quản lý ngân sách</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Phân bổ ngân sách" bordered>
            <Pie {...config} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Tổng quan" bordered>
            <Statistic title="Ngân sách dự kiến" value={`${totalPlanned}k`} />
            <Statistic title="Hạn mức ngân sách" value={`${limit}k`} style={{ marginTop: 12 }} />
            <Statistic title="Chi phí thực tế" value={`${actualExpense}k`} style={{ marginTop: 12 }} />
            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
              <div>
                <span>Điều chỉnh hạn mức:</span>
                <InputNumber
                  min={0}
                  value={limit}
                  onChange={(value) => setLimit(value || 0)}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <span>Thêm loại chi phí mới:</span>
                <Input
                  placeholder="Tên loại chi phí"
                  value={newType}
                  onChange={(e) => {
                    setNewType(e.target.value);
                    setError(null);
                  }}
                  onPressEnter={handleAddBudgetItem}
                  style={{ width: '100%', marginTop: 8 }}
                />
                <InputNumber
                  min={0}
                  value={newValue}
                  onChange={(value) => setNewValue(value || 0)}
                  formatter={(value) => `${value}k`}
                  style={{ width: '100%', marginTop: 8 }}
                />
                <Button type="dashed" block style={{ marginTop: 8 }} onClick={handleAddBudgetItem}>
                  Thêm loại chi phí
                </Button>
                {error && (
                  <Alert
                    type="error"
                    showIcon
                    message={error}
                    style={{ marginTop: 12 }}
                  />
                )}
              </div>
              {budget.map((item, index) => (
                <Space key={item.type} align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>{item.type}</span>
                  <InputNumber
                    min={0}
                    value={item.value}
                    onChange={(value) => {
                      const next = [...budget];
                      next[index] = { ...next[index], value: value || 0 };
                      setBudget(next);
                    }}
                  />
                </Space>
              ))}
              <Button type="primary" onClick={() => setBudget([...budget])}>
                Lưu thay đổi
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {overBudget && (
        <Alert
          type="error"
          showIcon
          message="Cảnh báo vượt ngân sách"
          description={`Chi phí ${actualExpense}k hoặc ngân sách dự kiến ${totalPlanned}k đã vượt hạn mức ${limit}k.`}
          style={{ marginTop: 16 }}
        />
      )}
    </>
  );
}
