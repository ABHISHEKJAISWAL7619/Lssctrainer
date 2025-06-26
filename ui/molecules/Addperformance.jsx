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
import Image from "next/image";

const Addperformance = ({ reportId }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [batchOptions, setBatchOptions] = useState(["Select Batch"]);
  const [batchMap, setBatchMap] = useState({});
  const [batchNameMap, setBatchNameMap] = useState({});
  const [selectedBatch, setSelectedBatch] = useState("Select Batch");
  const [error, setError] = useState();

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

    if (!batchMap[selectedBatch]) {
      setError("Invalid batch selected");
      return;
    }

    if (!formData.timeOfReporting) {
      setError("Please enter Time of Reporting");
      return;
    }
    if (!formData.sessionTime) {
      setError("Please enter Session Time");
      return;
    }
    if (!formData.totalBatchStrength) {
      setError("Please enter Total Batch Strength");
      return;
    }
    if (!formData.noOfStudentsAttended) {
      setError("Please enter No of Students Attended");
      return;
    }
    if (!formData.practicalSkillRating) {
      setError("Please enter Practical Skill Rating");
      return;
    }
    if (!formData.theoryUnderstandingRating) {
      setError("Please enter Theory Understanding Rating");
      return;
    }
    if (!formData.behavioralFeedback) {
      setError("Please enter Behavioral Feedback");
      return;
    }
    if (!formData.overallPassStatus) {
      setError("Please enter Overall Pass/Fail Status");
      return;
    }
    if (!formData.certificationStatus) {
      setError("Please enter Certification Status");
      return;
    }

    setError("");

    const dataform = {
      batchId: batchMap[selectedBatch],
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
        let res = await dispatch(
          updatebatchperformanceBYiD({ dataform, reportId })
        );
        toast.success(res.payload.message);
      } else {
        let res = await dispatch(createbatchperformance(dataform));
        toast.success(res.payload.message);
      }
      router.push("/daily-report");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <Select
              label="Training Today"
              name="trainingToday"
              options={["Yes", "No"]}
              value={formData.trainingToday}
              onChange={handleChange}
            />
            <Input
              label="Time of Reporting"
              placeholder="16:40 hrs"
              name="timeOfReporting"
              value={formData.timeOfReporting}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Session Time"
            placeholder="4 hrs"
            name="sessionTime"
            value={formData.sessionTime}
            onChange={handleChange}
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              label="Total Batch Strength"
              name="totalBatchStrength"
              value={formData.totalBatchStrength}
              onChange={handleChange}
            />
            <Input
              label="No of Students Attended"
              name="noOfStudentsAttended"
              value={formData.noOfStudentsAttended}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              label="Practical Skill Rating"
              name="practicalSkillRating"
              placeholder="Rate out of 5"
              value={formData.practicalSkillRating}
              onChange={handleChange}
            />
            <Input
              label="Theory Understanding Rating"
              name="theoryUnderstandingRating"
              placeholder="Rate out of 5"
              value={formData.theoryUnderstandingRating}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Behavioral Feedback"
            name="behavioralFeedback"
            value={formData.behavioralFeedback}
            onChange={handleChange}
          />

          <Select
            label="Assessment Today"
            name="assessmentToday"
            options={["Yes", "No"]}
            value={formData.assessmentToday}
            onChange={handleChange}
          />

          <div className="flex flex-col lg:flex-row gap-4">
            <Input
              label="Overall Pass/Fail Status"
              name="overallPassStatus"
              value={formData.overallPassStatus}
              onChange={handleChange}
            />
            <Input
              label="Certification Status"
              name="certificationStatus"
              value={formData.certificationStatus}
              onChange={handleChange}
            />
          </div>

          <div className="border-[#BFDBFE] rounded-xl gap-2 border p-4 bg-[#EFF6FF]">
            <span className="flex gap-2 items-center text-[#1E40AF] font-medium text-sm">
              <Image
                className="w-4 h-4"
                src="/icon/i.png"
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
          <p className="text-red-500">{error}</p>

          <div className="flex justify-end pt-6 gap-4">
            <button
              type="button"
              className="border-[#D1D5DB] rounded-md py-2 px-4 border"
              onClick={handleClear}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-6 rounded-md"
            >
              {reportId ? "Update Info" : "Submit Info"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Addperformance;
