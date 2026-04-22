import React, { useState } from 'react';

type Post = {
  id: number;
  title: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  createdAt: string;
};

const initialPosts: Post[] = [
  { id: 1, title: 'Bài viết 1', tags: ['react'], status: 'published', views: 10, createdAt: '2024-04-01' },
  { id: 2, title: 'Bài viết 2', tags: ['js'], status: 'draft', views: 5, createdAt: '2024-04-02' },
];

export default function PostManage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);

  const filtered = posts.filter(p =>
    (status === 'all' || p.status === status) &&
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn chắc chắn muốn xóa?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleEdit = (post: Post) => {
    setEditPost(post);
    setShowForm(true);
  };

  const handleSave = (post: Post) => {
    if (editPost) {
      setPosts(posts.map(p => p.id === post.id ? post : p));
    } else {
      setPosts([{ ...post, id: Date.now(), views: 0, createdAt: new Date().toISOString() }, ...posts]);
    }
    setShowForm(false);
    setEditPost(null);
  };

  return (
    <div>
      <h2>Quản lý bài viết</h2>
      <input placeholder="Tìm kiếm tiêu đề" value={search} onChange={e => setSearch(e.target.value)} />
      <select value={status} onChange={e => setStatus(e.target.value as any)}>
        <option value="all">Tất cả</option>
        <option value="draft">Nháp</option>
        <option value="published">Đã đăng</option>
      </select>
      <button onClick={() => { setShowForm(true); setEditPost(null); }}>Thêm mới</button>
      <table border={1} cellPadding={4} style={{ marginTop: 12 }}>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Thẻ</th>
            <th>Lượt xem</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(post => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.status}</td>
              <td>{post.tags.join(', ')}</td>
              <td>{post.views}</td>
              <td>{post.createdAt}</td>
              <td>
                <button onClick={() => handleEdit(post)}>Sửa</button>
                <button onClick={() => handleDelete(post.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <PostForm post={editPost} onSave={handleSave} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function PostForm({ post, onSave, onClose }: { post: any, onSave: (p: Post) => void, onClose: () => void }) {
  const [form, setForm] = useState<Post>(post || { id: 0, title: '', tags: [], status: 'draft', views: 0, createdAt: '' });
  return (
    <div style={{ border: '1px solid #ccc', padding: 12, margin: 12 }}>
      <input placeholder="Tiêu đề" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Thẻ (phẩy)" value={form.tags.join(',')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()) })} />
      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
        <option value="draft">Nháp</option>
        <option value="published">Đã đăng</option>
      </select>
      <button onClick={() => onSave(form)}>Lưu</button>
      <button onClick={onClose}>Hủy</button>
    </div>
  );
}
