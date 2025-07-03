"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createbatchperformance,
  getallbatchperformanceBYiD,
  updatebatchperformanceBYiD,
} from "@/redux/slice/batchperformance-slice";
import { getallbatch } from "@/redux/slice/batch-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Select from "../atoms/Select";
import Input from "../atoms/Input";
import Textarea from "../atoms/Textarea";

const Addperformance = ({ reportId }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [batchOptions, setBatchOptions] = useState(["Select Batch"]);
  const [batchMap, setBatchMap] = useState({});
  const [batchNameMap, setBatchNameMap] = useState({});
  const [selectedBatch, setSelectedBatch] = useState("Select Batch");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

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
    overallPassStatus: "Pass",
    certificationStatus: "",
  });

  const fetchBatches = async () => {
    const res = await dispatch(getallbatch());
    const data = res.payload?.data || [];
    const options = ["Select Batch", ...data.map((b) => b.name)];
    const nameToId = {},
      idToName = {};
    data.forEach((b) => {
      nameToId[b.name] = b._id;
      idToName[b._id] = b.name;
    });
    setBatchOptions(options);
    setBatchMap(nameToId);
    setBatchNameMap(idToName);
  };

  const fetchFormData = async () => {
    const res = await dispatch(getallbatchperformanceBYiD(reportId));
    const data = res.payload?.data;
    if (data) {
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
      setSelectedBatch(batchNameMap[data.batchId] || "Select Batch");
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (reportId && Object.keys(batchNameMap).length > 0) {
      fetchFormData();
    }
  }, [reportId, batchNameMap]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedBatch === "Select Batch") {
      setError("Please select a batch");
      return;
    }

    const batchId = batchMap[selectedBatch.trim()];
    if (!batchId) {
      setError("Invalid batch selected");
      return;
    }

    if (!formData.timeOfReporting)
      return setError("Please enter Time of Reporting");
    if (!formData.sessionTime) return setError("Please enter Session Time");
    if (!formData.totalBatchStrength)
      return setError("Please enter Total Batch Strength");
    if (!formData.noOfStudentsAttended)
      return setError("Please enter No of Students Attended");
    if (!formData.practicalSkillRating)
      return setError("Please enter Practical Skill Rating");
    if (formData.practicalSkillRating < 1 || formData.practicalSkillRating > 5)
      return setError("Practical Skill Rating must be between 1 and 5");
    if (!formData.theoryUnderstandingRating)
      return setError("Please enter Theory Understanding Rating");
    if (
      formData.theoryUnderstandingRating < 1 ||
      formData.theoryUnderstandingRating > 5
    )
      return setError("Theory Understanding Rating must be between 1 and 5");
    if (!formData.behavioralFeedback)
      return setError("Please enter Behavioral Feedback");
    if (!formData.overallPassStatus)
      return setError("Please enter Overall Pass/Fail Status");
    if (!formData.certificationStatus)
      return setError("Please enter Certification Status");

    setError("");
    setLoading(true);

    const dataform = {
      batchId,
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
    };

    try {
      if (reportId) {
        const res = await dispatch(
          updatebatchperformanceBYiD({ dataform, reportId })
        );
        toast.success(res.payload.message);
      } else {
        const res = await dispatch(createbatchperformance(dataform));
        toast.success(res.payload.message);
      }
      router.push("/daily-report");
    } catch (err) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBatchChange = (e) => setSelectedBatch(e.target.value);
  const handleClear = () => {
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

  return (
    <section className="space-y-6 p-6 bg-white">
      <h2 className="font-bold text-3xl">
        {reportId ? "Edit" : "Add"} Performance
      </h2>

      <div className="p-3 lg:p-6 rounded-xl border border-quinary max-w-4xl mx-auto">
        <form className="w-full space-y-4 mx-auto" onSubmit={handleSubmit}>
          <Select
            label="Batch Name"
            name="batchname"
            options={batchOptions}
            value={selectedBatch}
            onChange={handleBatchChange}
            disabled={loading}
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <Select
              label="Training Today"
              name="trainingToday"
              options={["Yes", "No"]}
              value={formData.trainingToday}
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              type="time"
              label="Time of Reporting"
              name="timeOfReporting"
              value={formData.timeOfReporting}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <Input
            label="Session Time"
            name="sessionTime"
            value={formData.sessionTime}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              type="number"
              label="Total Batch Strength"
              name="totalBatchStrength"
              value={formData.totalBatchStrength}
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              type="number"
              label="No of Students Attended"
              name="noOfStudentsAttended"
              value={formData.noOfStudentsAttended}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              type="number"
              label="Practical Skill Rating"
              name="practicalSkillRating"
              placeholder="Rate out of 5"
              value={formData.practicalSkillRating}
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              type="number"
              label="Theory Understanding Rating"
              name="theoryUnderstandingRating"
              placeholder="Rate out of 5"
              value={formData.theoryUnderstandingRating}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <Textarea
            label="Behavioral Feedback"
            name="behavioralFeedback"
            value={formData.behavioralFeedback}
            onChange={handleChange}
            disabled={loading}
          />

          <Select
            label="Assessment Today"
            name="assessmentToday"
            options={["Yes", "No"]}
            value={formData.assessmentToday}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <Select
              label="Overall Pass/Fail Status"
              name="overallPassStatus"
              options={["Pass", "Fail"]}
              value={formData.overallPassStatus}
              onChange={handleChange}
              disabled={loading}
            />
            <Input
              type="number"
              label="Certification Status"
              name="certificationStatus"
              value={formData.certificationStatus}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <p className="text-red-500">{error}</p>

          <div className="flex justify-end pt-6 gap-4">
            <button
              type="button"
              className="border-[#D1D5DB] rounded-md py-2 px-4 border"
              onClick={handleClear}
              disabled={loading}
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-2 px-6 rounded-md flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8z"
                  ></path>
                </svg>
              ) : reportId ? (
                "Update Info"
              ) : (
                "Submit Info"
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Addperformance;
