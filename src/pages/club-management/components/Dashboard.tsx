import { Card } from 'antd';
import Chart from 'react-apexcharts';

export default function Dashboard({ applications, clubs }: any) {
  const pending = applications.filter((a: any) => a.status === 'Pending').length;
  const approved = applications.filter((a: any) => a.status === 'Approved').length;
  const rejected = applications.filter((a: any) => a.status === 'Rejected').length;

  const chartData = {
    series: [
      {
        name: 'Pending',
        data: clubs.map((c: any) => applications.filter((a: any) => a.clubId === c.id && a.status === 'Pending').length)
      },
      {
        name: 'Approved',
        data: clubs.map((c: any) => applications.filter((a: any) => a.clubId === c.id && a.status === 'Approved').length)
      },
      {
        name: 'Rejected',
        data: clubs.map((c: any) => applications.filter((a: any) => a.clubId === c.id && a.status === 'Rejected').length)
      }
    ],
    options: {
      chart: { type: 'bar' },
      xaxis: { categories: clubs.map((c: any) => c.name) }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <Card>Số CLB: {clubs.length}</Card>
        <Card>Pending: {pending}</Card>
        <Card>Approved: {approved}</Card>
        <Card>Rejected: {rejected}</Card>
      </div>
      <Card>
        <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
      </Card>
    </div>
  );
}