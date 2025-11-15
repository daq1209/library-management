import { FaClipboardList, FaClockRotateLeft, FaCircleCheck } from "react-icons/fa6";

export default function Orders() {
  // Mock states (later integrate backend)
  const mock = [
    { id: 1, title: "Clean Code", status: "approved" },
    { id: 2, title: "You Don't Know JS", status: "pending" },
  ];

  const statusIcon = (s) => {
    if (s === "approved") return <FaCircleCheck className="text-green-600" />;
    if (s === "pending") return <FaClockRotateLeft className="text-yellow-500" />;
    return <FaClipboardList className="text-slate-400" />;
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <FaClipboardList className="w-6 h-6 text-primary" />
        <h1 className="text-3xl font-bold text-slate-800">Đơn hàng</h1>
      </div>
      <p className="text-slate-600 mb-6">Các yêu cầu / đơn mượn sách của bạn.</p>

      <div className="space-y-3">
        {mock.map((o) => (
          <div key={o.id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-md p-4 shadow-sm">
            {statusIcon(o.status)}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">{o.title}</p>
              <p className="text-xs text-slate-500">Trạng thái: {o.status}</p>
            </div>
            <button className="text-xs px-3 py-1 rounded bg-slate-100 hover:bg-slate-200">Chi tiết</button>
          </div>
        ))}
      </div>
    </section>
  );
}
