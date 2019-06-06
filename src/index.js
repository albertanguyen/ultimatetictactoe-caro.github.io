import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FacebookLogin from 'react-facebook-login';

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
    renderSquare(i) {
        

        return <Square
            getValue={this.props.squares[i]}
            onClick={() => this.props.tictactoeHandle(i)}
        />
    }

    render() {
        return (
            <div>
                <div>Timer: {this.props.timer}</div>
                <div className="status">{this.props.status}</div>
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
        )
    }
}

class Game extends Component {
    constructor(props) {
        super(props)
        this.state = {
            squares: Array(9).fill(null),
            XisNext: true,
            isLoggedin: false,
            userName: '',
            highScores: [],
            score: 0
        }
    }


    componentDidMount() {
        this.highScores()
    }

    tictactoeHandle(i) {
        const squareclone = this.state.squares.slice();

        if (!this.state.squares.some(square => square !== null)) {
           this.timer = setInterval(() =>
                this.setState(
                    { score: this.state.score + 1 }
                ),
                1000)
        }
           
        if (this.calculateWinner(squareclone) || squareclone[i]){
            return;
        }
        squareclone[i] = this.state.XisNext ? 'X' : 'O';
        this.setState({
            squares: squareclone,
            XisNext: !this.state.XisNext,
        });
    }

    calculateWinner(array) {
        const indexCombination = [
            [4, 0, 8],
            [4, 2, 6],
            [4, 1, 7],
            [4, 3, 5],
            [0, 3, 6],
            [0, 1, 2],
            [2, 5, 8],
            [6, 7, 8]
        ]

        for (let i = 0; i < indexCombination.length; i++) {
            const [loc1, loc2, loc3] = indexCombination[i] // loc1, loc2, loc3 are the indices of X or O on the canvas/board

            if (array[loc1] && array[loc1] === array[loc2] && array[loc2] === array[loc3]) {
                return array[loc2];
            }
        }

        return null;
    }

    responseFacebook(res) {
        this.setState(
                {
                    userName: res.name,
                    isLoggedin: true
                }
            )
    }


    renderLoginBtn() {
        return(
            <FacebookLogin
                appId="2451290521766300"
                fields={this.state.userName}
                textButton="Login with Tictactoe"
                callback={(res) => this.responseFacebook(res)}
            />
        )
    }

    renderBoard(status) {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        status={status}
                        squares={this.state.squares}
                        tictactoeHandle={(i) => this.tictactoeHandle(i)}
                        timer = {this.state.score}
                        highScores = {this.state.highScores}
                    />
                </div>
                <div className="game-info">
                    <div>Player: {this.state.userName}</div>
                    <ol>
                        {this.renderHighscores()}
                    </ol>
                </div>
            </div>
        );
    }

    renderHighscores() {
        return this.state.highScores.map(element => {
            return (
                <li>{element.player} wins in {element.score}</li>
            )
        })
    }

    async writeData() {
        let data = new URLSearchParams();
        data.append('player', this.state.userName);
        data.append('score', this.state.score);
        const url = `http://ftw-highscores.herokuapp.com/tictactoe-dev`;
        await fetch(url,
            {
                method: 'POST',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: data.toString(),
                json: true,
            }
        );
    }


    async highScores() {
        let url = 'http://ftw-highscores.herokuapp.com/tictactoe-dev'
        const req = await fetch(url)
        const jsonData = await req.json()

        this.setState(
            { highScores: jsonData.items}
        )
    }

    render() {
        const winner = this.calculateWinner(this.state.squares);
        const draw = this.state.squares.every(square => square !== null)
        let status;

        if (winner) {
            status = 'Winner is ' + winner;
            clearTimeout(this.timer)
            this.writeData()
        } 
        else if (draw) {
            status = 'It is a draw';
            clearTimeout(this.timer)
        }
        else {
            status = 'Next player is ' + (this.state.XisNext ? 'X' : 'O');
        }

        if (!this.state.isLoggedin) {
            return this.renderLoginBtn();
        } 
        if (this.state.isLoggedin) {
            return this.renderBoard(status);
            }

        }

    }

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

