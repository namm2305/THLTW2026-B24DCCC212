import { Input } from "antd";
import { useEffect, useState } from "react";

function SearchBox({ value, onChange }: any) {
  const [v, setV] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => onChange(v), 300);
    return () => clearTimeout(t);
  }, [v]);

  return (
    <Input.Search
      placeholder="Tìm kiếm bài viết..."
      value={v}
      onChange={(e) => setV(e.target.value)}
      style={{ marginBottom: 20 }}
    />
  );
}

export default SearchBox;