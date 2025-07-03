"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getallbatchperformance,
  deleteperformance,
} from "@/redux/slice/batchperformance-slice";
import { getallbatch } from "@/redux/slice/batch-slice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OverlayModal from "../common/OverlayModal";
import Pagination from "../common/pagination";

const DailyReport = ({ page }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [batchNameMap, setBatchNameMap] = useState({});
  const [allperformance, setAllPerformance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false); // modal state
  const [deleteId, setDeleteId] = useState(null); // store selected id
  const [count, setCount] = useState(0);

  const fetchBatchMap = async () => {
    const res = await dispatch(getallbatch());
    const map = {};
    res.payload?.data?.forEach((b) => (map[b._id] = b.name));
    setBatchNameMap(map);
  };

  const fetchAllPerformances = async () => {
    const res = await dispatch(
      getallbatchperformance({ filter: { limit: 6, page } })
    );
    setCount(res.payload.count);
    setAllPerformance(res.payload?.data || []);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteperformance(id));
    toast.success("Performance deleted");
    fetchAllPerformances();
    setShowModal(false);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  useEffect(() => {
    fetchBatchMap();
    fetchAllPerformances();
  }, []);

  return (
    <section className="p-4 space-y-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">All Performances</h2>
        <Link
          href="/daily-report/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          + Add Performance
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-nowrap">
          <thead>
            <tr className="bg-[#f1f4f9] font-semibold text-sm text-gray-600">
              <th className="text-left px-4 py-2">Batch Name</th>
              <th className="text-left px-4 py-2">Strength</th>
              <th className="text-left px-4 py-2">OverAll Pass Status</th>
              <th className="text-left px-4 py-2">Session Time</th>
              <th className="text-center px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allperformance.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No performance available
                </td>
              </tr>
            ) : (
              allperformance.map((item, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 text-sm hover:bg-gray-50"
                >
                  <td className="px-4 text-left py-2">
                    {batchNameMap[item.batchId] || "Unknown"}
                  </td>
                  <td className="px-4 text-left py-2">
                    {item.totalBatchStrength}
                  </td>
                  <td className="px-4 text-left py-2">
                    {item.overallPassStatus}
                  </td>
                  <td className="px-4 text-left py-2">{item.sessionTime}</td>
                  <td className="px-4 text-left py-2">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/daily-report/new/${item._id}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <i className="ri-edit-box-line ri-xl"></i>
                      </Link>
                      <span
                        onClick={() => confirmDelete(item._id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <i className="ri-delete-bin-6-line ri-xl"></i>
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination total={count} pageSize={6} />

      {showModal && (
        <OverlayModal
          content={
            <div className="bg-white p-6 rounded-md shadow-md space-y-4 text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete this performance?
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4  cursor-pointer py-2 border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          }
        />
      )}
    </section>
  );
};

export default DailyReport;
