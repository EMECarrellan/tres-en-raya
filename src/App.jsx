import { useState } from 'react'
import './App.css'
import confetti from 'canvas-confetti'

import { Square } from './components/Square.jsx'
import { TURNS, initialTurn } from './constants.js'
import { checkWinnerFrom, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal.jsx'

function App() {
  const [board, setBoard] = useState( () => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage
        ? JSON.parse(boardFromStorage)
        : Array(9).fill(null)
  }
)
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? initialTurn[Math.floor(Math.random() * 2)]
})

  const [score, setScore] = useState(() => {
    const scoreFromStorage = window.localStorage.getItem('score')
    return scoreFromStorage ? JSON.parse(scoreFromStorage) : { x: 0, y: 0 }
  })

  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    // El ganador cede el turno al perdedor
    setTurn(winner === TURNS.X ? TURNS.O : TURNS.X)
    setWinner(null)
    
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const resetScore = () => {
    setBoard(Array(9).fill(null))
    setScore({x: 0, y: 0})
    
    
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
    window.localStorage.removeItem('score')
  }

    const updateBoard = (index) => {

    // No actualizar la posición si contiene algo
    if(board[index] || winner) return
    // Actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // Revisar posible ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
        confetti()
        setWinner(newWinner)
        
        const newScore = {
          x: score.x + (newWinner === TURNS.X ? 1 : 0),
          y: score.y + (newWinner === TURNS.O ? 1 : 0)
        }
        setScore(newScore)

        window.localStorage.setItem('score', JSON.stringify(newScore))
    } else if (checkEndGame(newBoard)) {
        setWinner(false)
    }
    // Cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // Guardar la partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
  }

  return (
    <main className='board'>
        <h1>Tres en Raya</h1>
        <button onClick={resetScore}>Reset score</button>
        <section className='game'>
            {
                board.map((square, index) => {
                    return (
                        <Square
                            key={index}
                            index={index}
                            updateBoard={updateBoard}
                        >
                        {square}
                        </Square>
                    )
                })
            }
        </section>

        <section className='turn'>
            <Square isSelected={turn === TURNS.X}>
                {TURNS.X}
            </Square>
            <Square isSelected={turn === TURNS.O}>
                {TURNS.O}
            </Square>
        </section>

        <section className='score'>
          <h3>{score.x}</h3>
          <span>-</span>
          <h3>{score.y}</h3>
        </section>

        <WinnerModal winner={winner} resetGame={resetGame}/>
    </main>
  )
}

export default App
