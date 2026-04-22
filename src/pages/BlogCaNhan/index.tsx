import { useState } from "react";
import { Row, Col, Table, Button, Input } from "antd";

import PostCard from "./components/PostCard";
import SearchBox from "./components/SearchBox";
import Pagination from "./components/Pagination";
import FormPost from "./components/Form";
import SelectStatus from "./components/Select";
import Detail from "./Detail";

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
      <h1>Trang chủ</h1>

      <SearchBox value={keyword} onChange={setKeyword} />

      {tagFilter && (
        <p>
          Tag: <b>{tagFilter}</b>{" "}
          <Button size="small" onClick={() => setTagFilter("")}>
            X
          </Button>
        </p>
      )}

      <Row gutter={[16, 16]}>
        {paginatedPosts.map((p) => (
          <Col xs={24} sm={12} md={8} key={p.id}>
            <div
              onClick={() => {
                p.views += 1;
                setSelected(p);
                setPage("detail");
              }}
            >
              <PostCard post={p} onTagClick={setTagFilter} />
            </div>
          </Col>
        ))}
      </Row>

      <Pagination
        total={filteredPosts.length}
        pageSize={pageSize}
        current={currentPage}
        onChange={setCurrentPage}
      />
    </div>
  );

  const renderAdmin = () => {
    const data = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(keyword.toLowerCase()) &&
        (statusFilter ? p.status === statusFilter : true)
    );

    const columns = [
      { title: "Tiêu đề", dataIndex: "title" },
      { title: "Trạng thái", dataIndex: "status" },
      {
        title: "Thẻ",
        render: (p: Post) => p.tags.join(", "),
      },
      { title: "Lượt xem", dataIndex: "views" },
      {
        title: "Ngày",
        render: (p: Post) =>
          new Date(p.createdAt).toLocaleDateString(),
      },
      {
        title: "Action",
        render: (p: Post) => (
          <Button
            danger
            onClick={() =>
              setPosts((prev) =>
                prev.filter((x) => x.id !== p.id)
              )
            }
          >
            Xóa
          </Button>
        ),
      },
    ];

    return (
      <div>
        <h1>Quản lý bài viết</h1>

        <Input
          placeholder="Tìm tiêu đề..."
          style={{ marginBottom: 10 }}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <SelectStatus value={statusFilter} onChange={setStatusFilter} />

        <FormPost
          onSubmit={(p: Post) =>
            setPosts((prev) => [...prev, p])
          }
        />

        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          style={{ marginTop: 20 }}
        />
      </div>
    );
  };

  const renderTags = () => {
    const tags = Array.from(
      new Set(posts.flatMap((p) => p.tags))
    );

    return (
      <div>
        <h1>Tags</h1>

        {tags.map((t) => (
          <Button
            key={t}
            style={{ marginRight: 8, marginBottom: 8 }}
            onClick={() => {
              setTagFilter(t);
              setPage("home");
            }}
          >
            #{t}
          </Button>
        ))}
      </div>
    );
  };

  const renderAbout = () => (
    <div>
      <h1>Giới thiệu</h1>
      <p>Tạ Nam</p>
      <p>React Developer</p>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <Button onClick={() => setPage("home")}>Home</Button>
        <Button onClick={() => setPage("admin")}>Admin</Button>
        <Button onClick={() => setPage("tags")}>Tags</Button>
        <Button onClick={() => setPage("about")}>About</Button>
      </div>

      {page === "home" && renderHome()}
      {page === "detail" && selected && (
        <Detail
          post={selected}
          posts={posts}
          onBack={() => setPage("home")}
        />
      )}
      {page === "admin" && renderAdmin()}
      {page === "tags" && renderTags()}
      {page === "about" && renderAbout()}
    </div>
  );
}

export default BlogPage;