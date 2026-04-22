import { Form, Input, Button } from "antd";

function FormPost({ onSubmit }: any) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit({
      id: Date.now(),
      ...values,
      tags: values.tags.split(","),
      views: 0,
      createdAt: new Date().toISOString(),
      status: "published"
    });

    form.resetFields();
  };

  return (
    <Form form={form} onFinish={handleFinish} layout="vertical">
      <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="summary" label="Mô tả">
        <Input />
      </Form.Item>

      <Form.Item name="image" label="Ảnh URL">
        <Input />
      </Form.Item>

      <Form.Item name="tags" label="Tags">
        <Input placeholder="react, js" />
      </Form.Item>

      <Form.Item name="author" label="Tác giả">
        <Input />
      </Form.Item>

      <Form.Item name="content" label="Nội dung">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Thêm bài
      </Button>
    </Form>
  );
}

export default FormPost;