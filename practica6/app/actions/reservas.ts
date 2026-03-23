"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const EsquemaReserva = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    correo: z.string().email("El correo no es válido."),
    fecha: z.string().min(1, "La fecha es obligatoria."),
    serviciold: z.coerce.number({ message: "Debe seleccionar un servicio." }),
});

export async function crearReserva(_estadoPrevio: any, formData: FormData) {
    const campos = EsquemaReserva.safeParse({
        nombre: formData.get("nombre"),
        correo: formData.get("correo"),
        fecha: formData.get("fecha"),
        serviciold: formData.get("serviciold"),
    });

    if (!campos.success) {
        return {
            errores: campos.error.flatten().fieldErrors,
            mensaje: "Error de validación.",
        };
    }

    const fechaReserva = new Date(campos.data.fecha);

    const reservaExistente = await prisma.reserva.findFirst({
        where: {
            servicioId: campos.data.serviciold,
            fecha: fechaReserva,
        },
    });

    if (reservaExistente) {
        return {
            errores: { fecha: ["Este horario ya está reservado para este servicio."] },
            mensaje: "Conflicto de horario.",
        };
    }

    await prisma.reserva.create({
        data: {
            nombre: campos.data.nombre,
            correo: campos.data.correo,
            fecha: fechaReserva,
            servicioId: campos.data.serviciold,
        },
    });

    revalidatePath("/reservas");
    redirect("/reservas");
}



export async function cancelarReserva(id: number) {
    console.log("Intentando cancelar reserva con ID:", id);
    try {
        const r = await prisma.reserva.update({
            where: { id },
            data: { estado: "cancelada" },
        });
        console.log("Reserva actualizada en DB:", r);
        revalidatePath("/reservas");
        return { exito: true };
    } catch (error) {
        console.error("ERROR EN DB:", error);
        return { exito: false, mensaje: "No se pudo cancelar." };
    }
}

export async function confirmarReserva(id: number) {
    try {
        await prisma.reserva.update({
            where: { id },
            data: {
                estado: "confirmada"
            },
        });

        revalidatePath("/reservas");
        return { exito: true };
    } catch (error) {
        return { exito: false, mensaje: "No se pudo confirmar la reserva." };
    }
}