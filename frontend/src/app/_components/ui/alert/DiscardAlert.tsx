import { useAlertContext } from "@/app/_libs/contexts/providers/AlertContextProvider";

export default function DiscardAlert({
  onConfirm,
}: {
  onConfirm?: () => void;
}) {
  const { setOpen: setShow } = useAlertContext();
  return (
    <div
      className="selection:max-w-[500px] px-10 py-6 flex flex-col rounded-md"
      role="alert"
    >
      <p className="text-lg font-bold m-auto">Discard Post</p>
      <div className="text-text-secondary text-center mt-2">
        <p>Are you sure you want to discard this post?</p>
      </div>
      <button
        onClick={onConfirm ?? (() => setShow(false))}
        className="bg-red-600 w-full p-2 rounded-md mt-4"
      >
        Discard
      </button>
      <button
        onClick={() => setShow(false)}
        className="p-2 rounded-md w-full hover:bg-btn-hover-primary mt-2 border border-gray-300"
      >
        Cancel
      </button>
    </div>
  );
}
