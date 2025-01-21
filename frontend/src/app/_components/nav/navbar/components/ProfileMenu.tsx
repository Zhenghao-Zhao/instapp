import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import { signOut } from "@/app/_actions";
import { SubmitButton } from "@/app/_components/ui/buttons";
import {
  DropdownContent,
  DropdownTrigger,
} from "@/app/_components/ui/dropdown";
import TooltipWrapper from "@/app/_components/ui/tooltip";
import Dropdown from "@/app/_libs/contexts/providers/DropdownContextProvider";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

export default function ProfileMenu() {
  const { data } = useDataContext();
  const [formState, action] = useFormState(signOut, {
    error: null,
    message: "",
  });
  const profileRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  if (formState.error) toast.error(formState.error);

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
                imageURL={data.profile.imageURL}
                className="size-10"
              />
            </button>
          </DropdownTrigger>
        </TooltipWrapper>
        <DropdownContent>
          <form action={action} ref={formRef}>
            <SubmitButton
              title="Sign out"
              className="w-[100px] h-full p-2 shrink-0 bg-inherit hover:bg-btn-hover-primary"
              onClick={() => {
                if (!formRef.current) return;
                formRef.current.requestSubmit();
              }}
            />
          </form>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
