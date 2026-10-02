import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Member from "@/models/Member";


// GET ALL MEMBERS

export async function GET(){

    try{

        await connectDB();


        const members = await Member.find();


        return NextResponse.json(
            {
                success:true,
                members
            },
            {
                status:200
            }
        );


    }catch(error){

        console.log(error);


        return NextResponse.json(
            {
                success:false,
                message:"Failed to fetch members"
            },
            {
                status:500
            }
        );

    }

}





// CREATE MEMBER (DISABLED - Members must register themselves)
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      message:
        "Librarians cannot add members directly. Members must register their own accounts.",
    },
    {
      status: 403,
    }
  );
}