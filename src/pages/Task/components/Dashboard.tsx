import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, OrderedListOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Task } from '../index';

interface DashboardProps {
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'done' && moment(t.deadline).isBefore(moment(), 'day'),
  ).length;

  return (
    <div style={{ padding: '24px 0' }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số công việc"
              value={totalTasks}
              prefix={<OrderedListOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Công việc hoàn thành"
              value={completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Công việc quá hạn"
              value={overdueTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
