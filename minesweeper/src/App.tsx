import React, { useMemo, useState, useEffect } from "react";
import styled, { css } from "styled-components";

const ROWS = 8;
const COLUMNS = 8;
const NB_MINES = 10;

const getKey = (x: number, y: number) => `${x}_${y}`;

const getCoords = (key: string) => {
  const [x, y] = key.split("_");
  return [parseInt(x, 10), parseInt(y, 10)];
};

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
  border: 1px solid;
  width: 30px;
  height: 30px;
  margin: 1px;
  ${({ hasMine }) =>
    hasMine &&
    css`
      background: red;
    `}
  ${({ isRevealed }) =>
    isRevealed &&
    css`
      border: 0 px;
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

const getRevealed = (startPoint: string, count: { [K: string]: number }) => {
  if (count[startPoint] !== 0) {
    return [startPoint];
  }

  const revealed = [startPoint];
  const toExplore = [startPoint];

  while (toExplore.length) {
    let item = toExplore.pop()!;
    const [x, y] = getCoords(item);
    [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ].forEach(([x, y]) => {
      const key = getKey(x, y);
      if (count[key] !== undefined && !revealed.includes(key)) {
        revealed.push(key);
        if (count[key] === 0) {
          toExplore.push(key);
        }
      }
    });
  }
  return revealed;
};

const computeCounts = (mines: string[]) => {
  const res: { [K: string]: number } = {};

  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLUMNS; j++) {
      let count = 0;
      for (let x = i - 1; x <= i + 1; x++) {
        for (let y = j - 1; y <= j + 1; y++) {
          if (x === i && y === j) {
            continue;
          }
          if (mines.includes(getKey(x, y))) {
            count++;
          }
        }
      }
      res[getKey(i, j)] = count;
    }
  }
  return res;
};

const App = () => {
  const [flags, setFlags] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [mines, setMines] = useState<string[]>([]);
  const [defeat, setDefeat] = useState(false);

  const counts = useMemo(() => {
    return computeCounts(mines);
  }, [mines]);

  const handleClickCell = (key: string) => {
    if (!mines.length) {
      const newMines: string[] = generateMines(key);
      setMines(newMines);
      setRevealed([...revealed, ...getRevealed(key, computeCounts(newMines))]);
    } else if (mines.includes(key)) {
      setDefeat(true);
    } else {
      setRevealed([...revealed, ...getRevealed(key, counts)]);
    }
  };

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
                hasMine={defeat && mines.includes(key)}
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
                {isRevealed && counts[key] !== 0 && counts[key]}
              </Cell>
            );
          })}
        </Row>
      ))}
    </div>
  );
};

export default App;
