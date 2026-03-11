import React from "react";
import { List } from "antd";

interface Props {
  history: any[];
}

const GameHistory = ({ history }: Props) => {
  return (
    <List
      header="Lịch sử"
      bordered
      dataSource={history}
      renderItem={(item) => (
        <List.Item>
          Bạn: {item.player} | Máy: {item.computer} → {item.result}
        </List.Item>
      )}
      style={{ marginTop: 20 }}
    />
  );
};

export default GameHistory;