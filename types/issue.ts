export interface Issue{

    _id:string;

    member:any;

    book:any;

    issueDate:string;

    dueDate:string;

    returnDate?:string;

    fine:number;

    status:string;

}