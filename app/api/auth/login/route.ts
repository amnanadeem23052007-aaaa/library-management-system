import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(req:Request){

try{

await connectDB();


const {email,password}=await req.json();
if (!email || !password) {
  return NextResponse.json(
    {
      message: "Email and Password are required",
    },
    {
      status: 400,
    }
  );
}



const user = await User.findOne({email});


if(!user){

return NextResponse.json(
{
message:"Invalid email or password"
},
{
status:401
}
);

}



const isMatch = await bcrypt.compare(
password,
user.password
);



if(!isMatch){

return NextResponse.json(
{
message:"Invalid email or password"
},
{
status:401
}
);

}



const token = jwt.sign(
{
id:user._id,
role:user.role
},
process.env.JWT_SECRET!,
{
expiresIn:"7d"
}
);



return NextResponse.json(
{
success:true,

token,

user:{
id:user._id,
name:user.name,
email:user.email,
role:user.role
}

}
);


}
catch(error){

console.log(error);


return NextResponse.json(
{
success:false
},
{
status:500
}
);


}

}