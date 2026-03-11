import React from "react";
import { Card, Typography } from "antd";
import { Choice } from "../index";

const { Text } = Typography;

interface Props {
  computerChoice: Choice | null;
  result: string;
}

const GameResult = ({ computerChoice, result }: Props) => {
  return (
    <Card style={{ marginTop: 30 }}>
      <Text>Máy chọn: {computerChoice || "chưa có"}</Text>
      <br />
      <Text>Kết quả: {result}</Text>
    </Card>
  );
};

export default GameResult;