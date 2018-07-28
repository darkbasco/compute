import React, { Component } from "react"
import bomb from "./bomb.png"
import badge1 from "./badge1.png"
import badge2 from "./badge2.png"
import badge3 from "./badge3.png"
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
            probSet: first.reduce((acc_a, curr_a) => {
                return acc_a.concat(
                    second.reduce((acc_b, curr_b) => {
                        return acc_b.concat({ curr_a, curr_b })
                    }, [])
                )
            }, []),
            keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            currentProblem: null,
            currentAnswer: null,
            currentIndex: null,
            notification: false,
            history: []
        }
    }

    getInitialAnswer = () => "?"

    updateCurrentProblem = () => {
        setTimeout(() => {
            console.log("PI IN")
            const probIndex = Math.floor(
                Math.random() * this.state.probSet.length
            )
            console.log("PI OUT")

            //console.log(this.state)
            console.log("REMOVE", this.state.currentIndex)
            // this.state.probSet.slice(this.state.currentIndex, 1)
            //TODO THIS DELETE OF LAST PROBLEM NOT WORKING
            let filteredArray
            if (this.state.currentIndex) {
                console.log("GUNNA")
                filteredArray = this.state.probSet.filter(
                    item => item.currentIndex !== this.state.currentIndex
                )
            }
            // let filteredArray = this.state.currentIndex
            // ? this.state.probSet.filter(
            //       item => item.currentIndex !== this.state.currentIndex
            //   )
            // : this.state.probSet
            console.log("FILL", filteredArray)
            this.setState(prevState => ({
                probSet: filteredArray ? filteredArray : prevState.probSet,
                //     prevState.currentIndex !== null
                //         ? prevState.probSet.slice(prevState.currentIndex, 1)
                //         : prevState.probSet,
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
                                  prevState.notification
                              )
                          ]
                        : [...prevState.history]
            }))
        }, 500)
        console.log("COUNT", this.state.probSet.length)
        console.log("HISTORY", this.state.history)
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
        if (problem.curr_a + problem.curr_b === answer) {
            this.updateCurrentProblem()
            return true
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

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={bomb} className="App-bomb" alt="bomb" />
                    <h1 className="App-title">Math Bomb</h1>
                </header>
                <Game
                    probs={this.state.probSet}
                    currentProblem={this.state.currentProblem}
                    currentAnswer={this.state.currentAnswer}
                    updateCurrentProblem={this.updateCurrentProblem}
                    notification={this.state.notification}
                    getInitialAnswer={this.getInitialAnswer}
                    history={this.state.history}
                />
                <hr className="keyBoardBreak" />
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
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.props.updateCurrentProblem()
    }

    //TODO Don't disappear image on double digit answer
    //PUT IN TIMER

    getBadge = () => {
        let level = 0
        for (let index = 0; index < this.props.history.length; index++) {
            const element = this.props.history[index]
            if (element.correct) {
                level++
            } else {
                break
            }
        }
        console.log("L = " + level)
        if (level >= 3) {
            return <img src={badge3} className="Badge" alt="Correct" />
        } else if (level > 0) {
            return <img src={badge1} className="Badge" alt="Correct" />
        } else {
            return null
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
                                : 0}
                        </div>
                        <div className="ProbSymb">+</div>
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
                <div className="ProbNotification">
                    {this.props.notification ? this.getBadge() : null}
                </div>
            </div>
        )
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
