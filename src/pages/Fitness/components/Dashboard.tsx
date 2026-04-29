import { Card, Row, Col, Statistic, Timeline, DatePicker } from 'antd';
import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import { useEffect, useState } from 'react';
import moment from 'moment';

const { RangePicker } = DatePicker;

export default () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [healthLogs, setHealthLogs] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  useEffect(() => {
    setWorkouts(JSON.parse(localStorage.getItem('workouts') || '[]'));
    setHealthLogs(JSON.parse(localStorage.getItem('healthLogs') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('goals') || '[]'));
  }, []);

  // Filter workouts by date range
  const filteredWorkouts = dateRange 
    ? workouts.filter((w: any) => {
        const workoutDate = moment(w.date);
        return workoutDate.isBetween(dateRange[0], dateRange[1], null, '[]');
      })
    : workouts;

  // Calculate stats
  const currentMonth = moment().month();
  const monthWorkouts = filteredWorkouts.filter((w: any) => moment(w.date).month() === currentMonth);
  const totalCalories = monthWorkouts.reduce((a: number, b: any) => a + Number(b.calo || 0), 0);
  
  // Calculate streak (consecutive days)
  const calculateStreak = () => {
    if (workouts.length === 0) return 0;
    const sortedDates = [...new Set(workouts.map((w: any) => w.date))].sort().reverse();
    let streak = 0;
    let currentDate = moment();
    for (const date of sortedDates) {
      if (moment(date).isSame(currentDate, 'day')) {
        streak++;
        currentDate = currentDate.subtract(1, 'day');
      } else if (moment(date).isSame(currentDate.clone().subtract(1, 'day'), 'day')) {
        streak++;
        currentDate = moment(date);
      } else {
        break;
      }
    }
    return streak;
  };

  // Calculate goal completion
  const goalCompletion = goals.length > 0
    ? Math.round((goals.filter((g: any) => g.status === 'Đã đạt').length / goals.length) * 100)
    : 0;

  // Weekly workout data for column chart
  const getWeeklyData = () => {
    const weeks: any[] = [];
    const now = moment();
    for (let i = 3; i >= 0; i--) {
      const weekStart = now.clone().subtract(i * 7 + now.day(), 'day');
      const weekEnd = weekStart.clone().add(6, 'day');
      const count = filteredWorkouts.filter((w: any) => {
        const d = moment(w.date);
        return d.isBetween(weekStart, weekEnd, null, '[]');
      }).length;
      weeks.push({ week: `Tuần ${4 - i}`, workouts: count });
    }
    return weeks;
  };

  // Weight data for line chart
  const getWeightData = () => {
    return healthLogs
      .sort((a: any, b: any) => moment(a.date).diff(moment(b.date)))
      .slice(-10)
      .map((h: any) => ({ date: moment(h.date).format('DD/MM'), weight: h.weight }));
  };

  // Timeline data
  const getTimelineData = () => {
    return filteredWorkouts
      .sort((a: any, b: any) => moment(b.date).diff(moment(a.date)))
      .slice(0, 5)
      .map((w: any) => ({
        color: w.status === 'Hoàn thành' ? 'green' : w.status === 'Bỏ lỡ' ? 'red' : 'blue',
        children: (
          <div>
            <strong>{w.type}</strong> - {w.date}<br />
            <span style={{ fontSize: 12, color: '#888' }}>
              {w.duration} phút | {w.calo} calo
            </span>
          </div>
        ),
      }));
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <RangePicker 
          onChange={(dates) => setDateRange(dates as [moment.Moment, moment.Moment] | null)} 
          placeholder={['Từ ngày', 'Đến ngày']}
        />
      </div>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng buổi tập (tháng)" 
              value={monthWorkouts.length} 
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Tổng calo đốt" 
              value={totalCalories} 
              suffix="cal"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Ngày tập liên tiếp" 
              value={calculateStreak()} 
              suffix="ngày"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="Mục tiêu hoàn thành" 
              value={goalCompletion} 
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Số buổi tập theo tuần">
            <ColumnChart 
              title="Số buổi tập theo tuần" 
              xAxis={getWeeklyData().map((d: any) => d.week)} 
              yAxis={[getWeeklyData().map((d: any) => d.workouts)]} 
              yLabel={['Buổi tập']} 
              type="bar" 
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Cân nặng theo thời gian">
            <LineChart 
              title="Cân nặng theo thời gian" 
              xAxis={getWeightData().map((d: any) => d.date)} 
              yAxis={[getWeightData().map((d: any) => d.weight)]} 
              yLabel={['Cân nặng (kg)']} 
              type="area" 
            />
          </Card>
        </Col>
      </Row>

      <Card title="5 buổi tập gần nhất" style={{ marginTop: 16 }}>
        <Timeline>
          {getTimelineData().map((item: any, index: number) => (
            <Timeline.Item key={index} color={item.color}>
              {item.children}
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};