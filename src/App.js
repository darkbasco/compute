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
import "./App.css"

class Problem {
    constructor(problem, answer, correct) {
        this.problem = problem
        this.answer = answer
        this.correct = correct
    }
}

class App extends Component {
    constructor() {
        super()

        const first = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

        this.state = {
            probSet: this.generateProblemSet(first, second, ["+", "-"]),
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
                            if(curr_c === "+"){
                                return acc_c.concat({ curr_a, curr_b, curr_c })
                            } else if (curr_c === "-") {
                                if(curr_b <= curr_a) return acc_c.concat({ curr_a, curr_b, curr_c })
                            }
                    },[])
                )
                }, [])
            )
        }, [])
    

    getInitialAnswer = () => "?"

    shuffleCurrentProblem = answeredPrevious => {
        const probIndex = Math.floor(Math.random() * this.state.probSet.length)

        this.setState(prevState => ({
            currentProblem: prevState.probSet[probIndex],
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
        console.log(this.state.history)
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
        if (prevAnswer >= 0) {
            return prevAnswer * 10 + currAnswer
        } else {
            return currAnswer
        }
    }

    checkAnswer = (problem, answer) => {
        console.log("CHECK", problem, answer)
        if (problem.curr_c === "+" && problem.curr_a + problem.curr_b === answer) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            return true
        } else if (problem.curr_c === "-" && problem.curr_a - problem.curr_b === answer) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            return true
        // } else if (problem.curr_c === "x" && problem.curr_a + problem.curr_b === answer) {
        //     this.removeCurrentProblem()
        //     this.shuffleCurrentProblem(true)
        //     return true
        // } else if (problem.curr_c === "/" && problem.curr_a + problem.curr_b === answer) {
        //     this.removeCurrentProblem()
        //     this.shuffleCurrentProblem(true)
        //     return true
        } else {
            return false
        }
    }

    clearAnswer = () => {
        this.setState(() => ({
            currentAnswer: null,
            notification: null
        }))
    }

    getBadge = () => {
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
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.props.shuffleCurrentProblem(false)
    }

    render() {
        console.log("RENDER GAME")
        console.log("RENDER", this.props.currentProblem, this.props.currentAnswer)
        return (
            <div className="ProbAll">
                {this.props.currentProblem !== null ? (
                    <div className="ProbSpace">
                        <div className="ProbNum">
                            {this.props.currentProblem !== null
                                ? this.props.currentProblem.curr_a
                                : 0}
                        </div>
                        <div className="ProbSymb">{this.props.currentProblem.curr_c}</div>
                        <div className="ProbNum">
                            {this.props.currentProblem !== null
                                ? this.props.currentProblem.curr_b
                                : 0}
                        </div>
                        <div className="ProbSymb">=</div>
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
