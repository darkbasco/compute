import React, {Component} from "react"
import armsup from "./comp_armsup.png"
import baby from "./comp_baby.png"
import barbell from "./comp_barbell.png"
import caveman from "./comp_caveman.png"
import cena from "./comp_cena.png"
import hulk from "./comp_hulk.png"
import thumbsup from "./comp_thumbsup.png"
import oldguy from "./comp_oldguy.png"
import deadlift from "./comp_deadlift.png"
// import geek from "./comp_geek.png"
import weak from "./too-weak-2.png"
import rock from "./comp_rock2.png"
import dumbellsilver from "./dumbell_silver.png"
import plus from "./sign_plus.png"
import minus from "./sign_minus.png"
import mult from "./sign_mult.png"
import divi from "./sign_divi.png"
import equal from "./sign_equal.png"
import "./App.css"
const pjson = require("../package.json")

// const first = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const first = [6, 7, 8]
const second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
let operations = ["plus", "minus", "mult", "divi"]
let waitTime = 7000

class Problem {
    constructor(problem, answer, correct) {
        this.problem = problem
        this.answer = answer
        this.correct = correct
        console.log("PROBLEM CONSTRUCT", problem, answer, correct)
    }
}

class App extends Component {
    constructor() {
        super()
        this.state = this.initGame()
        console.log("APP CONSTRUCT", this.state)
    }

    initGame = () => {
        return {
            probSet: this.generateProblemSet(first, second, operations),
            keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            currentProblem: null,
            currentAnswer: null,
            currentIndex: null,
            notification: false,
            history: []
        }
    }

    generateProblemSet = (first, second, third) =>
        first.reduce((acc_a, curr_a) => {
            return acc_a.concat(
                second.reduce((acc_b, curr_b) => {
                    return acc_b.concat(
                        third.reduce((acc_c, curr_c) => {
                            if (curr_c === "plus") {
                                return acc_c.concat({
                                    curr_a,
                                    curr_b,
                                    curr_c,
                                    answer: this.getAnswer(
                                        curr_a,
                                        curr_b,
                                        curr_c
                                    )
                                })
                            } else if (curr_c === "minus") {
                                if (curr_b <= curr_a) {
                                    return acc_c.concat({
                                        curr_a,
                                        curr_b,
                                        curr_c,
                                        answer: this.getAnswer(
                                            curr_a,
                                            curr_b,
                                            curr_c
                                        )
                                    })
                                } else {
                                    return acc_c
                                }
                            } else if (curr_c === "mult") {
                                return acc_c.concat({
                                    curr_a,
                                    curr_b,
                                    curr_c,
                                    answer: this.getAnswer(
                                        curr_a,
                                        curr_b,
                                        curr_c
                                    )
                                })
                            } else if (curr_c === "divi") {
                                if (
                                    curr_b <= curr_a &&
                                    curr_a % curr_b === 0 &&
                                    !(curr_a === 0 && curr_b === 0)
                                ) {
                                    return acc_c.concat({
                                        curr_a,
                                        curr_b,
                                        curr_c,
                                        answer: this.getAnswer(
                                            curr_a,
                                            curr_b,
                                            curr_c
                                        )
                                    })
                                } else {
                                    return acc_c
                                }
                            } else {
                                return acc_c
                            }
                        }, [])
                    )
                }, [])
            )
        }, [])

    getInitialAnswer = () => "?"

    showAnswer = x => {
        this.setState(prevState => {
            return {currentAnswer: x}
        })
    }

    shuffleCurrentProblem = answeredPrevious => {
        this.setState(prevState => {
            const probIndex = Math.floor(
                Math.random() * prevState.probSet.length
            )
            console.log(
                "shuffleCurrentProblem",
                probIndex,
                this.state.probSet.length,
                prevState.probSet.length,
                answeredPrevious
            )

            return {
                currentProblem: prevState.probSet[probIndex],
                currentAnswer: null,
                currentIndex: probIndex,
                history: [
                    ...prevState.history,
                    new Problem(
                        prevState.currentProblem,
                        prevState.currentAnswer,
                        answeredPrevious
                    )
                ]
            }
        })
    }

    removeCurrentProblem = () => {
        this.setState(prevState => {
            const filteredArray = prevState.probSet.filter(
                item => item !== prevState.currentProblem
            )

            return {
                probSet: filteredArray ? filteredArray : prevState.probSet
            }
        })
    }

    answerTimer = prob => {
        console.log("STARTING TIMER")
        setTimeout(() => {
            if (prob === this.state.currentProblem) {
                console.log("SHOW ANSWER", prob)
                this.showAnswer(`(${prob.answer})`)

                setTimeout(() => {
                    console.log("SHUFFLE")
                    this.shuffleCurrentProblem(false)
                }, 2000)
            }
        }, waitTime)
    }

    updateAnswer = answer => {
        this.setState(prevState => {
            const newAnswer = this.buildAnswer(prevState.currentAnswer, answer)
            console.log("UPDATE", prevState.currentProblem, newAnswer)
            return {
                currentAnswer: newAnswer,
                notification: prevState.currentProblem.answer === newAnswer
            }
        })
    }

    buildAnswer = (prevAnswer, currAnswer) => {
        console.log("buildAnswer", prevAnswer, currAnswer)
        if (prevAnswer >= 0) {
            return prevAnswer * 10 + currAnswer
        } else {
            return currAnswer
        }
    }

