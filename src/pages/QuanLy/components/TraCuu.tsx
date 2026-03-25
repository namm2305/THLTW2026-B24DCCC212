import { useState } from 'react';
import { Input, Button, Table } from 'antd';

export default function TraCuu({ data, decisions, setDecisions }: any) {
  const [filters, setFilters] = useState<any>({});
  const [result, setResult] = useState<any[]>([]);

  const search = () => {
    if (Object.keys(filters).length < 2) {
      alert('Nhập ít nhất 2 điều kiện');
      return;
    }

    const rs = data.filter((item: any) =>
      Object.keys(filters).every(key =>
        item[key]?.toString().toLowerCase()
          .includes(filters[key]?.toLowerCase())
      )
    );

    // tăng lượt tra cứu
    const updated = decisions.map((d: any) => {
      const found = rs.find((r: any) => r.decision === d.soQD);
      if (found) return { ...d, searchCount: (d.searchCount || 0) + 1 };
      return d;
    });

    setDecisions(updated);
    setResult(rs);
  };

  return (
    <>
      <Input placeholder='Số hiệu'
        onChange={e => setFilters({...filters, soHieu: e.target.value})}
      />

      <Input placeholder='MSV'
        onChange={e => setFilters({...filters, msv: e.target.value})}
      />

      <Button onClick={search}>Tra cứu</Button>

      <Table dataSource={result} rowKey="soHieu">
        <Table.Column title="Số hiệu" dataIndex="soHieu" />
        <Table.Column title="Họ tên" dataIndex="hoTen" />
        <Table.Column title="Số vào sổ" dataIndex="soVaoSo" />
      </Table>
    </>
  );
}