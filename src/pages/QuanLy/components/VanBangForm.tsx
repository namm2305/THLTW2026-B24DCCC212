import { Form, Input, Button, Select } from 'antd';

export default function VanBangForm({
  certificates,
  setCertificates,
  books,
  decisions,
  fields,
}: any) {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const book = books.find((b: any) => b.year === values.year);

    if (!book) return alert('Chưa có sổ');

    book.currentNumber += 1;

    const newItem = {
      ...values,
      soVaoSo: book.currentNumber,
    };

    setCertificates([...certificates, newItem]);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name='year' label='Năm'>
        <Select options={books.map((b: any) => ({ value: b.year }))} />
      </Form.Item>

      <Form.Item name='decision' label='Quyết định'>
        <Select options={decisions.map((d: any) => ({ value: d.soQD }))} />
      </Form.Item>

      <Form.Item name='soHieu' label='Số hiệu'>
        <Input />
      </Form.Item>

      <Form.Item name="msv" label="MSV">
        <Input />
      </Form.Item>

      <Form.Item name="hoTen" label="Họ tên">
        <Input />
      </Form.Item>

      {/* FIELD ĐỘNG */}
      {fields.map((f: any) => (
        <Form.Item key={f.name} name={f.name} label={f.name}>
          <Input />
        </Form.Item>
      ))}

      <Button htmlType="submit">Thêm</Button>
    </Form>
  );
}