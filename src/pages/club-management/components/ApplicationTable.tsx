import { Table, Button, Modal, Input, Select, Card } from 'antd';
import { useState } from 'react';

export default function ApplicationTable({ clubs, applications, setApplications, history, setHistory }: any) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<React.Key[]>([]);
  const [reason, setReason] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  const add = () => {
    if (!form.name || !form.clubId) return alert('Nhập đầy đủ thông tin!');
    setApplications([...applications, { id: Date.now(), ...form, status: 'Pending', createdAt: new Date().toISOString() }]);
    setOpen(false);
    setForm({});
  };

  const approve = () => {
    setApplications(applications.map((a: any) =>
      selected.includes(a.id) ? { ...a, status: 'Approved' } : a
    ));
    selected.forEach((id: any) => {
      setHistory([...history, { id: Date.now(), action: 'Approved', time: new Date().toISOString(), applicationId: id }]);
    });
    setSelected([]);
  };

  const reject = () => {
    if (!reason) return alert('Nhập lý do!');
    setApplications(applications.map((a: any) =>
      selected.includes(a.id) ? { ...a, status: 'Rejected', note: reason } : a
    ));
    selected.forEach((id: any) => {
      setHistory([...history, { id: Date.now(), action: 'Rejected', time: new Date().toISOString(), reason, applicationId: id }]);
    });
    setRejectOpen(false);
    setReason('');
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
          { title: 'Họ tên', dataIndex: 'name' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'SĐT', dataIndex: 'phone' },
          { title: 'Giới tính', dataIndex: 'gender' },
          { title: 'Địa chỉ', dataIndex: 'address' },
          { title: 'Sở trường', dataIndex: 'skills' },
          { title: 'CLB', dataIndex: 'clubId', render: (id: number) => clubs.find((c: any) => c.id === id)?.name },
          { title: 'Lý do đăng ký', dataIndex: 'reason' },
          { title: 'Trạng thái', dataIndex: 'status' },
          { title: 'Ghi chú', dataIndex: 'note' },
          {
            title: 'Thao tác',
            render: (_, r: any) => (
              <>
                <Button onClick={() => alert('Xem chi tiết')}>Xem</Button>
                <Button onClick={() => alert('Sửa')}>Sửa</Button>
                <Button danger onClick={() => setApplications(applications.filter((a: any) => a.id !== r.id))}>Xóa</Button>
              </>
            )
          }
        ]}
      />

      <Modal visible={open} onOk={add} onCancel={() => setOpen(false)}>
        <Input placeholder='Họ tên' onChange={e => setForm({ ...form, name: e.target.value })} />
        <Input placeholder='Email' onChange={e => setForm({ ...form, email: e.target.value })} style={{ marginTop: 10 }} />
        <Input placeholder='SĐT' onChange={e => setForm({ ...form, phone: e.target.value })} style={{ marginTop: 10 }} />
        <Select placeholder='Giới tính' onChange={v => setForm({ ...form, gender: v })} style={{ width: '100%', marginTop: 10 }}>
          <Select.Option value='Nam'>Nam</Select.Option>
          <Select.Option value='Nữ'>Nữ</Select.Option>
        </Select>
        <Input placeholder='Địa chỉ' onChange={e => setForm({ ...form, address: e.target.value })} style={{ marginTop: 10 }} />
        <Input placeholder='Sở trường' onChange={e => setForm({ ...form, skills: e.target.value })} style={{ marginTop: 10 }} />
        <Select placeholder='Chọn CLB' onChange={v => setForm({ ...form, clubId: v })} style={{ width: '100%', marginTop: 10 }}>
          {clubs.map((c: any) => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
        </Select>
        <Input.TextArea placeholder='Lý do đăng ký' onChange={e => setForm({ ...form, reason: e.target.value })} style={{ marginTop: 10 }} />
      </Modal>

      <Modal visible={rejectOpen} onOk={reject} onCancel={() => setRejectOpen(false)}>
        <Input.TextArea
          placeholder='Nhập lý do từ chối'
          onChange={e => setReason(e.target.value)}
        />
      </Modal>
    </Card>
  );
}