    getAnswer = (a, b, c) => {
        if (c === "plus") {
            return a + b
        } else if (c === "minus") {
            return a - b
        } else if (c === "mult") {
            return a * b
        } else if (c === "divi") {
            return a / b
        } else {
            throw new Error(`Can't compute answer: ${a}, ${b}, ${c}`)
        }
    }

    checkAnswer = (answer, correctAnswer) => {
        console.log("checkAnswer", answer, correctAnswer)
        if (correctAnswer === answer) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            return true
        } else {
            return false
        }
    }

    clearAnswer = () => {
        console.log("clearAnswer")
        this.setState(state => ({
            currentAnswer: null,
            notification: null
        }))
    }

    getBadge = () => {
        console.log("getBadge")

        if (this.state.probSet.length === 0) {
            return <img src={rock} className="Badge" alt="Correct" />
        }

        let level = 0
        for (
            let index = this.state.history.length - 1;
            index < this.state.history.length;
            index--
        ) {
            const element = this.state.history[index]
            if (element && element.correct) {
                level++
            } else {
                break
            }
        }

        if (level >= 40) {
            return <img src={hulk} className="Badge" alt="Correct" />
        } else if (level > 35) {
            return <img src={cena} className="Badge" alt="Correct" />
        } else if (level > 30) {
            return <img src={deadlift} className="Badge" alt="Correct" />
        } else if (level > 25) {
            return <img src={caveman} className="Badge" alt="Correct" />
        } else if (level > 20) {
            return <img src={thumbsup} className="Badge" alt="Correct" />
        } else if (level > 15) {
            return <img src={armsup} className="Badge" alt="Correct" />
        } else if (level > 10) {
            return <img src={barbell} className="Badge" alt="Correct" />
        } else if (level > 5) {
            return <img src={weak} className="Badge" alt="Correct" />
        } else if (level > 2) {
            return <img src={oldguy} className="Badge" alt="Correct" />
        } else {
            return <img src={baby} className="Badge" alt="Correct" />
        }
    }

    render() {
        console.log("RENDER APP")
        return (
            <div className="App">
                <div className="TitleBar">
                    <img src={dumbellsilver} className="App-barb" alt="bomb" />
                    <div className="App-title">Math Gym</div>
                    <img src={dumbellsilver} className="App-barb" alt="bomb" />
                </div>
                <div className="AppBar">
                    <div className="ProbNotification">{this.getBadge()}</div>
                </div>
                <div className="ScoreBar">
                    Reps Remaining: {this.state.probSet.length}
                </div>
                {this.state.probSet.length > 0 ? (
                    <div>
                        <Game
                            probs={this.state.probSet}
                            answerTimer={this.answerTimer}
                            currentProblem={this.state.currentProblem}
                            currentAnswer={this.state.currentAnswer}
                            currentOperator={this.state.currentOperator}
                            removeCurrentProblem={this.removeCurrentProblem}
                            shuffleCurrentProblem={this.shuffleCurrentProblem}
                            notification={this.state.notification}
                            getInitialAnswer={this.getInitialAnswer}
                            history={this.state.history}
                            // state={this.state}
                        />
                        <div className="keyBoardContainer">
                            <KeyBoard
                                keys={this.state.keys}
                                updateAnswer={this.updateAnswer}
                            />
                            <button
                                className="ClearButton"
                                onClick={() => {
                                    this.clearAnswer()
                                }}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="TheEnd">
                        <div className="CongratsText">YOU ROCK!!!</div>
                        <div className="RestartButtonDiv">
                            <button
                                className="RestartButton"
                                onClick={() =>
                                    this.setState(state => this.initGame())
                                }
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                )}
                <div className="Version">version {pjson.version}</div>
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.props.shuffleCurrentProblem(false)
    }

    getSymbol(name) {
        if (name === "plus") {
            return <img src={plus} className="ProbSymb" alt="Correct" />
        } else if (name === "minus") {
            return <img src={minus} className="ProbSymb" alt="Correct" />
        } else if (name === "mult") {
            return <img src={mult} className="ProbMult" alt="Correct" />
        } else if (name === "divi") {
            return <img src={divi} className="ProbSymb" alt="Correct" />
        } else {
            return
        }
    }

    render() {
        return (
            <div className="ProbAll">
                {this.props.currentProblem !== null ? (
                    <div className="ProbSpace">
                        <div className="ProbNum">
                            {this.props.currentProblem !== null
                                ? this.props.currentProblem.curr_a
                                : 9}
                        </div>
                        <div className="ProbSymb">
                            {this.getSymbol(this.props.currentProblem.curr_c)}
                        </div>
                        <div className="ProbNum">
                            {this.props.currentProblem !== null
                                ? this.props.currentProblem.curr_b
                                : 9}
                        </div>
                        <div className="ProbSymb">
                            <img
                                src={equal}
                                className="ProbSymb"
                                alt="Correct"
                            />
                        </div>
                        <div className="ProbNum">
                            {this.props.currentAnswer !== null
                                ? this.props.currentAnswer
                                : this.props.getInitialAnswer()}
                        </div>
                    </div>
                ) : null}
            </div>
        )
    }

    componentDidMount() {
        this.props.answerTimer(this.props.currentProblem)
    }

    componentDidUpdate() {
        console.log("componentDidUpdate", "TIME", this.props.probs.length)
        this.props.answerTimer(this.props.currentProblem)
    }
}

class KeyBoard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="KeyBoard">
                {this.props.keys.map(k => (
                    <button
                        className="KeyBoardKey"
                        key={k}
                        onClick={() => {
                            this.props.updateAnswer(k)
                        }}
                    >
                        {k}
                    </button>
                ))}
            </div>
        )
    }
}

export default App
