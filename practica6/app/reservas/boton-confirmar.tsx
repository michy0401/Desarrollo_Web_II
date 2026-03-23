"use client";

import { confirmarReserva } from "@/app/actions/reservas";
import { useState } from "react";

export function BotonConfirmarReserva({ id, estadoActual }: { id: number, estadoActual: string }) {
    const [error, setError] = useState<string | null>(null);

    if (estadoActual !== "pendiente") return null;

    async function manejarConfirmacion() {
        const resultado = await confirmarReserva(id);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error al confirmar.");
        }
    }

    return (
        <div className="text-right">
            <button
                onClick={manejarConfirmacion}
                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors font-medium"
            >
                Confirmar cita
            </button>
            {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
        </div>
    );
}