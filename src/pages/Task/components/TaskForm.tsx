import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  initialValues?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onCancel, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={initialValues ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
        >
          <Input placeholder="Nhập tên công việc" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={4} placeholder="Nhập mô tả công việc" />
        </Form.Item>

        <Form.Item
          name="deadline"
          label="Deadline"
          rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Mức độ ưu tiên"
          rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
        >
          <Select placeholder="Chọn mức độ ưu tiên">
            <Select.Option value="High">Cao</Select.Option>
            <Select.Option value="Medium">Trung bình</Select.Option>
            <Select.Option value="Low">Thấp</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Thêm tags">
            <Select.Option value="Frontend">Frontend</Select.Option>
            <Select.Option value="Backend">Backend</Select.Option>
            <Select.Option value="Design">Design</Select.Option>
            <Select.Option value="Bug">Bug</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;