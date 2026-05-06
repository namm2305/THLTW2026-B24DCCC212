import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Tag, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Task, Status } from '../index';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const columnsList: { id: Status; title: string }[] = [
  { id: 'todo', title: 'Cần làm' },
  { id: 'in-progress', title: 'Đang làm' },
  { id: 'done', title: 'Hoàn thành' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onUpdateStatus, onEdit, onDelete }) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    onUpdateStatus(draggableId, destination.droppableId as Status);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', padding: '24px 0' }}>
        {columnsList.map((column) => (
          <div key={column.id} style={{ flex: 1, minWidth: '300px', background: '#f0f2f5', borderRadius: '8px', padding: '8px' }}>
            <h3 style={{ padding: '8px', borderBottom: '1px solid #d9d9d9' }}>
              {column.title} ({tasks.filter((t) => t.status === column.id).length})
            </h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ minHeight: '500px', padding: '8px' }}
                >
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ marginBottom: '8px', ...provided.draggableProps.style }}
                            bodyStyle={{ padding: '12px' }}
                            actions={[
                              <EditOutlined key="edit" onClick={() => onEdit(task)} />,
                              <Popconfirm
                                key="delete"
                                title="Bạn có chắc chắn muốn xóa?"
                                onConfirm={() => onDelete(task.id)}
                              >
                                <DeleteOutlined style={{ color: 'red' }} />
                              </Popconfirm>,
                            ]}
                          >
                            <Card.Meta
                              title={task.title}
                              description={
                                <Space direction="vertical" style={{ width: '100%' }}>
                                  <div style={{ color: '#00000073' }}>{task.description}</div>
                                  <div>
                                    Deadline: <Tag color="blue">{task.deadline}</Tag>
                                  </div>
                                  <div>
                                    Ưu tiên:{' '}
                                    <Tag color={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'orange' : 'blue'}>
                                      {task.priority}
                                    </Tag>
                                  </div>
                                  <div>
                                    {task.tags?.map((tag) => (
                                      <Tag key={tag} style={{ marginTop: '4px' }}>
                                        {tag}
                                      </Tag>
                                    ))}
                                  </div>
                                </Space>
                              }
                            />
                          </Card>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
