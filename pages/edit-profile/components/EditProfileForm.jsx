import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import DatePicker from "react-tailwindcss-datepicker";
import { useUserData, baseUrl, token } from "@/config";

const EditProfileForm = ( {setSubmitProfile}) => {
  
  const allData = useUserData();

  // console.log(allData);

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("+91");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",   
    email: "",
    dob: '',
    gender: '',
    country: '',
    nativeLanguage: '',
    educationLevel: '',
    proficiencyLevel: '',
  })

  const [countDown, setCountDown] = useState(60000);

  useEffect(() => {
    if (allData) {
      setFormData({
        name: allData.name || "",
        email: allData.email || "",
        dob: allData.dob || '',
        gender: allData.gender || '',
        country: allData.country || '',
        nativeLanguage: allData.nativeLanguage || '',
        educationLevel: allData.educationLevel || '',
        proficiencyLevel: allData.proficiencyLevel || '',
      });
    }
  }, [allData]);

 

  useEffect(() => {
    if (otpSent) {
      const interval = setInterval(() => {
      setCountDown(countDown - 1000);
    }, 1000);
    return () => clearInterval(interval);
    }
    
  }, [countDown, otpSent]);

  const handleVerify = async () => {

    try {
      const response = await axios.post(
        `${baseUrl}/v1/auth/send-otp`,
        {
          phone: phone,
          country: code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setOtpSent(true);
    } catch (error) {
      console.error("Error:", error);
      // setError(error.message);
    }
  };

  const handleOtp = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/v1/auth/verify-otp`,
        {
          phone: phone,
          otp: otp,
          country: code,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setOtpSent(false);
      setVerified(true);
      alert("OTP verified successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    if (verified) {
      e.preventDefault();
    try {
      const response = await axios.put(
        `${baseUrl}/v1/user`,
        {
          name: formData.name,
          email: formData.email,
          dob: formData.dob,
          gender: formData.gender,
          country: formData.country,
          nativeLanguage: formData.nativeLanguage,
          educationLevel: formData.educationLevel,
          proficiencyLevel: formData.proficiencyLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } 
      );
      console.log(response.data);
      alert("Profile updated successfully! Now click on Preferences tab for next steps.");
      setSubmitProfile(true);
    } catch (error) {
      console.error("Error:", error);
    }
    } else {
      alert("Please verify your phone number");
    }
    
  };


  return (
    <div className="w-[95%] border mt-4 rounded-lg mx-auto">
      <form onSubmit={handleSubmit} className="">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8 p-4">
          <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="label label-text text-lg font-semibold">
              Name
            </label>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label label-text text-lg font-semibold">
              Email
            </label>
            <input
              type="text"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="label label-text text-lg font-semibold">
              Phone
            </label>
            <div className="flex md:flex-row flex-col gap-2">
              <input
                type="text"
                placeholder="Code"
                defaultValue={code}
                onChange={(e) => setCode(e.target.value)}
                className="input input-bordered w-20"
              />
              <input
                type="text"
                placeholder="Phone"
                defaultValue={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input input-bordered w-full"
              />
              <label onClick={handleVerify} className="btn btn-primary">
                Verify
              </label>
            </div>
            {otpSent && (
              <div className="mt-4">
                <p className="text-green-500">OTP Sent!</p>
                <div className="flex flex-row gap-2">
                <input
                  type="text"
                  pattern="[0-9]{4}"
                  placeholder="OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  className="input input-bordered w-full"
                />
                <label className="btn btn-primary" onClick={handleOtp}>Submit</label>
                </div>
                <p className="text-red-500 text-end">
                  Didn't Receive OTP?
                  <span className="countdown">
                    {countDown/1000}
                  </span>
                  sec{" "}
                  <span
                    className="cursor-pointer font-bold text-blue-700"
                    onClick={handleVerify}
                  >
                    Resend
                  </span>
                </p>
                
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-x-2">
        <div>
                <label
                  className="label label-text text-lg font-semibold"
                >
                  Date of Birth:
                </label>
                 <DatePicker
              inputClassName="w-full input input-bordered input-primary"
              useRange={false}
              asSingle={true}
              displayFormat={"DD/MM/YYYY"}
              value={{startDate: formData.dob, endDate: formData.dob}}
              onChange={(date) => setFormData({ ...formData, dob: date.startDate })}
              required
            />
              </div>
              <div> 
              <label
                  className="label label-text text-lg font-semibold"
                >
                  Gender:
                </label>
              <select className="select select-bordered w-full"
            value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
            <option value="">
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>  
              </div>
              </div>
              <div>
                <label
                  className="label label-text text-lg font-semibold"
                >
                  Proficiency Level:
                </label>
        <select className="select select-bordered w-full"
            value={formData.proficiencyLevel} onChange={(e) => setFormData({ ...formData, proficiencyLevel: e.target.value })}>
            <option value="">
              Proficiency Level
            </option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          </div>
            <div>
              <label
                className="label label-text text-lg font-semibold"
              >
                Qualification :
              </label>
             <select className="select select-bordered w-full"
             value={formData.educationLevel} onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}>
            <option value="">
              Education Level
            </option>
            <option value="highSchool">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
          </select>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-x-2">
              <div>
                <label
                  className="label label-text text-lg font-semibold"
                >
                  Country :
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label
                  className="label label-text text-lg font-semibold"
                >
                  Native Language :
                </label>
                <input
                  type="text"
                  placeholder="Native Language"
                  value={formData.nativeLanguage}
                  onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value })}
                  className="input input-bordered w-full"
                />
              </div>
             
            </div>
        </div>
        </div>
        <div className="w-full flex justify-end">
          <button type="submit" className="btn btn-primary w-20 m-4">
          Save
        </button>
        </div>
        
        
      </form>
    </div>
  );
};

export default EditProfileForm;
