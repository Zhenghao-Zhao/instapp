import Icon from "@/app/_components/ui/icon/Icon";
import { IconType } from "@/app/_components/ui/icon/Icons";
import Alert from "@/app/_libs/contexts/providers/AlertContextProvider";
import AlertContent from "../ui/alert/AlertContent";
import AlertTrigger from "../ui/alert/AlertTrigger";
import DiscardAlert from "../ui/alert/DiscardAlert";
import Throbber from "../ui/loaders/Throbber";

export default function UploadHeader({
  onPrev,
  onNext,
  title,
  isPending = false,
  nextLabel,
}: {
  onPrev?: () => void;
  onNext?: () => void;
  title: string;
  isPending?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="h-upload-header-height w-full relative border-b">
      <div className="text-lg font-bold w-full h-full flex justify-center items-center absolute">
        {title}
      </div>
      {onPrev && (
        <div className="float-left h-full flex items-center justify-center relative">
          {title === "Crop" ? (
            <Alert>
              <AlertTrigger className="ml-[10px] w-fit h-fit flex items-center justify-center">
                <button>
                  <Icon icon={IconType.ArrowLeft} />
                </button>
              </AlertTrigger>
              <AlertContent>
                <DiscardAlert onConfirm={onPrev} />
              </AlertContent>
            </Alert>
          ) : (
            <button className="ml-[10px]" onClick={onPrev}>
              <Icon icon={IconType.ArrowLeft} />
            </button>
          )}
        </div>
      )}
      {onNext && (
        <div className="float-right h-full flex items-center justify-center relative">
          <div className="mr-[20px]">
            {isPending ? (
              <Throbber />
            ) : (
              <button
                onClick={onNext}
                className="flex items-center justify-center font-[500]"
              >
                {nextLabel ?? "Next"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
