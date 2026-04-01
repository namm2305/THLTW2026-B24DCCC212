import { useState } from 'react';
import { Layout, Menu, Tabs } from 'antd';

import ClubTable from './components/ClubTable';
import ApplicationTable from './components/ApplicationTable';
import MemberTable from './components/MemberTable';
import Dashboard from './components/Dashboard';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

export interface Club {
  id: number;
  name: string;
  avatar?: string;
  establishedDate?: string;
  description?: string;
  leader?: string;
  active: boolean;
}

export interface Application {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  gender?: 'Nam' | 'Nữ';
  address?: string;
  skills?: string;
  clubId: number;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  note?: string;
  createdAt?: string;
}

export interface History {
  id: number;
  action: string;
  time: string;
  reason?: string;
  applicationId: number;
}

function App() {
  const [clubs, setClubs] = useState<Club[]>([
    { id: 1, name: 'IT Club', avatar: '', establishedDate: '2020-01-01', description: '<p>CLB Công nghệ Thông tin</p>', leader: 'Nguyễn Văn A', active: true },
    { id: 2, name: 'Music Club', avatar: '', establishedDate: '2019-05-10', description: '<p>CLB Âm nhạc</p>', leader: 'Trần Thị B', active: true }
  ]);

  const [applications, setApplications] = useState<Application[]>([]);
  const [history, setHistory] = useState<History[]>([]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <Menu items={[{ key: '1', label: 'Quản lý CLB' }]} />
      </Sider>

      <Layout>
        <Header style={{ color: '#fff' }}>Hệ thống quản lý</Header>

        <Content style={{ padding: 20 }}>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='CLB' key='1'>
              <ClubTable clubs={clubs} setClubs={setClubs} />
            </TabPane>
            <TabPane tab='Đăng ký' key='2'>
              <ApplicationTable
                clubs={clubs}
                applications={applications}
                setApplications={setApplications}
                history={history}
                setHistory={setHistory}
              />
            </TabPane>
            <TabPane tab='Thành viên' key='3'>
              <MemberTable
                clubs={clubs}
                applications={applications}
                setApplications={setApplications}
              />
            </TabPane>
            <TabPane tab='Báo cáo' key='4'>
              <Dashboard
                clubs={clubs}
                applications={applications}
              />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;