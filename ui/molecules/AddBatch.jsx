"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import { getalltrainers } from "@/redux/slice/user-slice";
import { getallcourse } from "@/redux/slice/course-slice";
import { createbatch } from "@/redux/slice/batch-slice";
import toast from "react-hot-toast";

const AddBatch = ({ onClose }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    batchname: "",
    batchstrength: "",
    trainerId: "",
    courseId: "",
    startAt: "",
  });
  const [error, seterror] = useState();
  const [loading, setLoading] = useState(false);

  const [trainerList, setTrainerList] = useState([]);
  const [courseList, setCourseList] = useState([]);

  const [trainerOptions, setTrainerOptions] = useState(["Select Trainer"]);
  const [courseOptions, setCourseOptions] = useState(["Select Course"]);

  const centerId = "6842a0dc6d48379fcefcec9e";

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        let res = await dispatch(getalltrainers());
        const data = res?.payload?.data;
        if (Array.isArray(data)) {
          setTrainerList(data);
          const options = data.map((t) => t.name);
          setTrainerOptions(["Select Trainer", ...options]);
        }
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      }
    };

    fetchTrainers();
  }, [dispatch]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res = await dispatch(getallcourse());
        const data = res?.payload?.data;
        if (Array.isArray(data)) {
          setCourseList(data);
          const options = data.map((c) => c.title);
          setCourseOptions(["Select Course", ...options]);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "trainerName") {
      const trainer = trainerList.find((t) => t.name === value);
      setFormData((prev) => ({
        ...prev,
        trainerId: trainer ? trainer._id : "",
      }));
    } else if (name === "courseName") {
      const course = courseList.find((c) => c.title === value);
      setFormData((prev) => ({
        ...prev,
        courseId: course ? course._id : "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    seterror("");

    if (!formData.batchname) return seterror("Batch name is required");
    if (!formData.trainerId) return seterror("Trainer is required");
    if (!formData.batchstrength) return seterror("Batch strength is required");
    if (!formData.courseId) return seterror("Course is required");
    if (!formData.startAt) return seterror("Start date is required");

    // validate start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(formData.startAt);
    startDate.setHours(0, 0, 0, 0);

    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    threeMonthsLater.setHours(0, 0, 0, 0);

    if (startDate < today) {
      seterror("Start date cannot be in the past.");
      return;
    }

    if (startDate > threeMonthsLater) {
      seterror("Start date must be within 3 months from today.");
      return;
    }

    const payload = {
      name: formData.batchname,
      strength: Number(formData.batchstrength),
      trainer: formData.trainerId,
      course: formData.courseId,
      centerId,
      startAt: startDate.toISOString(),
    };

    try {
      setLoading(true);
      const res = await dispatch(createbatch(payload));
      toast.success(res.payload.message);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm z-40"
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white w-full max-w-3xl rounded-xl space-y-6 p-8 mx-auto shadow-lg relative">
          <h2 className="text-2xl font-bold text-center">Add New Batch</h2>

          <form className="space-y-5 text-gray-700" onSubmit={handleSubmit}>
            <Input
              label="Batch Name *"
              name="batchname"
              type="text"
              placeholder="Enter batch name"
              value={formData.batchname}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Select
              label="Course *"
              name="courseName"
              options={courseOptions}
              value={
                formData.courseId
                  ? courseList.find((c) => c._id === formData.courseId)
                      ?.title || "Select Course"
                  : "Select Course"
              }
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Batch Strength *"
              name="batchstrength"
              type="number"
              placeholder="Enter strength"
              value={formData.batchstrength}
              onChange={handleChange}
              min={1}
              required
              disabled={loading}
            />

            <Select
              label="Trainer Name *"
              name="trainerName"
              options={trainerOptions}
              value={
                formData.trainerId
                  ? trainerList.find((t) => t._id === formData.trainerId)
                      ?.name || "Select Trainer"
                  : "Select Trainer"
              }
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Start Date *"
              name="startAt"
              type="date"
              value={formData.startAt}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <span className="text-red-600">{error}</span>

            <div className="flex justify-center gap-6 pt-4">
              <button
                type="button"
                className="border border-gray-400 cursor-pointer rounded-md py-2 px-6 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-blue-600 cursor-pointer text-white rounded-md py-2 px-6 hover:bg-blue-700 min-w-[120px] flex justify-center items-center"
                disabled={loading}
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
                ) : (
                  "Create Batch"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBatch;
