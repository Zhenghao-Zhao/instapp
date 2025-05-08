import { IconType } from "@/app/_components/ui/icon/Icons";
import Modal from "@/app/_contexts/providers/ModalContextProivder";
import { Suspense, lazy } from "react";
import DiscardAlert from "../ui/alert/DiscardAlert";
import IconButton from "../ui/buttons/IconButton";
import Throbber, { ThrobberSize } from "../ui/loaders/Throbber";
import ModalContent from "../ui/modal/ModalContent";
import ModalTrigger from "../ui/modal/ModalTrigger";

const CreatePost = lazy(() => import("@/app/_components/post/CreatePost"));

export default function CreatePostModal() {
  return (
    <Modal alertOnCloseInit={false} alert={<DiscardAlert />}>
      <ModalTrigger>
        <IconButton
          icon={IconType.Create}
          tip="Create new post"
          className="p-2"
        />
      </ModalTrigger>
      <ModalContent animation="fade-in">
        <div className="overflow-hidden rounded-md min-w-upload-image-width min-h-upload-height flex items-center justify-center">
          <Suspense fallback={<Throbber size={ThrobberSize.MEDIUM} />}>
            <CreatePost />
          </Suspense>
        </div>
      </ModalContent>
    </Modal>
  );
}
