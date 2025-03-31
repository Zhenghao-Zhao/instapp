import useUploadProfileImage from "@/app/_api/hooks/useUploadProfileImage";
import { ACCEPTED_UPLOAD_FILE_TYPE } from "@/app/_components/posts/createPost/utils";
import Throbber, { ThrobberSize } from "@/app/_components/ui/loaders";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { FormEvent, useRef } from "react";
import ProfileImage from "./ProfileImage";
import { STATIC_PATHS } from "@/app/_libs/constants";

// TODO: add ui notifying user when their profile image is being updated. Current throbber choice can be hard to see depending on image background.
export default function ProfileChanger({ twSize }: { twSize?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { authProfile } = useDataContext();
  const {
    mutation: { mutate, isPending },
  } = useUploadProfileImage();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate(formData);
  };

  const handleChange = () => {
    if (!formRef || !formRef.current) {
      return;
    }
    formRef.current.requestSubmit();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="relative w-fit">
        <label htmlFor="profileUpload">
          <ProfileImage
            imageURL={
              authProfile.profileImageUrl || STATIC_PATHS.DEFAULT_PROFILE_IMAGE
            }
            className={twSize}
          />
        </label>
        {isPending && (
          <div className="absolute w-full h-full flex items-center justify-center top-0">
            <Throbber size={ThrobberSize.MEDIUM} />
          </div>
        )}
      </div>
      <input
        accept={ACCEPTED_UPLOAD_FILE_TYPE}
        id="profileUpload"
        type="file"
        name="profileImage"
        onChange={handleChange}
        hidden
      />
    </form>
  );
}

// function ProfileImagePlaceholder({
//   imageURL,
//   twSize,
// }: {
//   imageURL: string | null;
//   twSize?: string;
// }) {
//   const { pending } = useFormStatus();
//   return (
//     <div className="relative w-fit">
//       <label htmlFor="profileUpload">
//         <ProfileImage imageURL={imageURL} className={twSize} />
//       </label>
//       {pending && (
//         <div className="absolute w-full h-full flex items-center justify-center top-0">
//           <Throbber size={ThrobberSize.MEDIUM} />
//         </div>
//       )}
//     </div>
//   );
// }
