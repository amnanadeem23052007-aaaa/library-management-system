import { Star, BookOpen } from "lucide-react";

export default function BookCard(){

return(

<div className="bg-white rounded-2xl shadow-lg overflow-hidden">

<div className="h-52 bg-gradient-to-br from-blue-500 to-purple-600 flex justify-center items-center">

<BookOpen size={80} className="text-white"/>

</div>

<div className="p-5">

<h2 className="font-bold text-xl">

Atomic Habits

</h2>

<p className="text-gray-500">

James Clear

</p>

<div className="flex gap-1 mt-3">

<Star fill="#fbbf24" color="#fbbf24"/>

<Star fill="#fbbf24" color="#fbbf24"/>

<Star fill="#fbbf24" color="#fbbf24"/>

<Star fill="#fbbf24" color="#fbbf24"/>

<Star fill="#fbbf24" color="#fbbf24"/>

</div>

<button className="mt-5 w-full bg-blue-600 text-white rounded-xl py-3">

View Details

</button>

</div>

</div>

);

}