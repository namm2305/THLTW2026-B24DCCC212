import { useEffect, useState } from "react";

function SearchBox({ value, onChange }: any) {
  const [v, setV] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => onChange(v), 300);
    return () => clearTimeout(t);
  }, [v]);

  return <input value={v} onChange={(e) => setV(e.target.value)} />;
}

export default SearchBox;