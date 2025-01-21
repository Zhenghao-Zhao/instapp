import { useEffect, useState } from "react";

export default function useWorker(
  onMessage: (e: MessageEvent<any>) => void,
) {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const myWorker = new Worker(
      new URL("../../_worker/index.ts", import.meta.url)
    );
    setWorker(myWorker);
    myWorker.onmessage = onMessage;
    return () => {
      myWorker.terminate();
    };
  }, []);

  return worker;
}