import React, { useState } from "react";
import { Button, List } from "antd";

const ExamGenerator: React.FC = () => {
  const [exam, setExam] = useState<string[]>([]);

  const generate = () => {
    const sample = [
      "Câu 1: Trình bày React là gì?",
      "Câu 2: UmiJS hoạt động như thế nào?",
      "Câu 3: Ant Design dùng để làm gì?",
    ];

    setExam(sample);
  };

  return (
    <>
      <Button type="primary" onClick={generate}>
        Tạo đề thi
      </Button>

      <List
        bordered
        style={{ marginTop: 20 }}
        dataSource={exam}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </>
  );
};

export default ExamGenerator;