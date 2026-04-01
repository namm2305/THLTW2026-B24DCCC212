import { Table, Button, Modal, Input, Select, Card } from 'antd';
import { useState } from 'react';

export default function ApplicationTable({ clubs, applications, setApplications }: any) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [reason, setReason] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  const add = () => {
    setApplications([...applications, { id: Date.now(), ...form, status: 'Pending' }]);
    setOpen(false);
  };

  const approve = () => {
    setApplications(applications.map((a: any) =>
      selected.includes(a.id) ? { ...a, status: 'Approved' } : a
    ));
    setSelected([]);
  };

  const reject = () => {
    if (!reason) return alert('Nhập lý do!');
    setApplications(applications.map((a: any) =>
      selected.includes(a.id) ? { ...a, status: 'Rejected', reason } : a
    ));
    setRejectOpen(false);
  };

  return (
    <Card title="Đơn đăng ký">
      <Button onClick={() => setOpen(true)}>Thêm</Button>
      <Button onClick={approve}>Duyệt</Button>
      <Button danger onClick={() => setRejectOpen(true)}>Từ chối</Button>

      <Table
        rowKey="id"
        rowSelection={{ selectedRowKeys: selected, onChange: setSelected }}
        dataSource={applications}
        columns={[
          { title: 'Tên', dataIndex: 'name' },
          { title: 'Trạng thái', dataIndex: 'status' }
        ]}
      />

      <Modal visible={open} onOk={add} onCancel={() => setOpen(false)}>
        <Input onChange={e => setForm({ ...form, name: e.target.value })} />
        <Select
          style={{ width: '100%', marginTop: 10 }}
          onChange={v => setForm({ ...form, clubId: v })}
          options={clubs.map((c: any) => ({ label: c.name, value: c.id }))}
        />
      </Modal>

      <Modal visible={rejectOpen} onOk={reject} onCancel={() => setRejectOpen(false)}>
        <Input.TextArea onChange={e => setReason(e.target.value)} />
      </Modal>
    </Card>
  );
}