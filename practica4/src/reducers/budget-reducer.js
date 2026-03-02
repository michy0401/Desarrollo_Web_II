export const initialState = {
    budget: 0,
    modal: false,
    expenses: [],
    editingId: "",
    currentCategory: ""
}

export const budgetReducer = (state, action) => {
    switch (action.type) {
        case "add-budget":
            return { ...state, budget: action.payload.budget }

        case "show-modal":
            return { ...state, modal: true }

        case "close-modal":
            // 43. Al cerrar el modal, también limpiamos el ID de edición [cite: 786]
            return { 
                ...state, 
                modal: false, 
                editingId: "" 
            }

        case "add-expense":
            return {
                ...state,
                expenses: [
                    ...state.expenses,
                    { ...action.payload.expense, id: new Date().getTime() }
                ],
                modal: false
            }

        case "remove-expense":
            return {
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload.id)
            }

        case "get-expense-by-id":
            return {
                ...state,
                editingId: action.payload.id,
                modal: true
            }

        case "update-expense":
            // 42. Buscamos el gasto por ID y lo reemplazamos con los nuevos datos [cite: 777-785]
            return {
                ...state,
                expenses: state.expenses.map(expense => 
                    expense.id === action.payload.expense.id ? action.payload.expense : expense
                ),
                modal: false,
                editingId: ""
            }
        
        case "add-filter-category":
            return {
                ...state,
                currentCategory: action.payload.id
            }

        
        case "reset-app":
            return {
                budget: 0,
                modal: false,
                expenses: [],
                editingId: "",
                currentCategory: ""
            }
            
        default:
            return state;
    }
}