import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Kachapat Punthong",
    studentId: "660612137",
  });
};
