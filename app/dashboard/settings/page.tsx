import SettingsForm from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-8" style={{ padding: "15px" }}>
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{padding:"10px"}}>
          Settings
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400" style={{padding:"10px"}}>
          Manage your library account and preferences.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}