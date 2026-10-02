import {
UserCircle,
Mail,
Shield
} from "lucide-react";

export default function ProfileCard(){

return(

<div className="bg-white rounded-3xl shadow-xl p-8">

<div className="flex items-center gap-6">

<UserCircle
size={90}
className="text-blue-600"
/>

<div>

<h2 className="text-3xl font-bold">

Admin

</h2>

<div className="flex items-center gap-2 mt-3">

<Mail size={18}/>

admin@gmail.com

</div>

<div className="flex items-center gap-2 mt-3">

<Shield size={18}/>

Administrator

</div>

</div>

</div>

</div>

);

}