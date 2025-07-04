"use client";

import { deletebatch, getallbatch } from "@/redux/slice/batch-slice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Pagination from "../common/pagination";
import { limitTextLength } from "@/utils/limitText";
import toast from "react-hot-toast";
import OverlayModal from "../common/OverlayModal";

const Batches = ({ page }) => {
  const dispatch = useDispatch();
  const [batches, setBatches] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedBatchId, setSelectedBatchId] = useState(null);

  const fetchBatches = async () => {
    try {
      const res = await dispatch(getallbatch({ filter: { limit: 6, page } }));
      setCount(res.payload.count);
      const allBatches = res?.payload?.data;
      if (Array.isArray(allBatches)) {
        setBatches(allBatches);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [dispatch]);

  const confirmDelete = (id) => {
    setSelectedBatchId(id);
  };

  const handleDeleteConfirmed = async () => {
    if (!selectedBatchId) return;
    try {
      const res = await dispatch(deletebatch(selectedBatchId));
      if (res?.payload) {
        toast.success(res.payload.message);
      } else {
        toast.error("Delete failed");
      }
      fetchBatches();
    } catch (err) {
      toast.error("Error deleting batch");
    } finally {
      setSelectedBatchId(null);
    }
  };

  const handleCancel = () => {
    setSelectedBatchId(null);
  };

  return (
    <section>
      <Link href="/">
        <Image
          className="w-8 mb-6 h-8"
          src={"/icon/back.png"}
          alt="back"
          width={100}
          height={100}
        />
      </Link>

      <div className="space-y-6 bg-white p-6 rounded-xl">
        <h3 className="flex text-2xl justify-between items-center text-secondary font-semibold">
          Batches
        </h3>

        <div className="overflow-x-auto">
          <div className="min-w-[1000px] lg:min-w-full">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Batch Name</th>
                  <th className="text-left p-2">Trainer Name</th>
                  <th className="text-left p-2">Course Name</th>
                  <th className="text-left p-2">Start At</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.length > 0 ? (
                  batches.map((batch) => (
                    <tr key={batch._id} className="border-b border-quinary">
                      <td className="p-2 text-left">{batch?.name}</td>
                      <td className="p-2 text-left">
                        {batch?.trainer?.name || "N/A"}
                      </td>
                      <td className="p-2 text-left">
                        {limitTextLength(batch?.course?.title, 50) || "N/A"}
                      </td>
                      <td className="p-2 text-left">
                        {new Date(batch?.startAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 text-left py-2">
                        <div className="flex justify-center gap-3">
                          <span
                            onClick={() => confirmDelete(batch._id)}
                            className="cursor-pointer text-red-500 hover:text-red-700"
                          >
                            <i className="ri-delete-bin-6-line ri-xl"></i>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-2 text-center text-gray-500">
                      Loading batch data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination total={count} pageSize={6} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedBatchId && (
        <OverlayModal
          content={
            <div className="bg-white rounded-lg shadow-lg p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-red-100 text-red-600 w-12 h-12 flex items-center justify-center rounded-full">
                  <i className="ri-alert-line ri-2x"></i>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Delete Batch?</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this batch? This action cannot
                be undone.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  className="px-4 py-2 bg-red-600  cursor-pointer text-white rounded hover:bg-red-700 shadow transition"
                >
                  Delete
                </button>
              </div>
            </div>
          }
        />
      )}
    </section>
  );
};

export default Batches;
