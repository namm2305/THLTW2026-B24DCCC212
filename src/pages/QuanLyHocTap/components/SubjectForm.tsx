import { Form, Input, InputNumber, Button, Card } from "antd";

interface Props {
  onSubmit: (values: any) => void;
}

const SubjectForm = ({ onSubmit }: Props) => {
  const [form] = Form.useForm();

  return (
    <Card style={{ marginTop: 20 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          console.log("SUBMIT:", values);
          onSubmit(values);
          form.resetFields();
        }}
      >
        <Form.Item
          name="name"
          label="Tên môn"
          rules={[{ required: true, message: "Nhập tên môn!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="monthlyGoal"
          label="Mục tiêu tháng (giờ)"
          rules={[{ required: true, message: "Nhập mục tiêu!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Thêm Môn Học
        </Button>
      </Form>
    </Card>
  );
};

export default SubjectForm;