"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Building, Mail, Phone, MapPin, FileText, CheckCircle2 } from "lucide-react";

const inputClass = "w-full h-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30";
const labelClass = "block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2";

export default function SettingsForm() {
  const [form, setForm] = useState({
    name: "Central City Library",
    email: "librarian@library.com",
    phone: "+1 (555) 019-2834",
    address: "100 Public Square, Suite 400, Central City",
    description: "Full-service community library offering physical books, research services, and digital loan tracking.",
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("library_settings");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      localStorage.setItem("library_settings", JSON.stringify(form));
      toast.success("Library settings updated successfully!");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200
     dark:border-slate-800 p-6 md:p-10 max-w-4xl transition-colors duration-200"style={{padding:"30px"}}>
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={{padding:"10px"}}>
            Library Configuration
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1" style={{padding:"10px"}}>
            Update general library profile and contact information
          </p>
        </div>

        {savedSuccess && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 rounded-full text-xs font-semibold">
            <CheckCircle2 size={16} />
            <span>Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" style={{padding:"10px"}}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                <Building size={14} className="text-blue-600 dark:text-blue-400"  />
                Library Name
              </span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Central Library"
              className={inputClass} style={{padding:"10px"}}
            />
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                <Mail size={14} className="text-blue-600 dark:text-blue-400" />
                Official Email
              </span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. contact@library.org"
              className={inputClass} style={{padding:"10px"}}
            />
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                <Phone size={14} className="text-blue-600 dark:text-blue-400" />
                Phone Number
              </span>
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. +1 234 567 8900"
              className={inputClass} style={{padding:"10px"}}
            />
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                <MapPin size={14} className="text-blue-600 dark:text-blue-400" />
                Physical Address
              </span>
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. 123 Main St, City"
              className={inputClass} style={{padding:"10px"}}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>
            <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
              <FileText size={14} className="text-blue-600 dark:text-blue-400" />
              About / Description
            </span>
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Library mission, working hours, and policies..."
            className="w-full rounded-2xl border border-slate-200
             dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm text-slate-800
              dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 
              outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30" style={{padding:"10px"}}
          />
        </div>

        <div className="pt-2 flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-sm transition disabled:opacity-60" style={{padding:"10px"}}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}