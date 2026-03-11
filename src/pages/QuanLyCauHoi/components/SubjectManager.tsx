import React, { useState } from "react";
import { Input, Button, Table } from "antd";

interface Subject {
  key: number;
  code: string;
  name: string;
  credit: number;
}

export default function SubjectManager() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [name, setName] = useState("");

  const addSubject = () => {
    if (!name) return;

    const newSubject: Subject = {
      key: Date.now(),
      code: "MH" + (subjects.length + 1),
      name,
      credit: 3,
    };

    setSubjects([...subjects, newSubject]);
    setName("");
  };

  const columns = [
    {
      title: "Mã môn",
      dataIndex: "code",
    },
    {
      title: "Tên môn",
      dataIndex: "name",
    },
    {
      title: "Tín chỉ",
      dataIndex: "credit",
    },
  ];

  return (
    <div>
      <Input
        placeholder="Tên môn học"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: 300 }}
      />

      <Button type="primary" onClick={addSubject} style={{ marginLeft: 10 }}>
        Thêm môn
      </Button>

      <Table
        columns={columns}
        dataSource={subjects}
        style={{ marginTop: 20 }}
        pagination={false}
      />
    </div>
  );
}