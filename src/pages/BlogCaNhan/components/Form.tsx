import { useState } from "react";

function FormPost({ onSubmit }: any) {
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    image: "",
    tags: "",
    author: "",
    status: "published"
  });

  const handleSubmit = () => {
    if (!form.title) return alert("Nhập tiêu đề");

    onSubmit({
      id: Date.now(),
      title: form.title,
      summary: form.summary,
      content: form.content,
      image: form.image || "https://via.placeholder.com/300",
      tags: form.tags.split(",").map(t => t.trim()),
      author: form.author || "Admin",
      createdAt: new Date().toISOString(),
      views: 0,
      status: form.status
    });

    setForm({
      title: "",
      summary: "",
      content: "",
      image: "",
      tags: "",
      author: "",
      status: "published"
    });
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      padding: 16,
      marginBottom: 20,
      borderRadius: 8
    }}>
      <h3>Thêm bài viết</h3>

      <input placeholder="Tiêu đề"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input placeholder="Mô tả"
        value={form.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })}
      />

      <input placeholder="Ảnh URL"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <input placeholder="Tags (react, js)"
        value={form.tags}
        onChange={(e) => setForm({ ...form, tags: e.target.value })}
      />

      <input placeholder="Tác giả"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />

      <textarea placeholder="Nội dung"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <button onClick={handleSubmit}>➕ Thêm bài</button>
    </div>
  );
}

export default FormPost;