import { useReducer, createContext, useEffect } from "react"
import { budgetReducer, initialState } from "../reducers/budget-reducer"

export const BudgetStateContext = createContext()
export const BudgetDispatchContext = createContext()

const getLocalStorage = () => {
    const localData = localStorage.getItem('budget_app')
    return localData ? JSON.parse(localData) : initialState
}

export const BudgetProvider = ({ children }) => {
    const [state, dispatch] = useReducer(budgetReducer, getLocalStorage())

    useEffect(() => {
        localStorage.setItem('budget_app', JSON.stringify(state))
    }, [state])

    return (
        <BudgetStateContext.Provider value={state}>
            <BudgetDispatchContext.Provider value={dispatch}>
                {children}
            </BudgetDispatchContext.Provider>
        </BudgetStateContext.Provider>
    )
}