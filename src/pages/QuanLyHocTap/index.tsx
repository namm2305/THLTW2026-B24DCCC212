import { useState } from "react";
import {
  Card,
  Button,
  List,
  Typography,
  Progress,
  Space,
  Divider,
  Popconfirm,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import { v4 as uuidv4 } from "uuid";

const { Title, Text } = Typography;

interface StudySession {
  id: string;
  date: string;
  duration: number;
  content: string;
  note: string;
}

interface Subject {
  id: string;
  name: string;
  monthlyGoal: number;
  sessions: StudySession[];
}

const QuanLyHocTap = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form] = Form.useForm();

  const handleAddSubject = (values: any) => {
    const newSubject: Subject = {
      id: uuidv4(),
      name: values.name,
      monthlyGoal: values.monthlyGoal,
      sessions: [],
    };

    setSubjects((prev) => [...prev, newSubject]);

    message.success("Thêm môn học thành công");
    form.resetFields();
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    message.success("Đã xoá môn học");
  };

  const getTotalHours = (subject: Subject) =>
    subject.sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: "0 auto" }}>
      <Title level={2}>📚 Quản Lý Học Tập</Title>

      {/* FORM THÊM MÔN HỌC */}
      <Card style={{ marginBottom: 30 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddSubject}
        >
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: "Nhập tên môn học!" }]}
          >
            <Input placeholder="Ví dụ: Toán, React, Anh Văn..." />
          </Form.Item>

          <Form.Item
            name="monthlyGoal"
            label="Mục tiêu tháng (giờ)"
            rules={[{ required: true, message: "Nhập mục tiêu!" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Ví dụ: 20"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Thêm Môn Học
          </Button>
        </Form>
      </Card>

      <Divider />

      {/* DANH SÁCH MÔN HỌC */}
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={subjects}
        renderItem={(subject) => {
          const total = getTotalHours(subject);
          const percent =
            subject.monthlyGoal > 0
              ? Math.min((total / subject.monthlyGoal) * 100, 100)
              : 0;

          return (
            <List.Item>
              <Card
                title={subject.name}
                extra={
                  <Popconfirm
                    title="Xoá môn này?"
                    onConfirm={() => deleteSubject(subject.id)}
                  >
                    <Button danger size="small">
                      Xoá
                    </Button>
                  </Popconfirm>
                }
              >
                <Text>🎯 Mục tiêu: {subject.monthlyGoal} giờ</Text>
                <Progress percent={percent} />
                <Text>⏳ Đã học: {total} giờ</Text>
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default QuanLyHocTap;