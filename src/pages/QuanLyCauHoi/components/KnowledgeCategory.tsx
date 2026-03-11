import React, { useState } from "react";
import { Input, Button, List } from "antd";

const KnowledgeCategory: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  const addCategory = () => {
    if (!name.trim()) return;

    setCategories([...categories, name]);
    setName("");
  };

  return (
    <div>
      <Input
        placeholder="Tên khối kiến thức"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: 300 }}
      />

      <Button
        type="primary"
        onClick={addCategory}
        style={{ marginLeft: 10 }}
      >
        Thêm
      </Button>

      <List
        bordered
        style={{ marginTop: 20 }}
        dataSource={categories}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </div>
  );
};

export default KnowledgeCategory;