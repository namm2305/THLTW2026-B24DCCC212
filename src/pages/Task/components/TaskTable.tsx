import React from 'react';
import { Table, Tag, Space, Button, Popconfirm, Input } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { Task } from '../index';
import moment from 'moment';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'title',
      key: 'title',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm tên"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value: any, record: any) =>
        record.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a: Task, b: Task) => moment(a.deadline).unix() - moment(b.deadline).unix(),
    },
    {
      title: 'Mức độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        let color = 'blue';
        if (priority === 'High') color = 'red';
        if (priority === 'Medium') color = 'orange';
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'To Do', value: 'todo' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Done', value: 'done' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (status: string) => {
        const statusMap = {
          todo: { text: 'To Do', color: 'default' },
          'in-progress': { text: 'In Progress', color: 'processing' },
          done: { text: 'Done', color: 'success' },
        };
        const { text, color } = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags?.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => onDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={tasks} rowKey="id" pagination={{ pageSize: 5 }} />;
};

export default TaskTable;
