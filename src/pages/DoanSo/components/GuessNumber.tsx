import { useState } from "react";
import { Card, InputNumber, Button, Typography, Space, message } from "antd";

const { Title, Text } = Typography;

const GuessNumber = () => {
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number>(10);
  const [result, setResult] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGuess = () => {
    if (guess === null) {
      message.warning("Vui lòng nhập số!");
      return;
    }

    if (guess === randomNumber) {
      setResult("Chúc mừng! Bạn đã đoán đúng!");
      setGameOver(true);
    } else if (guess < randomNumber) {
      setResult("Bạn đoán quá thấp!");
    } else {
      setResult("Bạn đoán quá cao!");
    }

    setAttempts((prev) => prev - 1);

    if (attempts - 1 === 0 && guess !== randomNumber) {
      setResult(`Bạn đã hết lượt! Số đúng là ${randomNumber}`);
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setGuess(null);
    setAttempts(10);
    setResult("");
    setGameOver(false);
  };

  return (
    <Card style={{ width: 400, margin: "50px auto", textAlign: "center" }}>
      <Title level={3}>Trò Chơi Đoán Số</Title>
      <Text>Đoán một số từ 1 đến 100</Text>

      <Space direction="vertical" style={{ marginTop: 20 }}>
        <InputNumber
          min={1}
          max={100}
          value={guess}
          onChange={(value) => setGuess(value)}
          disabled={gameOver}
        />

        <Button type="primary" onClick={handleGuess} disabled={gameOver}>
          Đoán
        </Button>

        <Text strong>Số lượt còn lại: {attempts}</Text>

        <Text>{result}</Text>

        {gameOver && <Button onClick={resetGame}>Chơi lại</Button>}
      </Space>
    </Card>
  );
};

export default GuessNumber;