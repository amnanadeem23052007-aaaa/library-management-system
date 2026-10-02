import {
  BookOpen,
  Users,
  RotateCcw,
  BookMarked,
} from "lucide-react";

const stats = [
  {
    title: "Books",
    value: 245,
    icon: BookOpen,
  },
  {
    title: "Members",
    value: 86,
    icon: Users,
  },
  {
    title: "Issued",
    value: 48,
    icon: BookMarked,
  },
  {
    title: "Returned",
    value: 170,
    icon: RotateCcw,
  },
];

export default function Statistics() {
  return (
    <div className="grid md:grid-cols-4 gap-6">

      {stats.map((item) => {

        const Icon = item.icon;

        return (

          <div
            key={item.title}
            className="bg-white rounded-3xl shadow-lg p-6"
          >

            <Icon
              className="text-blue-600"
              size={40}
            />

            <h2 className="text-4xl font-bold mt-4">
              {item.value}
            </h2>

            <p className="text-gray-500 mt-2">
              {item.title}
            </p>

          </div>

        );
      })}

    </div>
  );
}