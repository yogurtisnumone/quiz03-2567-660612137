import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import {  Database } from "@lib/DB";

export const GET = async () => {
  readDB();
  const rooms = (<Database>DB).rooms;
  const totalRooms = rooms.length;

  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
    //rooms:
    //totalRooms:
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Invalid token",
  //   },
  //   { status: 401 }
  // );

  readDB();

  const body = await request.json();
  const { roomName } = body;

  const foundRoom = (<Database>DB).rooms.find((x) => x.roomName === roomName);
  if (foundRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${"replace this with room name"} already exists`,
      },
      { status: 400 }
    );
  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room ${"replace this with room name"} already exists`,
  //   },
  //   { status: 400 }
  // );

  const roomId = nanoid();
  (<Database>DB).rooms.push({
    roomId,
    roomName,
  });
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
};
