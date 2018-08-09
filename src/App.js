import React, { Component } from "react"
import armsup from "./comp_armsup.png"
import baby from "./comp_baby.png"
import barbell from "./comp_barbell.png"
import caveman from "./comp_caveman.png"
import cena from "./comp_cena.png"
import hulk from "./comp_hulk.png"
import thumbsup from "./comp_thumbsup.png"
import oldguy from "./comp_oldguy.png"
import deadlift from "./comp_deadlift.png"
import geek from "./comp_geek.png"
import dumbellsilver from "./dumbell_silver.png"
import plus from "./sign_plus.png"
import minus from "./sign_minus.png"
import mult from "./sign_mult.png"
import divi from "./sign_divi.png"
import equal from "./sign_equal.png"
import "./App.css"

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

        const first = [0, 1]
        const second = [0, 1]
        // const first = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        // const second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

        this.state = {
            probSet: this.generateProblemSet(first, second, [
                "plus",
                "minus",
                "mult",
                "divi"
            ]),
            keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            currentProblem: null,
            currentAnswer: null,
            currentIndex: null,
            notification: false,
            history: []
        }
        console.log("APP CONSTRUCT", this.state)
    }

    generateProblemSet = (first, second, third) =>
        first.reduce((acc_a, curr_a) => {
            return acc_a.concat(
                second.reduce((acc_b, curr_b) => {
                    return acc_b.concat(
                        third.reduce((acc_c, curr_c) => {
                            if (curr_c === "plus") {
                                return acc_c.concat({ curr_a, curr_b, curr_c })
                            } else if (curr_c === "minus") {
                                if (curr_b <= curr_a) {
                                    return acc_c.concat({
                                        curr_a,
                                        curr_b,
                                        curr_c
                                    })
                                } else {
                                    return acc_c
                                }
                            } else if (curr_c === "mult") {
                                return acc_c.concat({ curr_a, curr_b, curr_c })
                            } else if (curr_c === "divi") {
                                if (
                                    curr_b <= curr_a &&
                                    curr_a % curr_b === 0 &&
                                    !(curr_a === 0 && curr_b === 0)
                                ) {
                                    return acc_c.concat({
                                        curr_a,
                                        curr_b,
                                        curr_c
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

    shuffleCurrentProblem = answeredPrevious => {
        const probIndex = Math.floor(Math.random() * this.state.probSet.length)
        console.log("shuffleCurrentProblem", probIndex, answeredPrevious)

        this.setState(prevState => ({
            currentProblem: prevState.probSet[probIndex]
                ? prevState.probSet[probIndex]
                : prevState.probSet[0],
            currentAnswer: null,
            currentIndex: probIndex,
            history:
                prevState.currentProblem !== null
                    ? [
                          ...prevState.history,
                          new Problem(
                              prevState.currentProblem,
                              prevState.currentAnswer,
                              answeredPrevious
                          )
                      ]
                    : [...prevState.history]
        }))
    }

    removeCurrentProblem = () => {
        let filteredArray
        if (this.state.currentIndex) {
            filteredArray = this.state.probSet.filter(item => {
                return item !== this.state.currentProblem
            })
        }

        this.setState(prevState => ({
            probSet: filteredArray ? filteredArray : prevState.probSet
        }))
    }

    answerTimer = prob => {
        console.log("STARTING TIMER")
        setTimeout(() => {
            if (prob === this.state.currentProblem) {
                console.log("TIMES UP")
                this.shuffleCurrentProblem(false)
            }
        }, 7000)
    }

    updateAnswer = answer => {
        const newAnswer = this.buildAnswer(this.state.currentAnswer, answer)
        this.setState(prevState => ({
            currentAnswer: newAnswer,
            notification: this.checkAnswer(prevState.currentProblem, newAnswer)
        }))
    }

    buildAnswer = (prevAnswer, currAnswer) => {
        console.log("buildAnswer", prevAnswer, currAnswer)
        if (prevAnswer >= 0) {
            return prevAnswer * 10 + currAnswer
        } else {
            return currAnswer
        }
    }

    checkAnswer = (problem, answer) => {
        console.log("checkAnswer", problem, answer)
        if (
            problem.curr_c === "plus" &&
            problem.curr_a + problem.curr_b === answer
        ) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            return true
        } else if (
            problem.curr_c === "minus" &&
            problem.curr_a - problem.curr_b === answer
        ) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            return true
        } else if (
            problem.curr_c === "mult" &&
            problem.curr_a * problem.curr_b === answer
        ) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            return true
        } else if (
            problem.curr_c === "divi" &&
            problem.curr_a / problem.curr_b === answer
        ) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            return true
        } else {
            return false
        }
    }

    clearAnswer = () => {
        console.log("clearAnswer")
        this.setState(() => ({
            currentAnswer: null,
            notification: null
        }))
    }

    getBadge = () => {
        console.log("getBadge")
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
            return <img src={geek} className="Badge" alt="Correct" />
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
                        <div>GREAT JOB!!!</div>
                        <div>
                            <button
                                className="ClearButton"
                                onClick={() => {
                                    this.clearAnswer()
                                }}
                            >
                                Restart
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.props.shuffleCurrentProblem(false)
        console.log("CONSTRUCT GAME")
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
        console.log("RENDER GAME")
        console.log("RENDER", this.props.state)
        return (
            <div className="ProbAll">
                {this.props.currentProblem !== null &&
                typeof this.props.currentProblem !== "undefined" ? (
                    <div className="ProbSpace">
                        <div className="ProbNum">
                            {this.props.currentProblem !== null
                                ? this.props.currentProblem.curr_a
                                : 0}
                        </div>
                        <div className="ProbSymb">
                            {this.getSymbol(this.props.currentProblem.curr_c)}
                        </div>
                        <div className="ProbNum">
                            {this.props.currentProblem !== null
                                ? this.props.currentProblem.curr_b
                                : 0}
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
        this.props.answerTimer(this.props.currentProblem)
    }
}

class KeyBoard extends React.Component {
    constructor(props) {
        super(props)
        console.log("CONSTRUCT KEYB")
    }

    render() {
        console.log("RENDER KEYB")

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
