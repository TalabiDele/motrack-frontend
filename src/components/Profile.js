import React, { useContext, useState } from "react";
import AuthContext from "./context/AuthContext";
import { motion as m } from "framer-motion";
import { MdCancel } from "react-icons/md";
import { Scroll } from "./Scroll";
import { FcEditImage } from "react-icons/fc";
import { API_URL } from "./config";
import userImage from "./imgs/userImage.png";
import { FaRegCopy } from "react-icons/fa";
import { CopyToClipboard } from "react-copy-to-clipboard";
import toast, { Toaster } from "react-hot-toast";

const Profile = ({ isProfile, setIsProfile }) => {
  const [image, setImage] = useState(null);
  const [copied, setCopied] = useState(false);

  const { user, token, checkUserLoggedIn } = useContext(AuthContext);

  const bgVariants = {
    visible: {
      y: 0,
    },
    hidden: {
      y: "-100%",
    },
  };

  const handleUpload = async (e) => {
    const toastId = toast.loading("Uploading...");

    const formData = new FormData();
    formData.append("files", e.target.files[0]);
    // formData.append("ref", "api::users");
    // formData.append("refId", user.id);
    // formData.append("field", "image");

    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    const upload = await fetch(
      `${API_URL}/users/${user.id}?populate[circle][populate][0]=image&populate[requests][populate][1]=receiver&populate[requests][populate][2]=receiver.image&populate[requests][populate][3]=senders&populate[requests][populate][4]=senders.image&populate[requests][populate][5]=senders.circle&populate=image`,
      {
        method: "PUT",
        body: JSON.stringify({
          image: data[0],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const uploadData = await upload.json();

    toast.success("Profile picture change! 🎉", {
      duration: 6000,
    });

    toast.remove(toastId);
    checkUserLoggedIn();
  };

  return (
    isProfile && (
      <Scroll>
        <m.div
          variants={bgVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{
            duration: 0.1,
            ease: "easeOut",
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className=" ml-[2rem]"
        >
          <div className=" flex justify-end relative z-[200]">
            <MdCancel
              className=" text-2xl cursor-pointer absolute -right-[2rem] mb-[0.5rem] z-[100]"
              onClick={() => setIsProfile(false)}
            />
          </div>

          <div className="bg-white backdrop-filter backdrop-blur-md bg-opacity-50 rounded-3xl p-[1rem] shadow-gray/70 shadow-lg transition-all duration-300 ease-in-out relative overflow-y-scroll scroll-smooth scroll">
            <div className=" flex items-center justify-between">
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  id="image"
                  className=" hidden"
                  onChange={(e) => handleUpload(e)}
                />
                <label htmlFor="image">
                  <FcEditImage className=" absolute text-2xl bg-white h-[2rem] w-[2rem] rounded-full p-[5px] bottom-0 right-0" />
                </label>
                <img
                  src={user.image ? user.image.url : userImage}
                  alt=""
                  className="w-[5rem] h-[5rem] rounded-full border border-primary p-[2px] object-cover"
                />
              </div>

              <div className=" leading-[1.5] ml-[1rem] w-[60%]">
                <h1 className=" font-bold">{user.username}</h1>
                <p className=" ">{user.email}</p>
                <div className=" mt-[0.5rem] w-[70%]">
                  <p className=" bg-primary_blue text-white rounded-3xl py-[5px] px-[10px] text-center">
                    {user.identifier}
                  </p>
                  <CopyToClipboard
                    text={user.identifier}
                    onCopy={() => setCopied(true)}
                  >
                    <div
                      className={` flex items-center mt-[0.5rem] cursor-pointer text-primary font-bold `}
                    >
                      <p className=" mr-[5px]">
                        {copied ? "Copied" : "Copy Id"}
                      </p>
                      <FaRegCopy />
                    </div>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </Scroll>
    )
  );
};

export default Profile;
