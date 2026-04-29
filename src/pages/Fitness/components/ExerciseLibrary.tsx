import { Card, Input, Button, Modal, Form, Select, Row, Col, Tag, Space, Popconfirm, InputNumber, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';

type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Full Body';
type Difficulty = 'Dễ' | 'Trung bình' | 'Khó';

const muscleGroupOptions = [
  { value: 'Chest', label: 'Chest' },
  { value: 'Back', label: 'Back' },
  { value: 'Legs', label: 'Legs' },
  { value: 'Shoulders', label: 'Shoulders' },
  { value: 'Arms', label: 'Arms' },
  { value: 'Core', label: 'Core' },
  { value: 'Full Body', label: 'Full Body' },
];

const difficultyOptions = [
  { value: 'Dễ', label: 'Dễ', color: 'green' },
  { value: 'Trung bình', label: 'Trung bình', color: 'orange' },
  { value: 'Khó', label: 'Khó', color: 'red' },
];

const defaultExercises = [
  { key: 1, name: 'Push-up', muscleGroup: 'Chest', difficulty: 'Dễ', description: 'Bài tập cơ ngực cơ bản', caloriesPerHour: 300 },
  { key: 2, name: 'Squat', muscleGroup: 'Legs', difficulty: 'Dễ', description: 'Bài tập chân cơ bản', caloriesPerHour: 250 },
  { key: 3, name: 'Plank', muscleGroup: 'Core', difficulty: 'Trung bình', description: 'Bài tập core giúp tăng sức mạnh vùng bụng', caloriesPerHour: 200 },
  { key: 4, name: 'Pull-up', muscleGroup: 'Back', difficulty: 'Khó', description: 'Bài tập kéo lên tường cho cơ lưng', caloriesPerHour: 350 },
  { key: 5, name: 'Lunge', muscleGroup: 'Legs', difficulty: 'Trung bình', description: 'Bài tập chân với tư duy đi bộ', caloriesPerHour: 280 },
  { key: 6, name: 'Burpee', muscleGroup: 'Full Body', difficulty: 'Khó', description: 'Bài tập toàn thân kết hợp cardio', caloriesPerHour: 500 },
  { key: 7, name: 'Shoulder Press', muscleGroup: 'Shoulders', difficulty: 'Trung bình', description: 'Bài tập vai với tạ hoặc tay không', caloriesPerHour: 220 },
  { key: 8, name: 'Bicep Curl', muscleGroup: 'Arms', difficulty: 'Dễ', description: 'Bài tập tay trước với tạ', caloriesPerHour: 180 },
  { key: 9, name: 'Crunches', muscleGroup: 'Core', difficulty: 'Dễ', description: 'Bài tập bụng cơ bản', caloriesPerHour: 150 },
];

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
    if (exercises.length === 0) {
      setData(defaultExercises);
      localStorage.setItem('exercises', JSON.stringify(defaultExercises));
    } else {
      setData(exercises);
    }
    setFilteredData(exercises.length === 0 ? defaultExercises : exercises);
  }, []);

  useEffect(() => {
    let result = [...data];
    
    if (searchText) {
      result = result.filter((item: any) => 
        item.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (muscleFilter) {
      result = result.filter((item: any) => item.muscleGroup === muscleFilter);
    }
    
    if (difficultyFilter) {
      result = result.filter((item: any) => item.difficulty === difficultyFilter);
    }
    
    setFilteredData(result);
  }, [searchText, muscleFilter, difficultyFilter, data]);

  const save = (d: any[]) => {
    setData(d);
    localStorage.setItem('exercises', JSON.stringify(d));
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = (key: number) => {
    save(data.filter((item: any) => item.key !== key));
  };

  const handleViewDetail = (record: any) => {
    setSelectedExercise(record);
    setDetailOpen(true);
  };

  const onFinish = (values: any) => {
    if (editingRecord) {
      const newData = data.map((item: any) => 
        item.key === editingRecord.key ? { ...item, ...values } : item
      );
      save(newData);
    } else {
      const newData = [
        ...data,
        {
          ...values,
          key: Date.now()
        }
      ];
      save(newData);
    }
    
    setOpen(false);
    form.resetFields();
  };

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'Dễ': return 'green';
      case 'Trung bình': return 'orange';
      case 'Khó': return 'red';
      default: return 'default';
    }
  };

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="Tìm kiếm bài tập..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Nhóm cơ"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setMuscleFilter(value)}
            options={muscleGroupOptions}
          />
          <Select
            placeholder="Mức độ"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setDifficultyFilter(value)}
            options={difficultyOptions}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm bài tập
          </Button>
        </Space>
      </Space>

      <Row gutter={[16, 16]}>
        {filteredData.map((exercise: any) => (
          <Col key={exercise.key} xs={24} sm={12} md={8}>
            <Card
              hoverable
              onClick={() => handleViewDetail(exercise)}
              actions={[
                <EditOutlined key="edit" onClick={(e) => { e.stopPropagation(); handleEdit(exercise); }} />,
                <Popconfirm
                  key="delete"
                  title="Bạn có chắc chắn muốn xóa bài tập này?"
                  onConfirm={() => handleDelete(exercise.key)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <DeleteOutlined onClick={(e) => e.stopPropagation()} />
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={
                  <Space>
                    {exercise.name}
                    <Tag color={getDifficultyColor(exercise.difficulty)}>{exercise.difficulty}</Tag>
                  </Space>
                }
                description={
                  <div>
                    <div><strong>Nhóm cơ:</strong> {exercise.muscleGroup}</div>
                    <div><strong>Calo/giờ:</strong> {exercise.caloriesPerHour} cal</div>
                    <div style={{ marginTop: 8, color: '#888', fontSize: 12 }}>
                      {exercise.description?.substring(0, 50)}...
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Detail Modal */}
      <Modal
        title={selectedExercise?.name}
        visible={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailOpen(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedExercise && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>Nhóm cơ:</strong> {selectedExercise.muscleGroup}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <strong>Mức độ:</strong> <Tag color={getDifficultyColor(selectedExercise.difficulty)}>{selectedExercise.difficulty}</Tag>
                </div>
              </Col>
            </Row>
            <div style={{ marginBottom: 16 }}>
              <strong>Calo đốt trung bình/giờ:</strong> {selectedExercise.caloriesPerHour} cal
            </div>
            <Divider />
            <div>
              <strong>Mô tả:</strong>
              <p>{selectedExercise.description}</p>
            </div>
            <Divider />
            <div>
              <strong>Hướng dẫn thực hiện:</strong>
              <p>
                1. Khởi động trước khi tập 5-10 phút<br />
                2. Thực hiện động tác với tư thế đúng<br />
                3. Hít thở đều đặn trong quá trình tập<br />
                4. Kết thúc bằng các động tác giãn cơ<br />
                5. Uống đủ nước trong và sau khi tập
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        title={editingRecord ? 'Sửa bài tập' : 'Thêm bài tập mới'}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={editingRecord || { difficulty: 'Dễ', caloriesPerHour: 200 }}
        >
          <Form.Item
            name="name"
            label="Tên bài tập"
            rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}
          >
            <Input placeholder="Nhập tên bài tập" />
          </Form.Item>

          <Form.Item
            name="muscleGroup"
            label="Nhóm cơ"
            rules={[{ required: true }]}
          >
            <Select
              options={muscleGroupOptions}
              placeholder="Chọn nhóm cơ"
            />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Mức độ khó"
            rules={[{ required: true }]}
          >
            <Select
              options={difficultyOptions}
              placeholder="Chọn mức độ"
            />
          </Form.Item>

          <Form.Item name="caloriesPerHour" label="Calo đốt trung bình/giờ">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số calo" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} placeholder="Nhập mô tả bài tập" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};