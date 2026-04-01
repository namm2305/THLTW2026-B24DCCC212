import { Card } from 'antd';

export default function Dashboard({ applications, clubs }: any) {
  const pending = applications.filter((a: any) => a.status === 'Pending').length;
  const approved = applications.filter((a: any) => a.status === 'Approved').length;
  const rejected = applications.filter((a: any) => a.status === 'Rejected').length;

  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <Card>Số CLB: {clubs.length}</Card>
      <Card>Pending: {pending}</Card>
      <Card>Approved: {approved}</Card>
      <Card>Rejected: {rejected}</Card>
    </div>
  );
}