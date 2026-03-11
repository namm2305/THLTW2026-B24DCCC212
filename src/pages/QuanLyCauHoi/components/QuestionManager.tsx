import React, { useState } from "react";
import { Input, Select, Button, Table } from "antd";

interface Question {
  key: number;
  content: string;
  level: string;
}

const QuestionManager: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [level, setLevel] = useState<string>("Dễ");
  const [questions, setQuestions] = useState<Question[]>([]);

  const addQuestion = () => {
    if (!content.trim()) return;

    const newQuestion: Question = {
      key: Date.now(),
      content,
      level,
    };

    setQuestions([...questions, newQuestion]);
    setContent("");
  };

  const columns = [
    {
      title: "Nội dung câu hỏi",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Mức độ",
      dataIndex: "level",
      key: "level",
    },
  ];

  return (
    <div>
      <Input
        placeholder="Nhập nội dung câu hỏi"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: 400 }}
      />

      <Select
        value={level}
        style={{ width: 150, marginLeft: 10 }}
        onChange={(value) => setLevel(value)}
        options={[
          { label: "Dễ", value: "Dễ" },
          { label: "Trung bình", value: "Trung bình" },
          { label: "Khó", value: "Khó" },
          { label: "Rất khó", value: "Rất khó" },
        ]}
      />

      <Button type="primary" onClick={addQuestion} style={{ marginLeft: 10 }}>
        Thêm câu hỏi
      </Button>

      <Table
        columns={columns}
        dataSource={questions}
        style={{ marginTop: 20 }}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
};

export default QuestionManager;