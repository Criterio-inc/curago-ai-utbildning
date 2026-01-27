export interface Module {
  id: string
  number: number
  title: string
  description: string
  estimatedTime: number
  content: string
  keyPoints: string[]
  externalResources: ExternalResource[]
  quiz?: Quiz
}

export interface ExternalResource {
  id: string
  title: string
  type: 'video' | 'article' | 'course' | 'tool'
  url: string
  duration?: string
  provider?: string
  description: string
}

export interface Quiz {
  questions: Question[]
  passingScore: number
}

export interface Question {
  id: string
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface UserProgress {
  moduleId: string
  completed: boolean
  completedAt?: string
  quizScore?: number
}

export interface AggregateStats {
  totalUsers: number
  activeUsersToday: number
  avgCompletionPercentage: number
  modulesCompletedTotal: number
}

export interface User {
  id: string
  email: string
  displayName?: string
}
