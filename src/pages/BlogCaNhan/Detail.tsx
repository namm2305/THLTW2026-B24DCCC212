import { Button, Tag } from "antd";

function Detail({ post, posts, onBack }: any) {
  const related = posts.filter(
    (p: any) =>
      p.id !== post.id &&
      p.tags.some((t: string) => post.tags.includes(t))
  );

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <Button onClick={onBack}>Quay lại</Button>

      <h1>{post.title}</h1>

      <p>
        {post.author} |{" "}
        {new Date(post.createdAt).toLocaleDateString()} |{" "}
        {post.views}
      </p>

      <img src={post.image} width="100%" />

      <div style={{ marginTop: 10 }}>
        {post.tags.map((t: string) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>

      <div
        style={{ marginTop: 20 }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <h3 style={{ marginTop: 30 }}>Bài viết liên quan</h3>

      {related.map((p: any) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}

export default Detail;