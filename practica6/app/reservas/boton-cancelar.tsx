"use client";

import { cancelarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonPeligro } from "@/app/lib/estilos";

export function BotonCancelarReserva({ id, estadoActual }: { id: number, estadoActual: string }) {
    const [error, setError] = useState<string | null>(null);

    if (estadoActual === "cancelada") return null;

    async function manejarCancelacion() {
        if (!confirm("¿Estás segura de que deseas cancelar esta reserva?")) return;

        const resultado = await cancelarReserva(id);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error al cancelar.");
        }
    }

    return (
        <div className="text-right shrink-0 ml-4">
            <button
                onClick={manejarCancelacion}
                className="text-sm text-orange-600 hover:text-orange-800 transition-colors"
            >
                Cancelar cita
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}