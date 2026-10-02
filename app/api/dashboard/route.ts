import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

import Book from "@/models/Book";
import Member from "@/models/Member";
import Issue from "@/models/Issue";



export async function GET(){

try{


await connectDB();



const totalBooks = await Book.countDocuments();


const totalMembers = await Member.countDocuments();



const issuedBooks = await Issue.countDocuments({
    status:"issued"
});



const returnedBooks = await Issue.countDocuments({
    status:"returned"
});





const books = await Book.find();



let availableBooks = 0;



books.forEach((book)=>{

    availableBooks += book.available;

});





return NextResponse.json(
{
success:true,

dashboard:{
    totalBooks,
    totalMembers,
    issuedBooks,
    returnedBooks,
    availableBooks
}

}
);



}
catch(error){


console.log(error);


return NextResponse.json(
{
success:false,
error
},
{
status:500
}
);


}


}