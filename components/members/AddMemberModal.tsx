"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { MemberService } from "@/services/member.service";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddMemberModal({
  open,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveMember = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.address
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await MemberService.createMember(form);

      alert("Member Added Successfully");

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50" style={{margin: "5px",padding:"15px"}}>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8" style={{margin: "5px",padding:"15px"}}>

        <div className="flex justify-between items-center mb-8" style={{margin: "5px",padding:"15px"}}>

          <h2 className="text-3xl font-bold" style={{margin: "5px",padding:"15px"}}>
            Add Member
          </h2>

          <button onClick={onClose}>
            <X size={28} />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-5" style={{margin: "5px",padding:"15px"}}>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name" 
            className="border rounded-xl h-12 px-4" style={{margin: "5px",padding:"15px"}}
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-xl h-12 px-4" style={{margin: "5px",padding:"15px"}}
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded-xl h-12 px-4" style={{margin: "5px",padding:"15px"}}
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border rounded-xl h-12 px-4" style={{margin: "5px",padding:"15px"}}
          />

        </div>

        <textarea
          rows={4}
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border rounded-xl w-full mt-5 p-4" style={{margin: "5px",padding:"15px"}}
        />

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border" style={{margin: "5px",padding:"15px"}}
          >
            Cancel
          </button>

          <button
            onClick={saveMember}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50" style={{margin: "5px",padding:"15px"}}
          >
            {loading ? "Saving..." : "Save Member"}
          </button>

        </div>

      </div>

    </div>
  );
}