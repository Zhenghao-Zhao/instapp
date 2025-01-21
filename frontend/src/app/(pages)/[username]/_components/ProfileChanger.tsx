import { ACCEPTED_UPLOAD_FILE_TYPE } from "@/app/_components/posts/createPost/utils";
import Throbber, { ThrobberSize } from "@/app/_components/ui/loaders";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { useRef } from "react";
import { useFormStatus } from "react-dom";
import ProfileImage from "./ProfileImage";
import { addProfileImage } from "@/app/_actions";

// TODO: add ui notifying user when their profile image is being updated. Current throbber choice can be hard to see depending on image background.

export default function ProfileChanger({ twSize }: { twSize?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: serverData, setData } = useDataContext();

  const handleUploadProfileImage = async (formData: FormData) => {
    const imageURL = await addProfileImage(formData);
    const rtn_profile = { ...serverData!.profile, imageURL };
    setData({ ...serverData!, profile: rtn_profile });
  };

  return (
    <form ref={formRef} action={handleUploadProfileImage}>
      <ProfileImagePlaceholder
        imageURL={serverData.profile.imageURL}
        twSize={twSize}
      />
      <input
        accept={ACCEPTED_UPLOAD_FILE_TYPE}
        id="profileUpload"
        type="file"
        name="profileImage"
        onChange={(e) => {
          if (!formRef.current) return;
          if (!e.currentTarget.files || !e.currentTarget.files[0]) return;
          formRef.current.requestSubmit();
        }}
        hidden
      />
    </form>
  );
}

function ProfileImagePlaceholder({
  imageURL,
  twSize,
}: {
  imageURL: string | null;
  twSize?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <div className="relative w-fit">
      <label htmlFor="profileUpload">
        <ProfileImage imageURL={imageURL} className={twSize} />
      </label>
      {pending && (
        <div className="absolute w-full h-full flex items-center justify-center top-0">
          <Throbber size={ThrobberSize.MEDIUM} />
        </div>
      )}
    </div>
  );
}
