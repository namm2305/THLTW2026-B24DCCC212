function Pagination({ total, pageSize, current, onChange }: any) {
  const totalPage = Math.ceil(total / pageSize);

  return (
    <div>
      {Array.from({ length: totalPage }).map((_, i) => (
        <button key={i} onClick={() => onChange(i + 1)}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;