import { Card, Tag } from "antd";

const { Meta } = Card;

function PostCard({ post, onTagClick }: any) {
  return (
    <Card
      hoverable
      cover={<img src={post.image} />}
      style={{ borderRadius: 10 }}
    >
      <Meta
        title={post.title}
        description={post.summary}
      />

      <div style={{ marginTop: 10 }}>
        {post.tags.map((t: string) => (
          <Tag
            key={t}
            color="blue"
            onClick={(e) => {
              e.stopPropagation();
              onTagClick(t);
            }}
            style={{ cursor: "pointer" }}
          >
            #{t}
          </Tag>
        ))}
      </div>
    </Card>
  );
}

export default PostCard;