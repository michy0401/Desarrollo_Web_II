import { useContext } from "react"
import { BudgetStateContext } from "../context/BudgetContext"
import { AmountDisplay } from "./AmountDisplay"
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import {BudgetDispatchContext} from "../context/BudgetContext"
import 'react-circular-progressbar/dist/styles.css'

export const BudgetTracker = () => {
    const state = useContext(BudgetStateContext)

    const totalExpenses = state.expenses.reduce((total, expense) => expense.amount + total, 0)
    const remainingBudget = state.budget - totalExpenses
    const percentage = ((totalExpenses / state.budget) * 100).toFixed(2)
    const dispatch = useContext(BudgetDispatchContext)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    styles={buildStyles({
                        pathColor: (percentage < 100) ? '#3b82f6' : '#dc2626',
                        trailColor: '#F5F5F5'
                    })}
                />
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
                <button
                    className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
                    onClick={() => dispatch({ type: 'reset-app' })}
                >
                    Resetear app
                </button>

                <AmountDisplay label="Presupuesto" amount={state.budget} />
                <AmountDisplay label="Disponible" amount={remainingBudget} />
                <AmountDisplay label="Gastado" amount={totalExpenses} />
            </div>
        </div>
    )
}