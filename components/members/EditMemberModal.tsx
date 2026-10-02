"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { MemberService } from "@/services/member.service";

type Props = {
  open: boolean;
  onClose: () => void;
  member: any;
};

export default function EditMemberModal({
  open,
  onClose,
  member,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        address: member.address || "",
      });
    }
  }, [member]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateMember = async () => {
    if (!member?._id) return;

    try {
      setLoading(true);

      await MemberService.updateMember(
        member._id,
        form
      );

      alert("Member Updated Successfully");

      onClose();
    } catch (error) {
      console.log(error);
      alert("Failed to update member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50" >

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8" style={{margin: "25px",padding:"15px"}}>

        <div className="flex justify-between items-center mb-8" style={{margin: "25px",padding:"15px"}}>

          <h2 className="text-3xl font-bold" >
            Edit Member
          </h2>

          <button onClick={onClose}>
            <X size={28} />
          </button>

        </div>

        <div className="grid grid-cols-2 gap-5">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border rounded-xl h-12 px-4" style={{padding:"15px"}}
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-xl h-12 px-4" style={{padding:"15px"}}
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded-xl h-12 px-4" style={{padding:"15px"}}
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border rounded-xl h-12 px-4" style={{padding:"15px"}}
          />

        </div>

        <textarea
          rows={4}
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="border rounded-xl w-full mt-5 p-4" style={{marginTop:"15px",padding:"15px"}}
        />

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border" style={{margin: "25px",padding:"15px"}}
          >
            Cancel
          </button>

          <button
            onClick={updateMember}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-600 text-white disabled:opacity-50"style={{margin: "25px",padding:"15px"}}
          >
            {loading ? "Updating..." : "Update Member"}
          </button>

        </div>

      </div>

    </div>
  );
}