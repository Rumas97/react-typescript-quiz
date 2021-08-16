import React,{useState} from "react"
import {fetchQuizQuestions} from './API'


//Components

import QuestionCard from './components/QuestionCard' 

//Types
import { QuestionState, Difficulty } from "./API";

type AnswerObject ={
  question:string
  answer:string
  correct:boolean
  correctAnswer:string
}


const TOTAL_QUESTIONS= 10;


const App = ()=> {
  const[loading,setLoading]= useState(false)
  const [questions,setQuestions]= useState<QuestionState[]>([])
  const [number,setNumber]= useState(0)
  const[userAnswers,setUserAnswers]=useState<AnswerObject[]>([])
  const [score,setScore]= useState(0)
  const[gameOver,setGameOver]=useState(true)

  console.log(questions)

  //async because it gives the API
  const startTrivia= async()=>{
    setLoading(true)
    setGameOver(false)

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    )

    setQuestions(newQuestions)
    setScore(0)
    setUserAnswers([])
    setNumber(0)
    setLoading(false)
  }

  //one parameter- event of type mouse event- HTML button element
  const checkAnswer = (e: any) => {
    if(!gameOver){
      //get user answers
      const answer = e.currentTarget.value

      //check answer against the correct answer
      const correct = questions[number].correct_answer === answer

      //add score if answer is correct
      if(correct){
        setScore(prev=> prev +1)
      }
      //save answer in the array for user answers
      const answerObject ={
        question: questions[number].question,
        answer,//same as answer:answer (ES6)
        correct,
        correctAnswer: questions[number].correct_answer
      }
      console.log('UserAnswer length:',userAnswers.length)
      setUserAnswers(prev=>[...prev,answerObject])
    }
  }

  const nextQuestion = () =>{
//move on to next question if it not on the last question
    const nextQ = number +1 

    if(nextQ === TOTAL_QUESTIONS){
      setGameOver(true)
    }
    else{
      setNumber(nextQ)
    }
  }

  return (
    <div className="App">
      <h1>React Quiz</h1>
      {
        gameOver || userAnswers.length === TOTAL_QUESTIONS 
        ?
        (<button className='start' onClick={startTrivia}>Start</button>)
        :
        null
      }
      {!gameOver ? (<p className='score'>Score:</p>) : null}

      {loading ? (<p>Loading questions ...</p>): null}

      {!loading && !gameOver && (
      <QuestionCard 
        questionNr={number+1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number]:undefined}
        callback={checkAnswer}
        
      />
      )}
      
      {!gameOver && !loading && userAnswers.length === number + 1  && number !== TOTAL_QUESTIONS -1  
      ? 
      (<button className='next' onClick={nextQuestion}>Next</button>)
      :
      null}
      
    </div>
  );
}

export default App;
