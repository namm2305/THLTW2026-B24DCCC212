import { useState } from 'react';
import { Menu, Layout } from 'antd';
import {
  DichVu,
  NhanVien,
  LichHen,
  DanhGia,
  ThongKe,
} from './components';

const { Header, Content } = Layout;

export default function Home() {
  const [tab, setTab] = useState('dichvu');

  const render = () => {
    switch (tab) {
      case 'dichvu': return <DichVu />;
      case 'nhanvien': return <NhanVien />;
      case 'lichhen': return <LichHen />;
      case 'danhgia': return <DanhGia />;
      case 'thongke': return <ThongKe />;
      default: return null;
    }
  };

  return (
    <Layout>
      <Header>
        <Menu
          theme='dark'
          mode='horizontal'
          onClick={(e) => setTab(e.key as string)}
          items={[
            { key: 'dichvu', label: 'Dịch vụ' },
            { key: 'nhanvien', label: 'Nhân viên' },
            { key: 'lichhen', label: 'Lịch hẹn' },
            { key: 'danhgia', label: 'Đánh giá' },
            { key: 'thongke', label: 'Thống kê' },
          ]}
        />
      </Header>

      <Content style={{ padding: 24 }}>
        {render()}
      </Content>
    </Layout>
  );
}