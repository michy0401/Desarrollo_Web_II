import { useContext } from "react"
import { BudgetStateContext } from "./context/BudgetContext"
import { BudgetForm } from "./components/BudgetForm"
import { BudgetTracker } from "./components/BudgetTracker"
import { ExpenseList } from "./components/ExpenseList"
import { FilterByCategory } from "./components/FilterByCategory"
import ExpenseModal from "./components/ExpenseModal"

function App() {
  // Leemos el estado global para saber si ya hay un presupuesto definido
  const state = useContext(BudgetStateContext)
  const isValidBudget = state.budget > 0

  return (
    <>
      <header className="bg-blue-600 py-8 max-h-72">
        <h1 className="uppercase text-center font-black text-4xl text-white">
          Planificador de gastos
        </h1>
      </header>

      {/* Panel principal: Muestra el formulario inicial o el tablero de control */}
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-10">
        {isValidBudget ? <BudgetTracker /> : <BudgetForm />}
      </div>

      {/* Sección inferior: Solo aparece si el presupuesto es válido */}
      {isValidBudget && (
        <main className="max-w-3xl mx-auto py-10">
          {/* Paso 56: Agregamos el componente de filtros */}
          <FilterByCategory />
          
          {/* Listado de gastos filtrados y botón para nuevo gasto */}
          <ExpenseList />
          <ExpenseModal />
        </main>
      )}
    </>
  )
}

export default App