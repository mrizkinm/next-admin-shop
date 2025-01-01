import db from "@/lib/db";
import { NextResponse } from "next/server"
import { z } from "zod";
import bcrypt from "bcryptjs";

const formSchema = z.object({
    id: z.number().int(),
    currentPassword: z.string()
      .min(1, { message: 'Password saat ini harus diisi' }),
    newPassword: z.string()
      .min(6, { message: 'Password minimal 6 karakter' }),
    confirmPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export async function PATCH(req) {
  try {
    const { currentPassword, newPassword, confirmPassword, id } = await req.json();

    const result = formSchema.safeParse({  currentPassword, newPassword, confirmPassword, id });
     
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      // Ubah format menjadi { fieldName: "Error message" }
      const simplifiedErrors = Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || 'Invalid value'])
      );

      return NextResponse.json({ errors: simplifiedErrors }, { status: 400 });
    }

    // Cocokkan token dengan token di database
    const findUser = await db.user.findUnique({
      where: { id: id },
    });

    if (!findUser) {
      return NextResponse.json({ errors: 'User not found' }, { status: 404 });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(currentPassword, findUser.password);
    if (!isValidPassword) {
      return NextResponse.json({ errors: "Password lama salah" }, { status: 401 });
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hash = await bcrypt.hash(newPassword, salt);

    const user = await db.user.update({
      where: {
        id: id
      },
      data: {
        password: hash
      }
    });

    return NextResponse.json(user)
  } catch (error) {
    console.log("ERROR user PATCH", error)
    return NextResponse.json({ errors: "Internal Error" }, {status: 500})
  }
}