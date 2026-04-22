function PostCard({ post, onTagClick }: any) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 12,
      cursor: "pointer"
    }}>
      <img src={post.image} width="100%" style={{ borderRadius: 6 }} />

      <h3>{post.title}</h3>
      <p>{post.summary}</p>

      <small>
        {post.author} • {new Date(post.createdAt).toLocaleDateString()}
      </small>

      <div style={{ marginTop: 8 }}>
        {post.tags.map((t: string) => (
          <span
            key={t}
            onClick={(e) => {
              e.stopPropagation();
              onTagClick(t);
            }}
            style={{
              marginRight: 6,
              padding: "2px 6px",
              background: "#eee",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PostCard;