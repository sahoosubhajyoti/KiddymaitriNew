"use client";

export default function ExportReport() {

  const exportData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/analytics/metadata/export/`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    );
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.json";
    a.click();
  };

  return (
    <div className="min-h-[60vh] mt-14 bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Export Metadata</h1>
      <button
        onClick={exportData}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Export JSON
      </button>
    </div>
  );
}
