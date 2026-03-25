import { Input, Button, Table } from 'antd';
import { useState } from 'react';

export default function CauHinhField({ fields, setFields }: any) {
  const [name, setName] = useState('');

  const add = () => {
    setFields([...fields, { name }]);
  };

  return (
    <>
      <Input onChange={e => setName(e.target.value)} />
      <Button onClick={add}>Thêm</Button>

      <Table dataSource={fields} rowKey="name">
        <Table.Column title="Tên field" dataIndex="name" />
      </Table>
    </>
  );
}