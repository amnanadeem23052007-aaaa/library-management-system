import { Inbox } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
}

export default function Empty({
  title = "No Data Found",
  subtitle = "Nothing available right now.",
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow p-12 text-center">

      <Inbox
        size={70}
        className="mx-auto text-gray-400"
      />

      <h2 className="text-2xl font-bold mt-6">
        {title}
      </h2>

      <p className="text-gray-500 mt-3">
        {subtitle}
      </p>

    </div>
  );
}