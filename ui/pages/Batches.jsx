"use client";
import { getallbatch } from "@/redux/slice/batch-slice";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Batches = () => {
  const dispatch = useDispatch();
  const [batches, setBatches] = useState([]);

  const fetchBatches = async () => {
    try {
      const res = await dispatch(getallbatch());
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
          Batches{" "}
          <Link
            className="text-xs border rounded px-3 border-gray-500"
            href={"/batches"}
          >
            View All
          </Link>
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
                </tr>
              </thead>
              <tbody>
                {batches.length > 0 ? (
                  batches.map((batch) => (
                    <tr key={batch._id} className="border-b border-quinary">
                      <td className="p-2 text-left">{batch.name}</td>
                      <td className="p-2 text-left">
                        {batch.trainer?.name || "N/A"}
                      </td>
                      <td className="p-2 text-left">
                        {batch.course?.title || "N/A"}
                      </td>
                      <td className="p-2 text-left">
                        {new Date(batch.startAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-2 text-center text-gray-500">
                      Loading batch data...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Batches;
