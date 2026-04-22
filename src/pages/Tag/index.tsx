import React, { useState } from 'react';

const initialTags = [
  { name: 'react', count: 5 },
  { name: 'js', count: 3 },
  { name: 'typescript', count: 2 },
];

export default function TagManage() {
  const [tags, setTags] = useState(initialTags);
  const [editing, setEditing] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input && !tags.find(t => t.name === input)) {
      setTags([...tags, { name: input, count: 0 }]);
      setInput('');
    }
  };

  const handleEdit = (name: string) => {
    setEditing(name);
    setInput(name);
  };

  const handleSave = () => {
    setTags(tags.map(t => t.name === editing ? { ...t, name: input } : t));
    setEditing(null);
    setInput('');
  };

  const handleDelete = (name: string) => {
    setTags(tags.filter(t => t.name !== name));
  };

  return (
    <div>
      <h2>Quản lý thẻ</h2>
      <ul>
        {tags.map(tag => (
          <li key={tag.name}>
            {editing === tag.name ? (
              <>
                <input value={input} onChange={e => setInput(e.target.value)} />
                <button onClick={handleSave}>Lưu</button>
              </>
            ) : (
              <>
                <b>#{tag.name}</b> ({tag.count} bài)
                <button onClick={() => handleEdit(tag.name)}>Sửa</button>
                <button onClick={() => handleDelete(tag.name)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Thêm thẻ mới" />
      <button onClick={handleAdd}>Thêm</button>
    </div>
  );
}
