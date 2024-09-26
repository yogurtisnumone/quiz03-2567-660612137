import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import {  Database } from "@lib/DB";



export const GET = async (request: NextRequest) => {
  try {
    readDB();
    const body = await request.json();
    const { roomId } = body; 
    const foundroomId = (<Database>DB).rooms.find((x:any) => x.roomId === roomId);
    
    if( !foundroomId ){
      return NextResponse.json(
        {
          ok: false,
          message: "Room is not found",
        },
        { status: 404 }
      );
    }

    // return NextResponse.json(
    //   {
    //     ok: false,
    //     message: `Room is not found`,
    //   },
    //   { status: 404 }
    // );

    const messages = (<Database>DB).message.filter((msg : any) => msg.roomId === roomId );
    return NextResponse.json(
      {
        ok: true,
        messages,
      },
    );

  }
  catch(err) {
    return NextResponse.json(
      { 
        ok: false, 
      },
      { status: 400 }
    );
  }

};

export const POST = async (request: NextRequest) => {
  readDB();
  try{
    const body = await request.json();
    const { roomId, messageText } = body;

    const foundRoomId = (<Database>DB).rooms.find((x) => x.roomId === roomId);
    if (!foundRoomId) {
      return NextResponse.json(
        {
          ok: false,
          message: "Room is not found",
        },
        { status: 404 }
      );
    }

    if (!messageText) {
      return NextResponse.json(
        {
          ok: false,
        },
        { status: 400 }
      );
    }

    const messageId = nanoid();
    (<Database>DB).message.push({
      messageId,
      roomId,
      messageText,
    });

    writeDB();

    return NextResponse.json({
      ok: true,
      messageId,
      message: "Message has been sent",
    });

  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: `Room is not found`,
  //   },
  //   { status: 404 }
  // );

  catch(err) {
    return NextResponse.json(
      { 
        ok: false, 
      },
      { status: 400 }
    );
  }

  
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();

  if( !payload ){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      }
    ),
    { status: 401 }
  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Invalid token",
  //   },
  //   { status: 401 }
  // );

  readDB();

  try{
    const body: { messageId: string } = await request.json();
    const { messageId } = body;

    const messageIndex = (<Database>DB).message.findIndex((msg: any) => msg.messageId === messageId);
    if (messageIndex === -1) {
      return NextResponse.json(
        {
          ok: false,
          message: "Message is not found",
        },
        { status: 404 }
      );
    }

    (<Database>DB).message.splice(messageIndex, 1);
  
    writeDB();

    return NextResponse.json({
      ok: true,
      message: "Message has been deleted",
    });

  }

  // return NextResponse.json(
  //   {
  //     ok: false,
  //     message: "Message is not found",
  //   },
  //   { status: 404 }
  // );

  catch(err) {
    return NextResponse.json(
      { 
        ok: false, 
      },
      { status: 400 }
    );
  }

  

};
