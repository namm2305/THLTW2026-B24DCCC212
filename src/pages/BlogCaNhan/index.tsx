import { useState } from "react";
import PostCard from "./components/PostCard";
import SearchBox from "./components/SearchBox";
import Pagination from "./components/Pagination";
import FormPost from "./components/Form";
import SelectStatus from "./components/Select";
import Detail from "./Detail";

// ================= TYPE =================
export interface Post {
  id: number;
  title: string;
  summary: string;
  content: string;
  image: string;
  tags: string[];
  author: string;
  createdAt: string;
  views: number;
  status: "draft" | "published";
}

type Page = "home" | "detail" | "admin" | "tags" | "about";

// ================= MAIN =================
function BlogPage() {
  const [page, setPage] = useState<Page>("home");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<Post | null>(null);

  const [keyword, setKeyword] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 9;

  
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(keyword.toLowerCase()) &&
      (tagFilter ? p.tags.includes(tagFilter) : true)
  );

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderHome = () => (
    <div>
      <h1> Trang chủ</h1>

      <SearchBox value={keyword} onChange={setKeyword} />

      {tagFilter && (
        <p>
           Đang lọc theo tag: <b>{tagFilter}</b>
          <button onClick={() => setTagFilter("")}>X</button>
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
          gap: 16,
        }}
      >
        {paginatedPosts.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              p.views += 1;
              setSelected(p);
              setPage("detail");
            }}
          >
            <PostCard post={p} onTagClick={setTagFilter} />
          </div>
        ))}
      </div>

      <Pagination
        total={filteredPosts.length}
        pageSize={pageSize}
        current={currentPage}
        onChange={setCurrentPage}
      />
    </div>
  );

  
  const renderDetail = () => {
    if (!selected) return null;

    return (
      <Detail
        post={selected}
        posts={posts}
        onBack={() => setPage("home")}
      />
    );
  };

  
  const renderAdmin = () => {
    const data = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase()) &&
        (statusFilter ? p.status === statusFilter : true)
    );

    return (
      <div>
        <h1> Quản lý bài viết</h1>

        <input
          placeholder="Tìm tiêu đề..."
          onChange={(e) => setKeyword(e.target.value)}
        />

        <SelectStatus value={statusFilter} onChange={setStatusFilter} />

        <FormPost
          onSubmit={(p: Post) =>
            setPosts((prev) => [...prev, p])
          }
        />

        <table border={1} width="100%" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Thẻ</th>
              <th>Lượt xem</th>
              <th>Ngày</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.status}</td>
                <td>{p.tags.join(", ")}</td>
                <td>{p.views}</td>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() =>
                      setPosts((prev) =>
                        prev.filter((x) => x.id !== p.id)
                      )
                    }
                  >
                     Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ================= TAG =================
  const renderTags = () => {
    const tags = Array.from(
      new Set(posts.flatMap((p) => p.tags))
    );

    return (
      <div>
        <h1> Tags</h1>

        {tags.map((t) => (
          <div
            key={t}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setTagFilter(t);
              setPage("home");
            }}
          >
            #{t}
          </div>
        ))}
      </div>
    );
  };

  // ================= ABOUT =================
  const renderAbout = () => (
    <div>
      <h1> Giới thiệu</h1>
     
      <p>React Developer</p>
      
    </div>
  );

  
  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("admin")}>Admin</button>
        <button onClick={() => setPage("tags")}>Tags</button>
        <button onClick={() => setPage("about")}>About</button>
      </nav>

      {page === "home" && renderHome()}
      {page === "detail" && renderDetail()}
      {page === "admin" && renderAdmin()}
      {page === "tags" && renderTags()}
      {page === "about" && renderAbout()}
    </div>
  );
}

export default BlogPage;