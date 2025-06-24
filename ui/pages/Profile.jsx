"use client";

import Image from "next/image";
import Input from "../atoms/Input";
import { useDispatch } from "react-redux";
import { getloginuser, updateloginuser } from "@/redux/slice/user-slice";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useFile from "@/hooks/useFile";

const Profile = () => {
  const dispatch = useDispatch();
  const { uploadFile } = useFile();
  const fileInputRef = useRef(null); // for auto trigger

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    specialization: "",
    mobile: "",
    email: "",
    role: "",
    avatar: "",
  });

  const getuserdetails = async () => {
    const res = await dispatch(getloginuser());
    console.log(res);
    const user = res.payload?.user;
    if (user) {
      setFormData({
        name: user.name || "",
        employeeId: user.employeeId || "",
        specialization: user.specialization || "",
        mobile: user.mobile || "",
        email: user.email || "",
        avatar: user.avatar || "",
        role: user.role || "",
      });
    }
  };

  useEffect(() => {
    getuserdetails();
  }, []);

  const handleupdate = async (e) => {
    e.preventDefault();
    if (uploadingPhoto) {
      toast.error("Please wait until photo upload completes");
      return;
    }
    const res = await dispatch(updateloginuser(formData));
    if (res.error) {
      toast.error("Update failed. Please try again.");
    } else {
      toast.success("User profile updated successfully");
      await getuserdetails();
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const result = await uploadFile(file);
      const imageUrl =
        result?.image ||
        result?.url ||
        result?.secure_url ||
        (typeof result === "string" && result);

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, avatar: imageUrl }));
        toast.success("Profile photo uploaded");
      } else {
        toast.error("Upload failed: Invalid response");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload error");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <section className="space-y-6">
      <h2 className="font-bold text-3xl">Profile Information</h2>
      <div className="bg-white p-3 lg:p-4 rounded-xl border-quinary border">
        <form className="lg:w-[60%] space-y-4 mx-auto" onSubmit={handleupdate}>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploadingPhoto}
          />

          {/* Avatar Upload */}
          <div
            className="flex flex-col items-center justify-center gap-2 relative"
            onClick={() => {
              if (!uploadingPhoto) fileInputRef.current.click();
            }}
          >
            <Image
              className={`w-24 h-24 rounded-full object-cover border cursor-pointer ${
                uploadingPhoto ? "opacity-50" : ""
              }`}
              src={formData.avatar || "/icon/uploadImage.png"}
              alt="Profile Photo"
              width={100}
              height={100}
            />
            <span className="text-[#4379EE] text-center block pt-1 text-sm">
              {uploadingPhoto ? "Uploading photo..." : "Click to Upload Photo"}
            </span>
            {uploadingPhoto && (
              <div className="absolute top-24 text-blue-600 font-medium text-xs">
                Uploading...
              </div>
            )}
          </div>

          {/* Form Inputs */}
          <Input
            label={"Full Name"}
            icon={"ri-user-smile-line"}
            placeholder={"Enter your full name"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={uploadingPhoto}
          />
          <Input
            label={"Employee ID"}
            placeholder={"Enter Employee ID"}
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
            disabled={uploadingPhoto}
          />
          <Input
            label={"Specialization"}
            icon={"ri-graduation-cap-line"}
            placeholder={"Enter your specialization"}
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
            disabled={uploadingPhoto}
          />

          <div className="flex flex-col lg:flex-row items-center gap-4">
            <Input
              label={"Phone Number"}
              icon={"ri-phone-line"}
              placeholder={"+91 xxx xxx xxx"}
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              disabled={uploadingPhoto}
            />
            <Input
              label={"Email Address"}
              icon={"ri-mail-line"}
              placeholder={"name@gmail.com"}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={uploadingPhoto}
            />
            <Input
              label={"Role"}
              icon={"ri-user-settings-line"}
              placeholder={"Assessor/Trainer"}
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              disabled={uploadingPhoto}
            />
          </div>

          {/* Tips Box */}
          <div className="border-[#BFDBFE] rounded-xl gap-2 border p-4 bg-[#EFF6FF]">
            <span className="flex items-center gap-2 text-[#1E40AF] font-medium text-sm">
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

          {/* Buttons */}
          <div className="flex justify-end pt-6 gap-4">
            <button
              type="button"
              className="border-[#D1D5DB] rounded-md py-2 px-4 border"
              onClick={() =>
                setFormData({
                  name: "",
                  employeeId: "",
                  specialization: "",
                  mobile: "",
                  email: "",
                  role: "",
                  avatar: "",
                })
              }
              disabled={uploadingPhoto}
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md"
              disabled={uploadingPhoto}
            >
              Update Info
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
