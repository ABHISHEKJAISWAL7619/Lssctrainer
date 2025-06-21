"use client";
import Image from "next/image";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Textarea from "../atoms/Textarea";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createbatchperformance,
  deleteperformance,
  getallbatchperformance,
  getallbatchperformanceBYiD,
  updatebatchperformanceBYiD,
} from "@/redux/slice/batchperformance-slice";
import { getallbatch } from "@/redux/slice/batch-slice";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

const DailyReport = ({ reportId }) => {
  const dispatch = useDispatch();
  let router = useRouter();

  const [batchOptions, setBatchOptions] = useState(["Select Batch"]);
  const [batchMap, setBatchMap] = useState({});
  const [batchNameMap, setBatchNameMap] = useState({});
  const [selectedBatch, setSelectedBatch] = useState("Select Batch");
  const [allperformance, setallperformance] = useState([]);
  const [error, seterror] = useState();

  const [formData, setFormData] = useState({
    trainingToday: "",
    timeOfReporting: "",
    sessionTime: "",
    totalBatchStrength: "",
    noOfStudentsAttended: "",
    practicalSkillRating: "",
    theoryUnderstandingRating: "",
    behavioralFeedback: "",
    assessmentToday: "",
    overallPassStatus: "",
    certificationStatus: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(allperformance.length / itemsPerPage);
  const paginatedData = allperformance.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchbatch = async () => {
    try {
      const res = await dispatch(getallbatch());
      if (res.payload?.data) {
        const batches = res.payload.data;
        const options = ["Select Batch", ...batches.map((batch) => batch.name)];
        const nameToId = {};
        const idToName = {};
        batches.forEach((batch) => {
          nameToId[batch.name] = batch._id;
          idToName[batch._id] = batch.name;
        });

        setBatchOptions(options);
        setBatchMap(nameToId);
        setBatchNameMap(idToName);
      }
    } catch (error) {
      console.error("Error fetching batch:", error);
    }
  };

  useEffect(() => {
    fetchbatch();
  }, []);

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchbatchperformance = async () => {
    try {
      const res = await dispatch(getallbatchperformance());
      if (res.payload?.data) {
        setallperformance(res.payload.data);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error fetching performance:", error);
    }
  };

  useEffect(() => {
    fetchbatchperformance();
  }, []);

  useEffect(() => {
    const performancebyId = async () => {
      let res = await dispatch(getallbatchperformanceBYiD(reportId));
      let data = res.payload.data;

      setFormData({
        trainingToday: data.trainingToday ? "Yes" : "No",
        timeOfReporting: data.timeOfReporting || "",
        sessionTime: data.sessionTime || "",
        totalBatchStrength: data.totalBatchStrength || "",
        noOfStudentsAttended: data.noOfStudentsAttended || "",
        practicalSkillRating: data.practicalSkillRating || "",
        theoryUnderstandingRating: data.theoryUnderstandingRating || "",
        behavioralFeedback: data.behavioralFeedback || "",
        assessmentToday: data.assessmentToday ? "Yes" : "No",
        overallPassStatus: data.overallPassStatus || "",
        certificationStatus: data.certificationStatus || "",
      });

      // set batch name based on batchId
      setSelectedBatch(batchNameMap[data.batchId] || "Select Batch");
    };
    performancebyId();
  }, [reportId, batchNameMap]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!formData.batchId) {
  //     seterror("batch is required");
  //     return;
  //   }
  //   if (!formData.trainer) {
  //     seterror("Trainer is required");
  //     return;
  //   }
  //   if (!formData.trainingToday) {
  //     seterror("Training Today is required");
  //     return;
  //   }
  //   if (!formData.timeOfReporting) {
  //     seterror("Time of Reporting is required");
  //     return;
  //   }
  //   if (!formData.sessionTime) {
  //     seterror("Session Time is required");
  //     return;
  //   }
  //   if (!formData.totalBatchStrength) {
  //     seterror("Total Batch Strength is required");
  //     return;
  //   }
  //   if (!formData.noOfStudentsAttended) {
  //     seterror("No of Students Attended is required");
  //     return;
  //   }
  //   if (!formData.practicalSkillRating) {
  //     seterror("Practical Skill Rating is required");
  //     return;
  //   }
  //   if (!formData.theoryUnderstandingRating) {
  //     seterror("Theory Understanding Rating is required");
  //     return;
  //   }

  //   const dataform = {
  //     batchId: batchMap[selectedBatch],
  //     trainer: "60f6a3b5b25c4a3f88d1e4c3",
  //     trainingToday: formData.trainingToday === "Yes",
  //     timeOfReporting: formData.timeOfReporting,
  //     sessionTime: formData.sessionTime,
  //     totalBatchStrength: parseInt(formData.totalBatchStrength),
  //     noOfStudentsAttended: parseInt(formData.noOfStudentsAttended),
  //     practicalSkillRating: parseInt(formData.practicalSkillRating),
  //     theoryUnderstandingRating: parseInt(formData.theoryUnderstandingRating),
  //     behavioralFeedback: formData.behavioralFeedback,
  //     assessmentToday: formData.assessmentToday === "Yes",
  //     overallPassStatus: formData.overallPassStatus,
  //     certificationStatus: parseInt(formData.certificationStatus),
  //     userid: "6842a0dc6d48379fcefcec9e",
  //   };

  //   if (reportId) {
  //     dispatch(updatebatchperformanceBYiD({ dataform, reportId })).unwrap();
  //     toast.success("Performance updated successfully");
  //     setFormData({
  //       trainingToday: "",
  //       timeOfReporting: "",
  //       sessionTime: "",
  //       totalBatchStrength: "",
  //       noOfStudentsAttended: "",
  //       practicalSkillRating: "",
  //       theoryUnderstandingRating: "",
  //       behavioralFeedback: "",
  //       assessmentToday: "",
  //       overallPassStatus: "",
  //       certificationStatus: "",
  //     });
  //     router.push("/daily-report");
  //   } else {
  //     dispatch(createbatchperformance(dataform));
  //     toast.success("Performance created successfully");
  //     fetchbatchperformance();
  //     handleclear();
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    seterror("");

    const requiredFields = [
      "trainingToday",
      "timeOfReporting",
      "sessionTime",
      "totalBatchStrength",
      "noOfStudentsAttended",
      "practicalSkillRating",
      "theoryUnderstandingRating",
      "overallPassStatus",
      "certificationStatus",
      "behavioralFeedback",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        seterror(`${field.replace(/([A-Z])/g, " $1")} is required`);
        return;
      }
    }

    if (selectedBatch === "Select Batch") {
      seterror("Batch is required");
      return;
    }

    const dataform = {
      batchId: batchMap[selectedBatch],
      trainer: "60f6a3b5b25c4a3f88d1e4c3",
      trainingToday: formData.trainingToday === "Yes",
      timeOfReporting: formData.timeOfReporting,
      sessionTime: formData.sessionTime,
      totalBatchStrength: parseInt(formData.totalBatchStrength),
      noOfStudentsAttended: parseInt(formData.noOfStudentsAttended),
      practicalSkillRating: parseInt(formData.practicalSkillRating),
      theoryUnderstandingRating: parseInt(formData.theoryUnderstandingRating),
      behavioralFeedback: formData.behavioralFeedback,
      assessmentToday: formData.assessmentToday === "Yes",
      overallPassStatus: formData.overallPassStatus,
      certificationStatus: parseInt(formData.certificationStatus),
      userid: "6842a0dc6d48379fcefcec9e",
    };

    if (reportId) {
      dispatch(updatebatchperformanceBYiD({ dataform, reportId })).unwrap();
      toast.success("Performance updated successfully");
      setFormData({
        trainingToday: "",
        timeOfReporting: "",
        sessionTime: "",
        totalBatchStrength: "",
        noOfStudentsAttended: "",
        practicalSkillRating: "",
        theoryUnderstandingRating: "",
        behavioralFeedback: "",
        assessmentToday: "",
        overallPassStatus: "",
        certificationStatus: "",
      });
      router.push("/daily-report");
    } else {
      let res = await dispatch(createbatchperformance(dataform));
      console.log(res.payload.message);
      toast.success(res.payload.message);
      fetchbatchperformance();
      handleclear();
    }
  };

  const handleclear = () => {
    setSelectedBatch("Select Batch");
    setFormData({
      trainingToday: "",
      timeOfReporting: "",
      sessionTime: "",
      totalBatchStrength: "",
      noOfStudentsAttended: "",
      practicalSkillRating: "",
      theoryUnderstandingRating: "",
      behavioralFeedback: "",
      assessmentToday: "",
      overallPassStatus: "",
      certificationStatus: "",
    });
  };

  const handledelete = (id) => {
    dispatch(deleteperformance(id));
    toast.success("performance deleted successfully");
    fetchbatchperformance();
  };

  return (
    <section className="space-y-6">
      <h2 className="font-bold text-3xl">Batch Performance Input</h2>
      <div className="bg-white p-3 lg:p-4 rounded-xl border border-quinary">
        <form className="lg:w-[60%] space-y-4 mx-auto" onSubmit={handleSubmit}>
          <Select
            label={"Batch Name"}
            name={"batchname"}
            options={batchOptions}
            value={selectedBatch}
            onChange={handleBatchChange}
          />
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <Select
              label={"Training Today"}
              name={"trainingToday"}
              options={["Yes", "No"]}
              value={formData.trainingToday}
              onChange={handleChange}
            />
            <Input
              label={"Time of Reporting"}
              placeholder={"16:40 hrs"}
              name="timeOfReporting"
              value={formData.timeOfReporting}
              onChange={handleChange}
            />
          </div>
          <Input
            label={"Session Time"}
            placeholder={"4 hrs"}
            name="sessionTime"
            value={formData.sessionTime}
            onChange={handleChange}
          />
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <Input
              label={"Total Batch Strength"}
              name="totalBatchStrength"
              value={formData.totalBatchStrength}
              onChange={handleChange}
            />
            <Input
              label={"No of Students Attended"}
              name="noOfStudentsAttended"
              value={formData.noOfStudentsAttended}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <Input
              label={"Practical Skill Rating"}
              name="practicalSkillRating"
              value={formData.practicalSkillRating}
              onChange={handleChange}
              placeholder={"give practical skill rating under 5"}
            />
            <Input
              label={"Theory Understanding Rating"}
              name="theoryUnderstandingRating"
              value={formData.theoryUnderstandingRating}
              onChange={handleChange}
              placeholder={"give theory understanding rating under 5"}
            />
          </div>
          <Textarea
            label={"Behavioral Feedback"}
            name="behavioralFeedback"
            value={formData.behavioralFeedback}
            onChange={handleChange}
          />
          <Select
            label={"Assessment Today"}
            name="assessmentToday"
            options={["Yes", "No"]}
            value={formData.assessmentToday}
            onChange={handleChange}
          />
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <Input
              label={"Overall Pass/Fail Status"}
              name="overallPassStatus"
              value={formData.overallPassStatus}
              onChange={handleChange}
            />
            <Input
              label={"Certification Status"}
              name="certificationStatus"
              value={formData.certificationStatus}
              onChange={handleChange}
            />
          </div>
          <div className="border-[#BFDBFE] rounded-xl gap-2 border p-4 bg-[#EFF6FF]">
            <span className="space-x-2 flex gap-2 items-center text-[#1E40AF] font-medium text-sm">
              <Image
                className="w-4 h-4"
                src={"/icon/i.png"}
                width={100}
                height={100}
                alt="info"
              />
              Tips for filling the form
            </span>
            <ul className="list-disc text-sm ps-10 text-[#1D4ED8]">
              <li>All fields marked with * are mandatory</li>
              <li>Use your official email address</li>
              <li>Phone number should include country code</li>
            </ul>
          </div>
          <span className="text-red-500">{error}</span>
          <div className="flex justify-end pt-6 gap-4">
            <button
              type="button"
              className="border-[#D1D5DB] rounded-md py-2 px-4 border"
              onClick={handleclear}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md"
            >
              Update Info
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4 mt-10">
          <h3 className="text-2xl font-semibold">Previous Performances</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-nowrap">
            <thead>
              <tr className="bg-[#f1f4f9] font-semibold text-sm text-gray-600">
                <th>Batch Name</th>
                <th>Strength</th>
                <th>OverAll Pass Status</th>
                <th>Session Time</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No performance available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 text-sm">
                    <td>{batchNameMap[item.batchId] || "Unknown"}</td>
                    <td>{item.totalBatchStrength}</td>
                    <td>{item.overallPassStatus}</td>
                    <td>{item.sessionTime}</td>
                    <td className="flex justify-center gap-3 py-2">
                      {/* <Link
                        href={`/daily-report/${item._id}`}
                        className="cursor-pointer text-gray-600 hover:text-blue-600"
                      >
                        <i className="ri-edit-box-line ri-xl"></i>
                      </Link> */}
                      <i className="ri-git-repository-private-line ri-xl cursor-pointer text-gray-600 hover:text-blue-600"></i>
                      <span onClick={() => handledelete(item._id)}>
                        <i className="ri-delete-bin-6-line ri-xl cursor-pointer text-red-500 hover:text-red-700"></i>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-4 mt-4">
            <button
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default DailyReport;
