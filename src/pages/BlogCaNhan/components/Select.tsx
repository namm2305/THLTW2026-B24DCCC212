function SelectStatus({ value, onChange }: any) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All</option>
      <option value="draft">Nháp</option>
      <option value="published">Đã đăng</option>
    </select>
  );
}

export default SelectStatus;