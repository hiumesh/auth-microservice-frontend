export default function StatusTag({ status }: { status: string }) {
  const statusMapper: {[index: string]:  {name: string, colorClass: string}} = {
    "ACTIVE": {
      name: "Active",
      colorClass: "bg-green-100 text-green-700"
    },
    "PENDING": {
      name: "Pending",
      colorClass: "bg-blue-100 text-blue-900"
    },
    "SUSPENDED": {
      name: "Suspended",
      colorClass: "bg-red-100 text-red-900"
    },
    "INACTIVE": {
      name: "In Active",
      colorClass: "bg-grey-100 text-grey-900"
    },
  }
  return (
    <span className={`px-3 py-1.5 rounded-full text-base font-normal leading-4 ${statusMapper[status].colorClass}`}>
      {statusMapper[status].name}
    </span>
  );
}