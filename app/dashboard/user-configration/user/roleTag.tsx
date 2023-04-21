export default function RoleTag({ role }: { role: string }) {
  const statusMapper: {[index: string]:  {name: string, colorClass: string}} = {
    "ADMIN": {
      name: "Admin",
      colorClass: "bg-green-100 text-green-700"
    },
    "PUBLIC": {
      name: "Public",
      colorClass: "bg-blue-100 text-blue-900"
    },
    "ROOT": {
      name: "Root",
      colorClass: "bg-red-100 text-red-900"
    },
    "WORKER": {
      name: "Worker",
      colorClass: "bg-orange-100 text-orange-900"
    },
  }
  return (
    <span className={`px-3 py-1.5 m-1 rounded-md text-base font-normal leading-4 ${statusMapper[role].colorClass}`}>
      {statusMapper[role].name}
    </span>
  );
}