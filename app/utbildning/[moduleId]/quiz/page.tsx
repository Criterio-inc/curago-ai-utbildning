'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getModuleById } from '@/lib/modules'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.moduleId as string
  const module = getModuleById(moduleId)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([])
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (module?.quiz) {
      setSelectedAnswers(new Array(module.quiz.questions.length).fill(null))
    }
  }, [module])

  if (!module || !module.quiz) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Quiz hittades inte</h1>
        <Link href="/utbildning" className="text-curago-600 hover:underline">
          Tillbaka till översikten
        </Link>
      </div>
    )
  }

  const quiz = module.quiz
  const question = quiz.questions[currentQuestion]
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const hasAnswered = selectedAnswers[currentQuestion] !== null

  const selectAnswer = (answerIndex: number) => {
    if (showExplanation) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    setShowExplanation(false)
    if (isLastQuestion) {
      finishQuiz()
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const finishQuiz = async () => {
    setSaving(true)

    // Calculate score
    const correctAnswers = selectedAnswers.filter(
      (answer, idx) => answer === quiz.questions[idx].correctAnswer
    ).length
    const score = Math.round((correctAnswers / quiz.questions.length) * 100)

    // Save to database
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        module_id: module.id,
        quiz_score: score,
        quiz_completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,module_id'
      })
    }

    setSaving(false)
    setShowResult(true)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(quiz.questions.length).fill(null))
    setShowResult(false)
    setShowExplanation(false)
  }

  // Calculate final score
  const correctAnswers = selectedAnswers.filter(
    (answer, idx) => answer === quiz.questions[idx].correctAnswer
  ).length
  const score = Math.round((correctAnswers / quiz.questions.length) * 100)
  const passed = score >= quiz.passingScore

  if (showResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-amber-100'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-green-600" />
            ) : (
              <RotateCcw className="w-10 h-10 text-amber-600" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {passed ? 'Bra jobbat!' : 'Nästan!'}
          </h1>

          <p className="text-slate-600 mb-6">
            {passed
              ? 'Du har klarat quizet för denna modul.'
              : 'Du kan försöka igen eller fortsätta till nästa modul.'}
          </p>

          <div className="text-5xl font-bold text-slate-900 mb-2">{score}%</div>
          <p className="text-slate-500 mb-8">
            {correctAnswers} av {quiz.questions.length} rätt
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Försök igen
            </button>
            <Link
              href={`/utbildning/${module.id}`}
              className="px-6 py-3 bg-curago-600 text-white rounded-lg font-medium hover:bg-curago-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              Tillbaka till modulen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <Link
        href={`/utbildning/${module.id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Tillbaka till modulen
      </Link>

      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">
              Fråga {currentQuestion + 1} av {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-slate-700">
              {module.title}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-curago-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion] === idx
            const isCorrect = idx === question.correctAnswer
            const showCorrectness = showExplanation

            let buttonStyle = 'border-slate-200 hover:border-curago-300 hover:bg-curago-50'

            if (showCorrectness) {
              if (isCorrect) {
                buttonStyle = 'border-green-500 bg-green-50'
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'border-red-500 bg-red-50'
              } else {
                buttonStyle = 'border-slate-200 opacity-50'
              }
            } else if (isSelected) {
              buttonStyle = 'border-curago-500 bg-curago-50'
            }

            return (
              <button
                key={idx}
                onClick={() => selectAnswer(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    showCorrectness && isCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : showCorrectness && isSelected && !isCorrect
                        ? 'border-red-500 bg-red-500 text-white'
                        : isSelected
                          ? 'border-curago-500 bg-curago-500'
                          : 'border-slate-300'
                  }`}>
                    {showCorrectness && isCorrect && <CheckCircle className="w-4 h-4" />}
                    {showCorrectness && isSelected && !isCorrect && <XCircle className="w-4 h-4" />}
                  </div>
                  <span className="text-slate-700">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-lg mb-6 ${
            selectedAnswers[currentQuestion] === question.correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <p className="font-medium text-slate-900 mb-1">
              {selectedAnswers[currentQuestion] === question.correctAnswer
                ? 'Rätt!'
                : 'Inte riktigt'}
            </p>
            <p className="text-sm text-slate-600">{question.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        {showExplanation && (
          <button
            onClick={nextQuestion}
            disabled={saving}
            className="w-full bg-curago-600 text-white py-3 rounded-lg font-medium hover:bg-curago-700 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? (
              'Sparar...'
            ) : isLastQuestion ? (
              <>
                Visa resultat
                <Trophy className="w-5 h-5" />
              </>
            ) : (
              <>
                Nästa fråga
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
