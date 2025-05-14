import Throbber, { ThrobberSize } from "@/app/_components/ui/loaders/Throbber";
import { useDataContext } from "@/app/_contexts/providers/DataContextProvider";
import useUploadProfileImage from "@/app/_libs/hooks/api/mutations/useUploadProfileImage";
import { STATIC_PATHS } from "@/app/_libs/vars/constants";
import { FormEvent, useRef } from "react";
import ProfileImage from "./ProfileImage";

const ACCEPTED_UPLOAD_FILE_TYPE = "image/jpeg,image/png";
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
