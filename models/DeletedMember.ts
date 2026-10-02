import mongoose,{Schema} from "mongoose";


const DeletedMemberSchema = new Schema(
{

name:{
    type:String,
    required:true
},

email:{
    type:String,
    required:true
},

phone:{
    type:String
},

address:{
    type:String
}

},
{
timestamps:true
}

);


export default mongoose.models.DeletedMember ||
mongoose.model(
    "DeletedMember",
    DeletedMemberSchema
);