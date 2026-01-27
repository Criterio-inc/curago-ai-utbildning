'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { QuizQuestion } from '@/types/module-content'

interface QuizViewProps {
  questions: QuizQuestion[]
  moduleTitle: string
  moduleNumber: number
  passingScore?: number
  onComplete?: (score: number) => void
}

export default function QuizView({
  questions,
  moduleTitle,
  moduleNumber,
  passingScore = 70,
  onComplete,
}: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(
    new Array(questions.length).fill(null)
  )
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [saving, setSaving] = useState(false)

  const moduleId = `modul-${moduleNumber}`
  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  const selectAnswer = (letter: string) => {
    if (showExplanation) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = letter
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

    const correctAnswers = selectedAnswers.filter(
      (answer, idx) => answer === questions[idx].correctAnswer
    ).length
    const score = Math.round((correctAnswers / questions.length) * 100)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        module_id: moduleId,
        quiz_score: score,
        quiz_completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,module_id',
      })
    }

    setSaving(false)
    setShowResult(true)
    onComplete?.(score)
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(null))
    setShowResult(false)
    setShowExplanation(false)
  }

  // Calculate score
  const correctCount = selectedAnswers.filter(
    (answer, idx) => answer === questions[idx].correctAnswer
  ).length
  const score = Math.round((correctCount / questions.length) * 100)
  const passed = score >= passingScore

  // --- Result Screen ---
  if (showResult) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed
              ? 'bg-green-100 dark:bg-green-900'
              : 'bg-amber-100 dark:bg-amber-900'
          }`}>
            {passed ? (
              <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
            ) : (
              <RotateCcw className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {passed ? 'Bra jobbat!' : 'Nästan!'}
          </h1>

          <p className="text-muted-foreground mb-6">
            {passed
              ? 'Du har klarat quizet för denna modul.'
              : 'Du kan försöka igen eller fortsätta till nästa modul.'}
          </p>

          <div className="text-5xl font-bold text-foreground mb-2">{score}%</div>
          <p className="text-muted-foreground mb-4">
            {correctCount} av {questions.length} rätt
          </p>

          {/* Answer review */}
          <div className="text-left mb-8 space-y-3">
            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[idx]
              const isCorrect = userAnswer === q.correctAnswer

              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-lg border text-sm ${
                    isCorrect
                      ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                      : 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{q.text}</p>
                      {!isCorrect && (
                        <p className="text-muted-foreground mt-1">
                          Ditt svar: {userAnswer}) {q.options.find(o => o.letter === userAnswer)?.text}
                          <br />
                          Rätt svar: {q.correctAnswer}) {q.options.find(o => o.letter === q.correctAnswer)?.text}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restartQuiz}
              className="px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Försök igen
            </button>
            <Link
              href={`/utbildning/${moduleId}`}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
            >
              Tillbaka till modulen
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // --- Question Screen ---
  const selectedLetter = selectedAnswers[currentQuestion]
  const isCorrectAnswer = selectedLetter === question.correctAnswer

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <Link
        href={`/utbildning/${moduleId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Tillbaka till modulen
      </Link>

      <div className="bg-card rounded-2xl border border-border p-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Fråga {currentQuestion + 1} av {questions.length}
            </span>
            <span className="text-sm font-medium text-foreground">
              {moduleTitle}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-foreground mb-6">
          {question.text}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedLetter === option.letter
            const isCorrect = option.letter === question.correctAnswer
            const showCorrectness = showExplanation

            let buttonStyle = 'border-border hover:border-primary/50 hover:bg-secondary'

            if (showCorrectness) {
              if (isCorrect) {
                buttonStyle = 'border-green-500 bg-green-50 dark:bg-green-950'
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'border-red-500 bg-red-50 dark:bg-red-950'
              } else {
                buttonStyle = 'border-border opacity-50'
              }
            } else if (isSelected) {
              buttonStyle = 'border-primary bg-secondary'
            }

            return (
              <button
                key={option.letter}
                onClick={() => selectAnswer(option.letter)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-medium ${
                    showCorrectness && isCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : showCorrectness && isSelected && !isCorrect
                        ? 'border-red-500 bg-red-500 text-white'
                        : isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-muted-foreground'
                  }`}>
                    {showCorrectness && isCorrect ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : showCorrectness && isSelected && !isCorrect ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      option.letter
                    )}
                  </div>
                  <span className="text-foreground">{option.text}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className={`p-4 rounded-lg mb-6 ${
            isCorrectAnswer
              ? 'bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800'
              : 'bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800'
          }`}>
            <p className="font-medium text-foreground mb-1">
              {isCorrectAnswer ? 'Rätt!' : 'Inte riktigt'}
            </p>
            <p className="text-sm text-muted-foreground">
              Rätt svar är {question.correctAnswer}) {question.options.find(o => o.letter === question.correctAnswer)?.text}
            </p>
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <button
            onClick={nextQuestion}
            disabled={saving}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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
