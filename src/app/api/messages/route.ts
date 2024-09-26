import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { ok } from "assert";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import  Room  from "@lib/DB";



export const GET = async (request: NextRequest) => {
  try {
    readDB();
    const body = await request.json();
    const { roomId } = body; 
    const foundroomId = DB.rooms.find((x:any) => x.roomId === roomId);
    
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

    const messages = DB.messages.filter((msg : any) => msg.roomid === roomid );
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

    const foundRoomId = DB.rooms.find((x) => x.roomId === roomId);
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
    DB.messages.push({
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

    const messageIndex = DB.messages.findIndex((msg: any) => msg.messageId === messageId);
    if (messageIndex === -1) {
      return NextResponse.json(
        {
          ok: false,
          message: "Message is not found",
        },
        { status: 404 }
      );
    }

    DB.messages.splice(messageIndex, 1);
  
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
