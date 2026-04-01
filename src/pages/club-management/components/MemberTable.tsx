import { Table, Button, Modal, Select, Card } from 'antd';
import { useState } from 'react';

export default function MemberTable({ clubs, applications, setApplications }: any) {
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);
  const [clubId, setClubId] = useState<any>();

  const members = applications.filter((a: any) => a.status === 'Approved');

  const changeClub = () => {
    setApplications(applications.map((a: any) =>
      selected.includes(a.id) ? { ...a, clubId } : a
    ));
    setOpen(false);
  };

  return (
    <Card title="Thành viên">
      <Button onClick={() => setOpen(true)}>Chuyển CLB</Button>

      <Table
        rowKey="id"
        rowSelection={{ selectedRowKeys: selected, onChange: setSelected }}
        dataSource={members}
        columns={[
          { title: 'Họ tên', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Giới tính', dataIndex: 'gender' },
          { title: 'Địa chỉ', dataIndex: 'address' },
          { title: 'Sở trường', dataIndex: 'skills' },
          { title: 'CLB', dataIndex: 'clubId', render: (id: number) => clubs.find((c: any) => c.id === id)?.name }
        ]}
      />

      <Modal visible={open} onOk={changeClub} onCancel={() => setOpen(false)}>
        <p>Chuyển {selected.length} thành viên sang CLB mới:</p>
        <Select
          key={clubs.length}
          style={{ width: '100%' }}
          placeholder="Chọn CLB mới"
          onChange={setClubId}
          options={clubs.map((c: any) => ({
            label: c.name,
            value: c.id
          }))}
        />
      </Modal>
    </Card>
  );
}