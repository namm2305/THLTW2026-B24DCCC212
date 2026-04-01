import { Table, Button, Modal, Input, Card } from 'antd';
import { useState } from 'react';

export default function ClubTable({ clubs, setClubs }: any) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({ active: true });
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);

  const addClub = () => {
    if (!form.name) return alert('Nhập tên CLB!');

    if (editing) {
      setClubs(clubs.map((c: any) =>
        c.id === editing.id ? { ...c, ...form } : c
      ));
      setEditing(null);
    } else {
      setClubs([...clubs, { id: Date.now(), ...form }]);
    }

    setOpen(false);
    setForm({ active: true });
  };

  const filtered = clubs.filter((c: any) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card title="Quản lý CLB">
      <Input
        placeholder="Tìm CLB..."
        style={{ width: 200, marginBottom: 10 }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm CLB
      </Button>

      <Table
        rowKey="id"
        dataSource={filtered}
        columns={[
          {
            title: 'Ảnh đại diện',
            dataIndex: 'avatar',
            render: (avatar: string) => avatar ? <img src={avatar} alt="Avatar" style={{ width: 50, height: 50 }} /> : 'N/A'
          },
          {
            title: 'Tên CLB',
            dataIndex: 'name',
            sorter: (a: any, b: any) => a.name.localeCompare(b.name)
          },
          {
            title: 'Ngày thành lập',
            dataIndex: 'establishedDate'
          },
          {
            title: 'Mô tả',
            dataIndex: 'description',
            render: (desc: string) => <div dangerouslySetInnerHTML={{ __html: desc }} />
          },
          {
            title: 'Chủ nhiệm',
            dataIndex: 'leader'
          },
          {
            title: 'Hoạt động',
            dataIndex: 'active',
            render: (active: boolean) => active ? 'Có' : 'Không'
          },
          {
            title: 'Thao tác',
            render: (_, r: any) => (
              <>
                <Button onClick={() => {
                  setEditing(r);
                  setForm(r);
                  setOpen(true);
                }}>
                  Sửa
                </Button>
                <Button danger onClick={() =>
                  setClubs(clubs.filter((c: any) => c.id !== r.id))
                }>
                  Xóa
                </Button>
                <Button onClick={() => alert('Xem thành viên')}>
                  Xem thành viên
                </Button>
              </>
            )
          }
        ]}
      />

      <Modal visible={open} onOk={addClub} onCancel={() => { setOpen(false); setForm({ active: true }); setEditing(null); }}>
        <Input
          placeholder='Tên CLB'
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder='Ảnh đại diện (URL)'
          value={form.avatar || ''}
          onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          style={{ marginTop: 10 }}
        />
        <Input
          placeholder='Ngày thành lập (YYYY-MM-DD)'
          value={form.establishedDate || ''}
          onChange={(e) => setForm({ ...form, establishedDate: e.target.value })}
          style={{ marginTop: 10 }}
        />
        <Input.TextArea
          placeholder='Mô tả'
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ marginTop: 10 }}
        />
        <Input
          placeholder='Chủ nhiệm'
          value={form.leader || ''}
          onChange={(e) => setForm({ ...form, leader: e.target.value })}
          style={{ marginTop: 10 }}
        />
      </Modal>
    </Card>
  );
}