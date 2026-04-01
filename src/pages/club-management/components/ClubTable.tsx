import { Table, Button, Modal, Input, Card } from 'antd';
import { useState } from 'react';

export default function ClubTable({ clubs, setClubs }: any) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<any>(null);

  const addClub = () => {
    if (!name) return;

    if (editing) {
      setClubs(clubs.map((c: any) =>
        c.id === editing.id ? { ...c, name } : c
      ));
      setEditing(null);
    } else {
      setClubs([...clubs, { id: Date.now(), name }]);
    }

    setOpen(false);
    setName('');
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
            title: 'Tên CLB',
            dataIndex: 'name',
            sorter: (a: any, b: any) =>
              a.name.localeCompare(b.name)
          },
          {
            title: 'Thao tác',
            render: (_, r: any) => (
              <>
                <Button onClick={() => {
                  setEditing(r);
                  setName(r.name);
                  setOpen(true);
                }}>
                  Sửa
                </Button>

                <Button danger onClick={() =>
                  setClubs(clubs.filter((c: any) => c.id !== r.id))
                }>
                  Xóa
                </Button>
              </>
            )
          }
        ]}
      />

      <Modal visible={open} onOk={addClub} onCancel={() => setOpen(false)}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Modal>
    </Card>
  );
}