import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import { useDataContext } from "@/app/_contexts/providers/DataContextProvider";
import Dropdown from "@/app/_contexts/providers/DropdownContextProvider";
import { useLogout } from "@/app/_libs/hooks/api/mutations/authentication";
import { FormEvent, useRef } from "react";
import SubmitButton from "../ui/buttons/SubmitButton";
import DropdownContent from "../ui/dropdown/DropdownContent";
import DropdownTrigger from "../ui/dropdown/DropdownTrigger";
import TooltipWrapper from "../ui/tooltip/TooltipWrapper";

export default function ProfileMenu() {
  const { authProfile } = useDataContext();
  const profileRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const {
    mutation: { mutate },
  } = useLogout();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div>
      <Dropdown>
        <TooltipWrapper>
          <DropdownTrigger>
            <button
              ref={profileRef}
              className="relative flex items-center justify-center p-2"
            >
              <ProfileImage
                imageURL={authProfile.profileImageUrl}
                className="size-10"
              />
            </button>
          </DropdownTrigger>
        </TooltipWrapper>
        <DropdownContent>
          <form onSubmit={handleSubmit} ref={formRef}>
            <SubmitButton
              title="Sign out"
              className="w-[100px] h-full p-2 shrink-0 bg-inherit hover:bg-btn-hover-primary"
            />
          </form>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
