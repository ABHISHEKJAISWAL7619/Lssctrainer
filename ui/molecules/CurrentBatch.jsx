"use client";
import { getallbatch } from "@/redux/slice/batch-slice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const CurrentBatch = () => {
  const dispatch = useDispatch();
  const [firstBatch, setFirstBatch] = useState(null);

  const fetchBatches = async () => {
    try {
      const res = await dispatch(getallbatch({ filter: {} }));
      const batches = res?.payload?.data;
      if (batches && batches.length > 0) {
        setFirstBatch(batches[0]);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [dispatch]);

  return (
    <div className="rounded-xl shadow-lg bg-white p-4 overflow-hidden lg:col-span-3">
      <h3 className="flex justify-between items-center text-secondary font-semibold mb-4">
        Batches
        <Link
          className="text-xs border rounded px-3 py-1 border-gray-500 hover:bg-gray-100 transition"
          href={"/batches"}
        >
          View All
        </Link>
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm  border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border text-left border-gray-200">
                Batch Name
              </th>
              <th className="px-4 py-2 border text-left border-gray-200">
                Trainer Name
              </th>
              <th className="px-4 py-2 border text-left border-gray-200">
                Course Name
              </th>
              <th className="px-4 py-2 border text-left border-gray-200">
                Start At
              </th>
            </tr>
          </thead>
          <tbody>
            {firstBatch ? (
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-left border-gray-200">
                  {firstBatch.name}
                </td>
                <td className="px-4 py-2 border text-left border-gray-200">
                  {firstBatch.trainer?.name || "N/A"}
                </td>
                <td className="px-4 py-2 border text-left border-gray-200">
                  {firstBatch.course?.title || "N/A"}
                </td>
                <td className="px-4 py-2 border text-left border-gray-200">
                  {new Date(firstBatch.startAt).toLocaleDateString("en-IN")}
                </td>
              </tr>
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-2 text-center text-gray-500 border border-gray-200"
                >
                  Loading batch data...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrentBatch;
