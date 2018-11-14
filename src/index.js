import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { number } from "prop-types";

// function Square(props) {
//   return (
//     <button
//       className="square"
//       onClick={ props.onClick }
//     >
//       {props.value}
//     </button>
//   );
// }

class Square extends React.Component {
  render() {
    const className = this.props.class;

    return (
      <button className={className} onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, winning) {
    console.log(winning);
    return (
      <Square
        key={i}
        class={winning}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const square = [];
    var num = 0;

    for (var i = 1; i <= 3; i++) {
      const row = [];
      for (var j = 1; j <= 3; j++) {
        if (
          winnerObject.winner !== -1 &&
          (winnerObject.squares[0] === num ||
            winnerObject.squares[1] === num ||
            winnerObject.squares[2] === num)
        ) {
          row.push(this.renderSquare(num, "square winning"));
        } else {
          row.push(this.renderSquare(num, "square"));
        }
        num++;
      }
      square.push(
        <div key={num} className="board-row">
          {row}
        </div>
      );
    }
    return <div>{square}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          x: null,
          y: null
        }
      ],
      stepNumer: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const x = convertSquareToX(i);
    const y = convertSquareToY(i);

    const history = this.state.history.slice(0, this.state.stepNumer + 1, x, y);
    const current = history[history.length - 1];

    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "0";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          x: x,
          y: y
        }
      ]),
      stepNumer: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumer: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumer];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + " (" + step.x + ", " + step.y + ")"
        : "Go to game start";

      var className;

      if (step.squares === current.squares) {
        className = "currentClass";
      } else {
        className = "notCurrentClass";
      }

      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "0");
    }

    return (
      <div className="game">
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
      </div>
    );
  }
}

function convertSquareToY(i) {
  if (i === 0 || i === 1 || i === 2) {
    return 0;
  } else if (i === 3 || i === 4 || i === 5) {
    return 1;
  } else if (i === 6 || i === 7 || i === 8) {
    return 2;
  }
}

function convertSquareToX(i) {
  if (i === 0 || i === 3 || i === 6) {
    return 0;
  } else if (i === 1 || i === 4 || i === 7) {
    return 1;
  } else if (i === 2 || i === 5 || i === 8) {
    return 2;
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winnerObject.winner = squares[a];
      winnerObject.squares = [a, b, c];
      return winnerObject;
    }
  }

  winnerObject.winner = -1;
  return null;
}

const winnerObject = {
  winner: null,
  squares: [null, null, null]
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
