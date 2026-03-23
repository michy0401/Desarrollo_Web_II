import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PaginaInicio() {
  const [totalServicios, totalReservas] = await Promise.all([
    prisma.servicio.count(),
    prisma.reserva.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Bienvenido</h1>
      <p className="text-gray-500 mb-8">Resumen general de tu panel</p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <p className="text-xs text-gray-400 uppercase mb-1 font-bold">Servicios</p>
          <p className="text-3xl font-semibold text-blue-600">{totalServicios}</p>
        </div>

        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <p className="text-xs text-gray-400 uppercase mb-1 font-bold">Reservas</p>
          <p className="text-3xl font-semibold text-green-600">{totalReservas}</p>
        </div>
      </div>

      <Link
        href="/servicios/nuevo"
        className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all inline-block"
      >
        + Agregar nuevo servicio
      </Link>
    </div>
  );
}