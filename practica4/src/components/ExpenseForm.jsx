import { useContext, useState, useEffect } from 'react'
import { categories } from '../data/categories'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import { BudgetDispatchContext, BudgetStateContext } from '../context/BudgetContext'
import ErrorMessage from './ErrorMessage'

export const ExpenseForm = () => {
    const [expense, setExpense] = useState({
        expenseName: "",
        amount: 0,
        category: "",
        date: new Date(),
    });

    const [error, setError] = useState('')
    const dispatch = useContext(BudgetDispatchContext)
    const state = useContext(BudgetStateContext)

    // Cargar datos en el formulario si estamos editando
    useEffect(() => {
        if (state.editingId) {
            const editingExpense = state.expenses.filter(currentExpense => currentExpense.id === state.editingId)[0]
            setExpense(editingExpense)
        }
    }, [state.editingId])

    const handleChange = (e) => {
        const { name, value } = e.target;
        const isAmountField = ["amount"].includes(name);
        
        setExpense({
            ...expense,
            [name]: isAmountField ? Number(value) : value,
        })
    }

    const handleChangeDate = (value) => {
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Validación de campos obligatorios
        if (Object.values(expense).includes('') || expense.amount <= 0) {
            setError('Todos los Campos son Obligatorios')
            return
        }

        // 2. VALIDACIÓN DE PRESUPUESTO: Evitar saldos negativos
        const totalExpenses = state.expenses.reduce((total, exp) => exp.amount + total, 0)
        let availableBudget = state.budget - totalExpenses

        // Si estamos editando, sumamos temporalmente el monto viejo al disponible para comparar bien
        if (state.editingId) {
            const previousAmount = state.expenses.find(exp => exp.id === state.editingId).amount
            availableBudget += previousAmount
        }

        if (expense.amount > availableBudget) {
            setError('Ese gasto supera el presupuesto disponible')
            return
        }

        // 3. Guardar o actualizar según corresponda
        if (state.editingId) {
            dispatch({ type: 'update-expense', payload: { expense: { id: state.editingId, ...expense } } })
        } else {
            dispatch({ type: 'add-expense', payload: { expense } })
        }

        // Reiniciar el formulario
        setExpense({
            expenseName: "",
            amount: 0,
            category: "",
            date: new Date(),
        })
        setError('')
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
                {state.editingId ? 'Guardar Cambios' : 'Nuevo Gasto'}
            </legend>

            {/* Mostramos el mensaje de error si existe */}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">Nombre Gasto:</label>
                <input
                    type="text"
                    id="expenseName"
                    placeholder="Añade el Nombre del gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">Cantidad:</label>
                <input
                    type="number"
                    id="amount"
                    placeholder="Ej. 300"
                    className="bg-slate-100 p-2"
                    name="amount"
                    value={expense.amount}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">Categoría:</label>
                <select
                    id="category"
                    className="bg-slate-100 p-2"
                    name="category"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xl">Fecha Gasto:</label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    onChange={handleChangeDate}
                    value={expense.date}
                />
            </div>

            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId ? 'Guardar Cambios' : 'Registrar Gasto'}
            />
        </form>
    )
}