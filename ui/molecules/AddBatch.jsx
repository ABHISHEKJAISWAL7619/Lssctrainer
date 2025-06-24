// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import Input from "../atoms/Input";
// import Select from "../atoms/Select";
// import { getalltrainers } from "@/redux/slice/user-slice";
// import { getallcourse } from "@/redux/slice/course-slice";
// import { createbatch } from "@/redux/slice/batch-slice";
// import toast from "react-hot-toast";

// const AddBatch = ({ onClose }) => {
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     batchname: "",
//     batchstrength: "",
//     trainerId: "",
//     courseId: "",
//     startAt: "",
//   });
//   const [error, seterror] = useState();
//   const [trainerList, setTrainerList] = useState([]);
//   const [courseList, setCourseList] = useState([]);

//   const [trainerOptions, setTrainerOptions] = useState(["Select Trainer"]);
//   const [courseOptions, setCourseOptions] = useState(["Select Course"]);

//   const centerId = "6842a0dc6d48379fcefcec9e";

//   // ✅ Safe Trainer Fetch
//   useEffect(() => {
//     const fetchTrainers = async () => {
//       try {
//         let res = await dispatch(getalltrainers());
//         console.log("Trainer fetch response:", res);
//         const data = res?.payload?.data;

//         if (Array.isArray(data)) {
//           setTrainerList(data);
//           const options = data.map((t) => t.name);
//           setTrainerOptions(["Select Trainer", ...options]);
//         } else {
//           console.warn("Trainer data not in expected format:", data);
//           setTrainerList([]);
//           setTrainerOptions(["Select Trainer"]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch trainers:", error);
//       }
//     };

//     fetchTrainers();
//   }, [dispatch]);

//   // ✅ Safe Course Fetch
//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         let res = await dispatch(getallcourse());
//         console.log("Course fetch response:", res);
//         const data = res?.payload?.data;

//         if (Array.isArray(data)) {
//           setCourseList(data);
//           const options = data.map((c) => c.title);
//           setCourseOptions(["Select Course", ...options]);
//         } else {
//           console.warn("Course data not in expected format:", data);
//           setCourseList([]);
//           setCourseOptions(["Select Course"]);
//         }
//       } catch (error) {
//         console.error("Failed to fetch courses:", error);
//       }
//     };

//     fetchCourses();
//   }, [dispatch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "trainerName") {
//       const trainer = trainerList.find((t) => t.name === value);
//       setFormData((prev) => ({
//         ...prev,
//         trainerId: trainer ? trainer._id : "",
//       }));
//     } else if (name === "courseName") {
//       const course = courseList.find((c) => c.title === value);
//       setFormData((prev) => ({
//         ...prev,
//         courseId: course ? course._id : "",
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     seterror("");

//     if (!formData.batchname) {
//       seterror("batchname is required");
//       return;
//     }
//     if (!formData.trainerId) {
//       seterror("trainer is required");
//       return;
//     }
//     if (!formData.batchstrength) {
//       seterror("batchstrength is required");
//       return;
//     }
//     if (!formData.courseId) {
//       seterror("course is required");
//       return;
//     }
//     if (!formData.startAt) {
//       seterror("start date is required");
//       return;
//     }

//     const payload = {
//       name: formData.batchname,
//       strength: Number(formData.batchstrength),
//       trainer: formData.trainerId,
//       course: formData.courseId,
//       centerId,
//       startAt: new Date(formData.startAt).toISOString(),
//     };

//     console.log("Submitting batch payload:", payload);
//     const res = await dispatch(createbatch(payload));
//     console.log(res.payload.message);
//     toast.success(res.payload.message);
//     onClose();
//   };

//   return (
//     <div className="bg-white w-full rounded-xl space-y-6 p-6 max-w-md mx-auto">
//       <h2 className="text-xl font-bold text-center">Add New Batch</h2>
//       <form className="space-y-5 text-gray-700" onSubmit={handleSubmit}>
//         <Input
//           label="Batch Name *"
//           name="batchname"
//           type="text"
//           placeholder="Enter batch name"
//           value={formData.batchname}
//           onChange={handleChange}
//           required
//         />

//         <Select
//           label="Course *"
//           name="courseName"
//           options={courseOptions}
//           value={
//             formData.courseId
//               ? courseList.find((c) => c._id === formData.courseId)?.title ||
//                 "Select Course"
//               : "Select Course"
//           }
//           onChange={handleChange}
//           required
//         />

//         <Input
//           label="Batch Strength *"
//           name="batchstrength"
//           type="number"
//           placeholder="Enter strength"
//           value={formData.batchstrength}
//           onChange={handleChange}
//           min={1}
//           required
//         />

//         <Select
//           label="Trainer Name *"
//           name="trainerName"
//           options={trainerOptions}
//           value={
//             formData.trainerId
//               ? trainerList.find((t) => t._id === formData.trainerId)?.name ||
//                 "Select Trainer"
//               : "Select Trainer"
//           }
//           onChange={handleChange}
//           required
//         />

//         <Input
//           label="Start Date *"
//           name="startAt"
//           type="date"
//           value={formData.startAt}
//           onChange={handleChange}
//           required
//         />
//         <span className="text-red-600">{error}</span>

//         <div className="flex justify-center gap-6 pt-4">
//           <button
//             type="button"
//             className="border border-gray-400 rounded-md py-2 px-6 hover:bg-gray-100"
//             onClick={(e) => {
//               e.preventDefault();
//               onClose();
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="bg-blue-600 text-white rounded-md py-2 px-6 hover:bg-blue-700"
//           >
//             Create Batch
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddBatch;
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
        } else {
          setTrainerList([]);
          setTrainerOptions(["Select Trainer"]);
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
        } else {
          setCourseList([]);
          setCourseOptions(["Select Course"]);
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

    if (!formData.batchname) {
      seterror("batchname is required");
      return;
    }
    if (!formData.trainerId) {
      seterror("trainer is required");
      return;
    }
    if (!formData.batchstrength) {
      seterror("batchstrength is required");
      return;
    }
    if (!formData.courseId) {
      seterror("course is required");
      return;
    }
    if (!formData.startAt) {
      seterror("start date is required");
      return;
    }

    const payload = {
      name: formData.batchname,
      strength: Number(formData.batchstrength),
      trainer: formData.trainerId,
      course: formData.courseId,
      centerId,
      startAt: new Date(formData.startAt).toISOString(),
    };

    const res = await dispatch(createbatch(payload));
    toast.success(res.payload.message);
    onClose();
  };

  return (
    <>
      {/* Backdrop with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm z-40"
      ></div>

      {/* Modal content */}
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
            />

            <Input
              label="Start Date *"
              name="startAt"
              type="date"
              value={formData.startAt}
              onChange={handleChange}
              required
            />
            <span className="text-red-600">{error}</span>

            <div className="flex justify-center gap-6 pt-4">
              <button
                type="button"
                className="border border-gray-400 rounded-md py-2 px-6 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded-md py-2 px-6 hover:bg-blue-700"
              >
                Create Batch
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBatch;
