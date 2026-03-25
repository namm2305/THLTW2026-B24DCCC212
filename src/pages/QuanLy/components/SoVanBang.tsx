import { useState } from 'react';
import { InputNumber, Button, Table } from 'antd';

export default function SoVanBang({ books, setBooks }: any) {
  const [year, setYear] = useState<number | undefined>();

  const add = (yearValue: number) => {
    setBooks([...books, { year: yearValue, currentNumber: 0 }]);
  };

  return (
    <>
      <InputNumber onChange={(v: any) => setYear(v)} />
      <Button onClick={() => year && add(year)}>Tạo sổ</Button>

      <Table dataSource={books} rowKey='year'>
        <Table.Column title='Năm' dataIndex='year' />
        <Table.Column title='Số hiện tại' dataIndex='currentNumber' />
      </Table>
    </>
  );
}