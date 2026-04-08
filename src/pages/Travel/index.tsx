import React from 'react';
import { Tabs } from 'antd';

import Explore from './components/Explore';
import Itinerary from './components/Itinerary';
import Budget from './components/Budget';
import Admin from './components/Admin';

const { TabPane } = Tabs;

export default function TravelApp() {
  return (
    <div style={{ padding: 10 }}>
      <Tabs>
        <TabPane tab="Khám phá" key="1">
          <Explore />
        </TabPane>
        <TabPane tab="Lịch trình" key="2">
          <Itinerary />
        </TabPane>
        <TabPane tab="Ngân sách" key="3">
          <Budget />
        </TabPane>
        <TabPane tab="Admin" key="4">
          <Admin />
        </TabPane>
      </Tabs>
    </div>
  );
}