import React from 'react';
import { Form, Input, InputNumber, Select, Button, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { Phong } from './types';

const { Option } = Select;

interface Props {
  onSubmit: (values: Phong) => void;
  form: any;
  editing: Phong | null;
}

const MemberTable: React.FC<Props> = ({ onSubmit, form, editing }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="ma"
            label="Mã phòng"
            rules={[{ required: true, message: 'Vui lòng nhập mã phòng' }, { max: 10, message: 'Mã phòng tối đa 10 ký tự' }]}
          >
            <Input placeholder="Nhập mã phòng" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="ten"
            label="Tên phòng"
            rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }, { max: 50, message: 'Tên phòng tối đa 50 ký tự' }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="so"
            label="Số chỗ ngồi"
            rules={[
              { required: true, message: 'Vui lòng nhập số chỗ' },
              { type: 'number', min: 10, max: 200, message: 'Số chỗ từ 10 đến 200' }
            ]}
          >
            <InputNumber placeholder="Nhập số chỗ" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="loai"
            label="Loại phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
          >
            <Select placeholder="Chọn loại phòng">
              <Option value="Lý thuyết"> Lý thuyết</Option>
              <Option value="Thực hành"> Thực hành</Option>
              <Option value="Hội trường"> Hội trường</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="nguoi"
            label="Người phụ trách"
            rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
          >
            <Select placeholder="Chọn người phụ trách">
              <Option value="Nguyễn Văn A"> Nguyễn Văn A</Option>
              <Option value="Trần Thị B"> Trần Thị B</Option>
              <Option value="Lê Văn C"> Lê Văn C</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Form.Item label=" ">
            <Button
              type="primary"
              htmlType="submit"
              icon={editing ? <EditOutlined /> : <PlusOutlined />}
              style={{ width: '100%' }}
            >
              {editing ? 'Cập nhật' : 'Thêm phòng'}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default MemberTable;