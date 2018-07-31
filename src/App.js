import React, { Component } from "react"
import bomb from "./bomb.png"
import armsup from "./comp_armsup.png"
import baby from "./comp_baby.png"
import barbell from "./comp_barbell.png"
import caveman from "./comp_caveman.png"
import cena from "./comp_cena.png"
import hulk from "./comp_hulk.png"
import thumbsup from "./comp_thumbsup.png"
import blank from "./comp_blank.png"
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
        if (problem.curr_a + problem.curr_b === answer) {
            this.removeCurrentProblem()
            this.shuffleCurrentProblem(true)
            //this.updateCurrentProblem()
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

    getBadge = () => {
        let level = 0
        for (
            let index = this.state.history.length - 1;
            index < this.state.history.length;
            index--
        ) {
            // for (let index = 0; index < this.props.history.length; index++) {

            const element = this.state.history[index]
            if (element && element.correct) {
                level++
            } else {
                break
            }
        }
        console.log("L = " + level)
        if (level >= 20) {
            return <img src={hulk} className="Badge" alt="Correct" />
        } else if (level > 15) {
            return <img src={cena} className="Badge" alt="Correct" />
        } else if (level > 12) {
            return <img src={caveman} className="Badge" alt="Correct" />
        } else if (level > 9) {
            return <img src={thumbsup} className="Badge" alt="Correct" />
        } else if (level > 6) {
            return <img src={armsup} className="Badge" alt="Correct" />
        } else if (level > 3) {
            return <img src={barbell} className="Badge" alt="Correct" />
        } else if (level > 0) {
            return <img src={baby} className="Badge" alt="Correct" />
        } else {
            return <img src={blank} className="Badge" alt="Correct" />
        }
    }

    render() {
        return (
            <div className="App">
                <div className="TitleBar">
                    <img src={bomb} className="App-bomb" alt="bomb" />
                    <div className="App-title">Math Bomb</div>
                    <img src={bomb} className="App-bomb" alt="bomb" />
                </div>
                <div className="AppBar">
                    {/* <div className="aaa" />
                    <div className="bbb" />
                    <div className="aaa" /> */}
                    <div className="ProbNotification">{this.getBadge()}</div>
                    {/* <img src={bomb} className="App-bomb" alt="bomb" /> */}
                    {/* <header className="App-header"> */}
                    {/* <h1 className="App-title">Math Bomb</h1> */}
                    {/* </header> */}
                    {/* <div className="ProbNotification">{this.getBadge()}</div> */}
                </div>
                <div className="ScoreBar">
                    Bombs Remaining: {this.state.probSet.length}
                </div>

                <Game
                    probs={this.state.probSet}
                    answerTimer={this.answerTimer}
                    currentProblem={this.state.currentProblem}
                    currentAnswer={this.state.currentAnswer}
                    //updateCurrentProblem={this.updateCurrentProblem}
                    removeCurrentProblem={this.removeCurrentProblem}
                    shuffleCurrentProblem={this.shuffleCurrentProblem}
                    notification={this.state.notification}
                    getInitialAnswer={this.getInitialAnswer}
                    history={this.state.history}
                />

                <div className="keyBoardContainer">
                    {/* <hr className="keyBoardBreak" /> */}
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
        console.log("CONSTRUCT GAME")
        this.props.shuffleCurrentProblem(false)
    }

    //TODO Don't disappear image on double digit answer
    //PUT IN TIMER

    // getBadge = () => {
    //     let level = 0
    //     for (
    //         let index = this.props.history.length - 1;
    //         index < this.props.history.length;
    //         index--
    //     ) {
    //         // for (let index = 0; index < this.props.history.length; index++) {

    //         const element = this.props.history[index]
    //         if (element && element.correct) {
    //             level++
    //         } else {
    //             break
    //         }
    //     }
    //     console.log("L = " + level)
    //     if (level >= 3) {
    //         return <img src={badge3} className="Badge" alt="Correct" />
    //     } else if (level > 0) {
    //         return <img src={badge1} className="Badge" alt="Correct" />
    //     } else {
    //         return null
    //     }
    // }

    render() {
        console.log("RENDER GAME")
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
                {/* <div className="ScoreBoard">{this.props.probs.length}</div> */}
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
