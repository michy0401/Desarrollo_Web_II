import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BotonEliminarReserva } from "./boton-eliminar";
import { BotonCancelarReserva } from "./boton-cancelar";
import { BotonConfirmarReserva } from "./boton-confirmar";
import { tarjeta } from "@/app/lib/estilos";

const etiquetaEstado: Record<string, string> = {
    pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
    confirmada: "bg-green-50 text-green-700 border-green-200",
    cancelada: "bg-red-50 text-red-700 border-red-200",
};

interface PaginaProps {
    searchParams: Promise<{ estado?: string }>;
}

export default async function PaginaReservas({ searchParams }: PaginaProps) {
    const { estado } = await searchParams;

    const reservas = await prisma.reserva.findMany({
        where: {
            estado: estado ? estado : undefined,
        },
        orderBy: { fecha: "asc" },
        include: { servicio: true },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Reservas</h1>
                    <p className="text-sm text-gray-500">Gestión de citas</p>
                </div>
                <Link
                    href="/reservas/nueva"
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all"
                >
                    + Nueva reserva
                </Link>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <Link href="/reservas" className={`px-3 py-1 rounded-full text-xs font-medium border ${!estado ? 'bg-black text-white' : 'bg-white text-gray-600'}`}>
                    Todos
                </Link>
                <Link href="/reservas?estado=pendiente" className={`px-3 py-1 rounded-full text-xs font-medium border ${estado === 'pendiente' ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-white text-gray-600'}`}>
                    Pendientes
                </Link>
                <Link href="/reservas?estado=confirmada" className={`px-3 py-1 rounded-full text-xs font-medium border ${estado === 'confirmada' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-white text-gray-600'}`}>
                    Confirmadas
                </Link>
                <Link href="/reservas?estado=cancelada" className={`px-3 py-1 rounded-full text-xs font-medium border ${estado === 'cancelada' ? 'bg-red-100 border-red-300 text-red-800' : 'bg-white text-gray-600'}`}>
                    Canceladas
                </Link>
            </div>

            <ul className="space-y-4">
                {reservas.length === 0 ? (
                    <p className="text-sm text-gray-400 italic text-center py-10 border rounded-lg bg-white">
                        No se encontraron reservas con este estado.
                    </p>
                ) : (
                    reservas.map((reserva) => (
                        <li key={reserva.id} className={`${tarjeta} flex items-start justify-between`}>
                            <div className="space-y-1">
                                <p className="font-semibold text-gray-900">{reserva.nombre}</p>
                                <p className="text-xs text-gray-500">{reserva.correo}</p>
                                <div className="pt-2 text-xs text-gray-500">
                                    <p><strong>{reserva.servicio.nombre}</strong></p>
                                    <p>{new Date(reserva.fecha).toLocaleString("es-SV")}</p>
                                </div>
                                <div className="pt-3">
                                    <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold ${etiquetaEstado[reserva.estado] ?? etiquetaEstado.pendiente}`}>
                                        {reserva.estado}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 items-end">
                                <BotonConfirmarReserva id={reserva.id} estadoActual={reserva.estado} />
                                <BotonCancelarReserva id={reserva.id} estadoActual={reserva.estado} />

                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}