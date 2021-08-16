
import { CLIENT_RENEG_LIMIT } from 'tls'
import {shuffleArray} from './utils'

export type Question ={
    category:string
    correct_answer:string
    difficulty:string
    incorrect_answers:string[]
    question:string
    type:string
}


//will use type from Questions and add a proprty
export type QuestionState = Question & {answers:string[]}

export enum Difficulty{
    EASY = 'easy',
    MEDIUM = 'medium',
    HARD = 'hard'
}

export const fetchQuizQuestions = async(amount:number, difficulty:Difficulty)=>{
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
    // first we await the fetch itself and then we await the conversion to json
    const data = await(await fetch(endpoint)).json()
/*  Another option
    const api = await fetch (`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`)
    const data = await api.json() */
    console.log(data)


    return data.results.map((question:Question)=>({
        ...question,
        answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
    }) 
    )
    
    
}