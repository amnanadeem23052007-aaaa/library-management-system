import IssueTable from "@/components/issue/IssueTable";

export default function IssueBooksPage() {
  return (
    <div className="space-y-8" style={{padding:"10px"}}>
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{padding:"10px"}}>
          Issued Books
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400" style={{padding:"10px"}}>
          View all currently issued books and process returns.
        </p>
      </div>

      <IssueTable />
    </div>
  );
}