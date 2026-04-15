import React from 'react';
import { Table, Button, Modal, message, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Phong } from './types';

interface Props {
  data: Phong[];
  onEdit: (p: Phong) => void;
  onDelete: (p: Phong) => void;
}

const ApplicationTable: React.FC<Props> = ({ data, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Mã',
      dataIndex: 'ma',
      key: 'ma',
      sorter: (a: Phong, b: Phong) => a.ma.localeCompare(b.ma),
    },
    {
      title: 'Tên',
      dataIndex: 'ten',
      key: 'ten',
      sorter: (a: Phong, b: Phong) => a.ten.localeCompare(b.ten),
    },
    {
      title: 'Số chỗ',
      dataIndex: 'so',
      key: 'so',
      sorter: (a: Phong, b: Phong) => a.so - b.so,
    },
    {
      title: 'Loại',
      dataIndex: 'loai',
      key: 'loai',
      render: (loai: string) => {
        const colors = {
          'Lý thuyết': 'blue',
          'Thực hành': 'green',
          'Hội trường': 'orange',
        };
        return <Tag color={colors[loai as keyof typeof colors] || 'default'}>{loai}</Tag>;
      },
      filters: [
        { text: 'Lý thuyết', value: 'Lý thuyết' },
        { text: 'Thực hành', value: 'Thực hành' },
        { text: 'Hội trường', value: 'Hội trường' },
      ],
      onFilter: (value: string, record: Phong) => record.loai === value,
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoi',
      key: 'nguoi',
      filters: [
        { text: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
        { text: 'Trần Thị B', value: 'Trần Thị B' },
        { text: 'Lê Văn C', value: 'Lê Văn C' },
      ],
      onFilter: (value: string, record: Phong) => record.nguoi === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Phong) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => onEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => {
              if (record.so >= 30) {
                message.error('Chỉ xóa phòng < 30 chỗ');
                return;
              }

              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc muốn xóa phòng "${record.ten}"?`,
                okText: 'Xóa',
                cancelText: 'Hủy',
                onOk: () => onDelete(record),
              });
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="ma"
      columns={columns}
      dataSource={data}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} phòng`,
      }}
      style={{
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default ApplicationTable;