import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import { useLogout } from "@/app/_api/hooks/authentication";
import { SubmitButton } from "@/app/_components/ui/buttons";
import {
  DropdownContent,
  DropdownTrigger,
} from "@/app/_components/ui/dropdown";
import TooltipWrapper from "@/app/_components/ui/tooltip";
import Dropdown from "@/app/_libs/contexts/providers/DropdownContextProvider";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { FormEvent, useRef } from "react";

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
