import { Inter } from 'next/font/google'
import Login from './login/page'
import Budget from './budget/page'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <Budget />
  )
}
