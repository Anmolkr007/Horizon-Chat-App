import {
  ArrowLeft,
  Camera,
  LogOut,
  Mail,
  Calendar,
  User,
  Info,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router";
import toast from "react-hot-toast"

const UserProfile = () => {
    const navigate = useNavigate();
  const {
    user,
    isLoading,
    logout,
    updateProfile
  } = useAuthStore();


  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  console.log(name);
  console.log(bio);

  const [profilePic, setProfilePic] = useState(
    user?.profilepic_url
  );

  const [imageFile, setImageFile] = useState(null);



  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5MB.");
      return;
    }
    if (!file.type.startsWith("image/")) {
  toast.error("Please select a valid image.");
  return;
}

    setImageFile(file);
    setProfilePic(URL.createObjectURL(file));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name.trim() === user.name && bio.trim() === (user.bio || "") && !imageFile){
        toast.error("No changes to save")
        return;
    }
    const formData = new FormData();
    
    if (imageFile) {
      formData.append("file", imageFile);
    }
      if(name)formData.append("name", name.trim());
      if(bio)formData.append("bio", bio.trim());
    

    await updateProfile(formData);
  };



  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(
        "en-IN",
        {
          day:"numeric",
          month:"long",
          year:"numeric",
        }
      )
    : "";



  return (

    <div className="
      relative
      h-full
      flex
      items-center
      justify-center
      overflow-hidden
      bg-[#090909]
    ">


      {/* Glow */}

      <div className="
        absolute
        -top-40
        -left-40
        w-[450px]
        h-[450px]
        rounded-full
        bg-red-500/10
        blur-[160px]
      "/>


      <div className="
        absolute
        -bottom-40
        -right-40
        w-[450px]
        h-[450px]
        rounded-full
        bg-red-600/10
        blur-[160px]
      "/>




      <form
        onSubmit={handleSubmit}
        className="
          relative
          w-[520px]
          rounded-[32px]
          border
          border-white/5
          bg-[#111111]/95
          backdrop-blur-xl
          shadow-[0_25px_70px_rgba(0,0,0,.75)]
          overflow-hidden
        "
      >


        {/* Top Line */}

        <div className="
          absolute
          top-0
          left-0
          right-0
          h-[2px]
          bg-gradient-to-r
          from-transparent
          via-red-500
          to-transparent
        "/>




        {/* Header */}

        <div className="
          flex
          items-center
          justify-between
          px-6
          py-3
          border-b
          border-white/5
        ">


          <button
            type="button"
            onClick={()=>navigate(-1)}
            className="
              w-9
              h-9
              rounded-full
              bg-white/5
              flex
              items-center
              justify-center
              text-zinc-300
              hover:bg-red-500/20
              hover:text-red-400
              transition
            "
          >

            <ArrowLeft size={18}/>

          </button>



          <h2 className="
            text-xl
            font-semibold
            text-white
          ">
            Edit Profile
          </h2>




          <button
            type="button"
            disabled={isLoading}
            onClick={logout}
            className="
              flex
              items-center
              gap-2
              px-3
              py-2
              rounded-full
              bg-red-500/10
              border
              border-red-500/20
              text-red-400
              text-sm
              hover:bg-red-500/20
              transition
            "
          >

            <LogOut size={15}/>
            Logout

          </button>


        </div>




        <div className="
          px-7
          py-5
        ">



          {/* Avatar */}


          <div className="
            flex
            justify-center
          ">


            <div className="relative">


              <div className="
                absolute
                w-32
                h-32
                rounded-full
                bg-red-500/10
                blur-[60px]
              "/>



              <img
                src={profilePic}
                alt=""
                className="
                  relative
                  w-24
                  h-24
                  rounded-full
                  object-cover
                  border-4
                  border-[#1b1b1b]
                  shadow-[0_0_30px_rgba(239,68,68,.25)]
                "
              />



              <label className="
                absolute
                bottom-0
                right-0
                w-8
                h-8
                rounded-full
                bg-red-500
                flex
                items-center
                justify-center
                cursor-pointer
              ">


                <Camera size={15} className="text-white"/>


                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />


              </label>


            </div>


          </div>
                    {/* Name */}

          <div className="mt-4">

            <div className="
              flex
              items-center
              gap-2
              text-red-400
              mb-2
            ">
              <User size={15}/>
              <h3 className="font-semibold text-sm">
                Name
              </h3>
            </div>


            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Enter your name"
              className="
                w-full
                h-10
                rounded-xl
                bg-[#171717]
                border
                border-white/5
                px-4
                text-sm
                text-white
                outline-none
                focus:border-red-500/40
                focus:ring-2
                focus:ring-red-500/20
              "
            />

          </div>



          {/* Bio */}

          <div className="mt-3">

            <div className="
              flex
              items-center
              gap-2
              text-red-400
              mb-2
            ">
              <Info size={15}/>
              <h3 className="font-semibold text-sm">
                Bio
              </h3>
            </div>


            <textarea
              rows={2}
              maxLength={150}
              value={bio}
              onChange={(e)=>setBio(e.target.value)}
              placeholder="Tell people something about yourself..."
              className="
                w-full
                h-14
                resize-none
                rounded-xl
                bg-[#171717]
                border
                border-white/5
                px-4
                py-2
                text-sm
                text-white
                outline-none
                focus:border-red-500/40
                focus:ring-2
                focus:ring-red-500/20
              "
            />

            <div className="flex justify-end">
              <span className="text-zinc-500 text-xs">
                {bio.length}/150
              </span>
            </div>

          </div>




          {/* Account Information */}


          <div className="mt-4">


            <div className="
              flex
              items-center
              gap-2
              text-red-400
              mb-2
            ">
              <Mail size={15}/>
              <h3 className="font-semibold text-sm">
                Account Information
              </h3>
            </div>




            <div className="
              rounded-xl
              overflow-hidden
              border
              border-white/5
              bg-[#171717]
            ">


              <div className="
                flex
                justify-between
                items-center
                px-4
                py-3
                border-b
                border-white/5
              ">

                <span className="text-zinc-500 text-sm">
                  Email
                </span>


                <span className="text-white text-sm">
                  {user?.email}
                </span>

              </div>



              <div className="
                flex
                justify-between
                items-center
                px-4
                py-3
              ">


                <div className="
                  flex
                  items-center
                  gap-2
                  text-zinc-500
                  text-sm
                ">

                  <Calendar size={14}/>
                  Joined

                </div>


                <span className="text-white text-sm">
                  {joinedDate}
                </span>


              </div>


            </div>


          </div>




          {/* Save Button */}


          <button
            type="submit"
            disabled={isLoading}
            className="
              mt-5
              w-full
              h-11
              rounded-xl
              bg-red-500
              text-white
              font-semibold
              transition-all
              duration-300
              hover:bg-red-600
              hover:shadow-[0_0_35px_rgba(239,68,68,.45)]
              disabled:opacity-70
            "
          >

            {
              isLoading
              ? (
                <div className="
                  flex
                  items-center
                  justify-center
                  gap-3
                ">

                  <div
                    className="
                      w-4
                      h-4
                      rounded-full
                      border-2
                      border-white/30
                      border-t-white
                      animate-spin
                    "
                  />

                  Saving Changes...

                </div>
              )
              :
              "Save Changes"
            }


          </button>



        </div>


      </form>


    </div>

  );
};


export default UserProfile;