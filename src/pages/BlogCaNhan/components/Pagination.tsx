import { Pagination } from "antd";

function Paging({ total, pageSize, current, onChange }: any) {
  return (
    <Pagination
      current={current}
      total={total}
      pageSize={pageSize}
      onChange={onChange}
      style={{ marginTop: 20, textAlign: "center" }}
    />
  );
}

export default Paging;