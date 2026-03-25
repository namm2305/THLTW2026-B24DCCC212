import { Input, Button, Table, Select } from 'antd';
import { useState } from 'react';

export default function QuyetDinh({ decisions, setDecisions, books }: any) {
  const [form, setForm] = useState<any>({});

  const add = () => {
    setDecisions([...decisions, { ...form, searchCount: 0 }]);
  };

  return (
    <>
      <Input placeholder='Số QĐ'
        onChange={e => setForm({...form, soQD: e.target.value})}
      />

      <Select
        placeholder='Chọn sổ'
        onChange={v => setForm({...form, year: v})}
        options={books.map((b: any) => ({ value: b.year }))}
      />

      <Button onClick={add}>Thêm</Button>

      <Table dataSource={decisions} rowKey='soQD'>
        <Table.Column title='Số QĐ' dataIndex='soQD' />
        <Table.Column title='Sổ' dataIndex='year' />
        <Table.Column title='Lượt tra cứu' dataIndex='searchCount' />
      </Table>
    </>
  );
}