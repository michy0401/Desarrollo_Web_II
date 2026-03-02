import { useReducer, createContext, useEffect } from "react"
import { budgetReducer, initialState } from "../reducers/budget-reducer"

export const BudgetStateContext = createContext()
export const BudgetDispatchContext = createContext()

// Función para obtener datos guardados
const getLocalStorage = () => {
    const localData = localStorage.getItem('budget_app')
    return localData ? JSON.parse(localData) : initialState
}

export const BudgetProvider = ({ children }) => {
    // Iniciamos el reducer con los datos de LocalStorage
    const [state, dispatch] = useReducer(budgetReducer, getLocalStorage())

    // 60. Guardamos en LocalStorage cada vez que cambie el presupuesto o los gastos
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