"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { crearReserva } from "@/app/actions/reservas";
import { input, label, botonPrimario } from "@/app/lib/estilos";
import type { Servicio } from "@prisma/client";

const estadoInicial = {
    errores: {} as Record<string, string[]>,
    mensaje: ""
};

function BotonEnviar() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className={botonPrimario}>
            {pending ? "Guardando..." : "Confirmar reserva"}
        </button>
    );
}

export function FormularioReserva({ servicios }: { servicios: Servicio[] }) {
    const [estado, accion] = useActionState(crearReserva, estadoInicial);

    return (
        <form action={accion} className="space-y-5">
            <div>
                <label className={label}>Nombre del cliente</label>
                <input name="nombre" type="text" className={input} placeholder="Ej: Michelle" />
                {estado.errores?.nombre && (
                    <p className="text-xs text-red-500 mt-1">{estado.errores.nombre}</p>
                )}
            </div>

            <div>
                <label className={label}>Correo electrónico</label>
                <input name="correo" type="email" className={input} placeholder="correo@ejemplo.com" />
                {estado.errores?.correo && (
                    <p className="text-xs text-red-500 mt-1">{estado.errores.correo}</p>
                )}
            </div>

            <div>
                <label className={label}>Fecha y hora</label>
                <input name="fecha" type="datetime-local" className={input} />
                {estado.errores?.fecha && (
                    <p className="text-xs text-red-500 mt-1">{estado.errores.fecha}</p>
                )}
            </div>

            <div>
                <label className={label}>Servicio a reservar</label>
                <select name="serviciold" className={input}>
                    <option value="">Seleccione un servicio</option>
                    {servicios.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.nombre} ({s.duracion} min)
                        </option>
                    ))}
                </select>
                {estado.errores?.serviciold && (
                    <p className="text-xs text-red-500 mt-1">{estado.errores.serviciold}</p>
                )}
            </div>

            <BotonEnviar />
        </form>
    );
}