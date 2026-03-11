import React, { useState } from "react";
import { Card, Typography } from "antd";

import GameControls from "./components/GameControls";
import GameHistory from "./components/GameHistory";
import GameResult from "./components/GameResult";

const { Title } = Typography;

export type Choice = "Kéo" | "Búa" | "Bao";

interface HistoryItem {
  player: Choice;
  computer: Choice;
  result: string;
}

const choices: Choice[] = ["Kéo", "Búa", "Bao"];

const getResult = (player: Choice, computer: Choice) => {
  if (player === computer) return "Hòa";

  if (
    (player === "Kéo" && computer === "Bao") ||
    (player === "Búa" && computer === "Kéo") ||
    (player === "Bao" && computer === "Búa")
  ) {
    return "Thắng";
  }

  return "Thua";
};

const OanTuTiPage = () => {
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const playGame = (playerChoice: Choice) => {
    const computer =
      choices[Math.floor(Math.random() * choices.length)];

    const gameResult = getResult(playerChoice, computer);

    setComputerChoice(computer);
    setResult(gameResult);

    setHistory([
      ...history,
      {
        player: playerChoice,
        computer: computer,
        result: gameResult,
      },
    ]);
  };

  return (
    <Card>
      <Title level={2}>Trò chơi Oẳn Tù Tì</Title>

      <GameControls playGame={playGame} />

      <GameResult computerChoice={computerChoice} result={result} />

      <GameHistory history={history} />
    </Card>
  );
};

export default OanTuTiPage;