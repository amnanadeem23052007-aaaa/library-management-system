"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import Loader from "@/components/common/Loader";
import { useMemberRefresh } from "@/components/member/MemberRefreshContext";

type MemberProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  isProfileComplete?: boolean;
};

const inputClass =
  "w-full h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const labelClass =
  "block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2";

export default function MyProfilePage() {
  const { refresh, refreshKey } = useMemberRefresh();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/member/profile", { cache: "no-store" });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(`Server error (${response.status}): API returned HTML instead of JSON.`);
      }
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load profile");
      }
      setMember(data.member);
      setForm({
        name: data.member.name || "",
        phone: data.member.phone || "",
        address: data.member.address || "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [refreshKey]);

  async function saveProfile(event: React.FormEvent) {
    event.preventDefault();

    const name = form.name.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!name || !phone || !address) {
      toast.error(
        "Please fill in all required fields (Full Name, Phone Number, and Address) to complete your profile."
      );
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, address }),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(`Server error (${response.status}): API returned HTML instead of JSON.`);
      }
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }
      setMember(data.member);
      toast.success(
        "Profile updated successfully! You can now browse and borrow books."
      );
      refresh();
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 sm:p-20 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-600">
        {error || "Profile could not be loaded."}
      </div>
    );
  }

  const isComplete =
    member.isProfileComplete ||
    Boolean(
      member.name?.trim() && member.phone?.trim() && member.address?.trim()
    );

  return (
    <div className="space-y-8 sm:space-y-10 max-w-4xl" style={{padding:"10px"}}>
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900" style={{padding:"10px"}}>
          My Profile
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-500" style={{padding:"10px"}}>
          Manage your personal details and library member account information.
        </p>
      </div>

      {/* Completion Alerts */}
      {!isComplete ? (
        <div className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-900 shadow-sm flex items-start gap-4" >
          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5"  />
          <div>
            <h3 className="font-bold text-sm text-amber-900" >
              Action Required: Complete Your Profile
            </h3>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed" >
              You must provide your <strong>Full Name</strong>,{" "}
              <strong>Phone Number</strong>, and <strong>Physical Address</strong> before you can browse, issue, or borrow books from the library.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 shadow-sm flex items-center gap-3" style={{padding:"10px"}}>
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs sm:text-sm font-semibold text-emerald-800">
            Profile Completed — You have active borrowing and catalog privileges.
          </p>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 lg:p-10 transition-colors duration-200" style={{padding:"10px",margin:"10px"}}>
        {/* User Info Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-8 mb-8 border-b border-slate-100" style={{padding:"10px"}}>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
            {member.name?.charAt(0)?.toUpperCase() || "M"}
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0" style={{padding:"10px"}}>
            <h2 className="text-2xl font-bold text-slate-900 truncate" >
              {member.name || "Member"}
            </h2>
            <p className="text-sm text-slate-500 truncate mt-0.5">
              {member.email}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3" >
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200/50 capitalize" style={{padding:"10px"}}>
                {member.role || "Member"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isComplete
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                    : "bg-amber-50 text-amber-800 border-amber-200/50"
                }`} style={{padding:"10px"}}
              >
                {isComplete ? (
                  <>
                    <CheckCircle2 size={13} />
                    Profile Completed
                  </>
                ) : (
                  <>
                    <AlertTriangle size={13} />
                    Incomplete Profile
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={saveProfile} className="space-y-6" style={{padding:"10px"}}>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                  <User size={14} className="text-blue-600" />
                  Full Name *
                </span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your full name"
                className={inputClass} style={{padding:"10px"}}
              />
            </div>

            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                  <Mail size={14} className="text-blue-600" />
                  Email Address (Read-only)
                </span>
              </label>
              <input
                type="email"
                disabled
                value={member.email}
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 px-4 text-sm cursor-not-allowed outline-none" style={{padding:"10px"}}
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Email is tied to your account authentication and cannot be changed.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                  <Phone size={14} className="text-blue-600" />
                  Phone Number *
                </span>
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="e.g. +1 234 567 8900"
                className={inputClass} style={{padding:"10px"}}
              />
            </div>

            <div>
              <label className={labelClass}>
                <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                  <ShieldCheck size={14} className="text-blue-600" />
                  Member Role
                </span>
              </label>
              <input
                type="text"
                disabled
                value={member.role}
                className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 px-4 text-sm cursor-not-allowed outline-none capitalize" style={{padding:"10px"}}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <span className="flex items-center gap-1.5" style={{padding:"10px"}}>
                <MapPin size={14} className="text-blue-600" />
                Physical Address *
              </span>
            </label>
            <textarea
              rows={3}
              required
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              placeholder="Enter your street address, city, and postal code..."
              className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800
               placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" style={{padding:"10px"}}
            />
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-sm 
              transition disabled:opacity-60 flex items-center gap-2" style={{padding:"10px"}}
            >
              {saving ? "Saving Changes..." : "Save Profile & Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
