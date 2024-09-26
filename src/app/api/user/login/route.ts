import jwt from "jsonwebtoken";

import { Database } from "@lib/DB";
import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";


interface PostRequestBody {
  username: string;
  password: string;
}

export const POST = async (request: NextRequest) => {
  readDB();

  const body: PostRequestBody = await request.json();
  const { username, password } = body;

  const user = DB.users.find(
    (user) => user.username === username && user.password === password
  );

  if(!user){
    return NextResponse.json(
      {
        ok: false,
        message: "Username or Password is incorrect",
      },
      { status: 400 }
    );
  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Username or Password is incorrect",
  //   },
  //   { status: 400 }
  // );

  const token = "Replace this with token creation";

  return NextResponse.json({ ok: true, token });
};
