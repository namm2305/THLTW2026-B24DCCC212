import React from "react";
import { Button, Space } from "antd";
import { Choice } from "../index";

interface Props {
  playGame: (choice: Choice) => void;
}

const GameControls = ({ playGame }: Props) => {
  return (
    <Space>
      <Button onClick={() => playGame("Kéo")}>Kéo</Button>
      <Button onClick={() => playGame("Búa")}>Búa</Button>
      <Button onClick={() => playGame("Bao")}>Bao</Button>
    </Space>
  );
};

export default GameControls;