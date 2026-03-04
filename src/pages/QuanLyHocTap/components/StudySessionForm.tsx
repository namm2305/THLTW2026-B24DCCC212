import { Modal, Form, Input, InputNumber, Button } from "antd";

interface Props {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const SubjectForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
}: Props) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title={initialValues ? "Sửa Môn Học" : "Thêm Môn Học"}
      open={open}
      onCancel={onCancel}
      footer={null}   // 🔥 QUAN TRỌNG: bỏ footer mặc định
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={(values) => {
          console.log("SUBMIT OK", values);
          onSubmit(values);
          form.resetFields();
        }}
      >
        <Form.Item
          name="name"
          label="Tên môn"
          rules={[{ required: true, message: "Vui lòng nhập tên môn!" }]}
        >
          <Input placeholder="Ví dụ: Toán, Văn, Anh..." />
        </Form.Item>

        <Form.Item
          name="monthlyGoal"
          label="Mục tiêu học tháng (giờ)"
          rules={[{ required: true, message: "Vui lòng nhập mục tiêu!" }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder="Ví dụ: 20"
          />
        </Form.Item>

        {/* 🔥 TỰ TẠO BUTTON SUBMIT */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SubjectForm;