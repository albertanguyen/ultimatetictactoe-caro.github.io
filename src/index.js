import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Parent: Board, Child: Square */
/* Pass state of Broad to props of Square */
/* getValue and onClick are two attributes for Square props*/
/* Main idea: 
    * Condition: if output is [X,X,X] or [O,O,O] => win
    * In order words: if all elements in the array of 3 are the same => win 
    * Not X and O in random positions win the game
    * Hardcode: There is a list of all index/position combinations (horizontal, vertical and diagonal lines)
    * If the values from squares array at those positions are the same => win
*/


const Square = ({ getValue, onClick }) => (
        <button 
        className='square'
        onClick = { onClick }
        > 
        { getValue }
        </button>
    )

class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {
            squares: Array(9).fill(null),
            XisNext: true,
        }
    }

    tictactoeHandle(i) {
        const squareclone = this.state.squares.slice();
        if (this.calculateWinner(this.state.squares) || this.state.squares[i]) {
            return;
        }
        squareclone[i] = this.state.XisNext ? 'X' : 'O';
        this.setState({ 
            squares: squareclone,
            XisNext: !this.state.XisNext
            });
    }

    calculateWinner(array) {
        const indexCombination = [
            [4,0,8],
            [4,2,6],
            [4,1,7],
            [4,3,5],
            [0,3,6],
            [0,1,2],
            [2,5,8],
            [6,7,8]
        ]

        for (let i = 0; i < indexCombination.length; i++) {
            const [loc1, loc2, loc3] = indexCombination[i] // loc1, loc2, loc3 are the indices of X or O on the canvas/board

            if (array[loc1] && array[loc1] === array[loc2] && array[loc2] === array[loc3]) {
                return array[loc2];

        }
    }
        // indexCombination.forEach( element => {
            // const [loc1, loc2, loc3 ] = element // loc1, loc2, loc3 are the indices of X or O on the canvas/board
            
            // if ( array[loc1] && array[loc1] === array[loc2] && array[loc2] === array[loc3]) {
            //     return array[loc2];
        //     }
        // });

        return null;
    }

    renderSquare(i) {

        return <Square 
            getValue = { this.state.squares[i] }
            onClick = { () => this.tictactoeHandle(i) }
        />;
    }

    render() {
        const winner = this.calculateWinner(this.state.squares);
        console.log(winner)
        let status;
        if (winner) {
            status = 'Winner is ' + winner;
        } else {
            status = 'Next player is ' + (this.state.XisNext ? 'X' : 'O');
        }


        return (
            <div>
                <div className="status">{status}</div>
                <div className="status">{winner}</div>

                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

