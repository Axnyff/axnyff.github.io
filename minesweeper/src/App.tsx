import React, { useMemo, useState, useEffect } from "react";
import styled, { css } from "styled-components";

const ROWS = 8;
const COLUMNS = 8;
const NB_MINES = 10;

const getKey = (x: number, y: number) => `${x}_${y}`;

const Row = styled.div`
  display: flex;
`;

const Cell = styled.button<{
  hasFlag?: boolean;
  hasMine?: boolean;
  isRevealed?: boolean;
}>`
  cursor: pointer;
  position: relative;
  ${({ hasMine }) =>
    hasMine &&
    css`
      background: green;
    `}
  ${({ isRevealed }) =>
    isRevealed &&
    css`
      background: white;
      cursor: default;
    `}
  ${({ hasFlag }) =>
    hasFlag &&
    css`
      ::before {
        content: "";
        position: absolute;
        background-color: red;
        width: 10px;
        height: 6px;
        top: 8px;
        left: calc(50% - 1px);
      }
      ::after {
        content: "";
        position: absolute;
        background-color: black;
        width: 1px;
        height: 15px;
        top: 8px;
        left: calc(50% - 2px);
      }
    `}
  border: 1px solid;
  width: 30px;
  height: 30px;
  margin: 1px;
`;

const randInt = (max: number) => Math.floor(Math.random() * max);

const generateMines = (startingPoint: string) => {
  let generatedMines: string[] = [];
  while (generatedMines.length < NB_MINES) {
    const row = randInt(ROWS);
    const column = randInt(COLUMNS);
    const key = getKey(row, column);
    if (key !== startingPoint && !generatedMines.includes(key)) {
      generatedMines.push(key);
    }
  }
  return generatedMines;
};

const App = () => {
  const [flags, setFlags] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [mines, setMines] = useState<string[]>([]);

  const handleClickCell = (key: string) => {
    if (!mines.length) {
      const newMines: string[] = generateMines(key);
      setMines(generateMines(key));
      setRevealed([...revealed, key]);
    } else if (mines.includes(key)) {
      console.log("OH NOES");
    } else {
      setRevealed([...revealed, key]);
    }
  };

  const counts = useMemo(() => {
    const res: { [K: string]: number } = {};

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < ROWS; j++) {
        let count = 0;
        for (let x = i - 1; x <= i + 1; x++) {
          for (let y = j - 1; y <= j + 1; y++) {
            if ((x !== i || y !== j) && mines.includes(getKey(x, y))) {
              count++;
            }
          }
        }
        res[getKey(i, j)] = count;
      }
    }
    return res;
  }, [mines]);

  console.log(revealed);
  console.log(revealed);
  return (
    <div>
      {Array.from({ length: ROWS }, (_, i) => (
        <Row key={i}>
          {Array.from({ length: COLUMNS }, (_, j) => {
            const key = getKey(i, j);
            const isRevealed = revealed.includes(key);
            return (
              <Cell
                type="button"
                hasMine={mines.includes(key)}
                hasFlag={flags.includes(key)}
                isRevealed={isRevealed}
                onClick={() => handleClickCell(key)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (isRevealed) {
                    return;
                  }
                  if (flags.includes(key)) {
                    setFlags(flags.filter((flag) => flag !== key));
                  } else {
                    setFlags([...flags, key]);
                  }
                }}
                key={key}
              >
                {isRevealed && counts[key] !== 0 ? counts[key] : ""}
              </Cell>
            );
          })}
        </Row>
      ))}
    </div>
  );
};

export default App;
