"use client";
import { createClient } from "@/app/_libs/utils/supabase/client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { HydraData } from "../../types";

type DataContextType = {
  data: HydraData;
  setData: (data: HydraData) => void;
};

type Props = PropsWithChildren<{ data: HydraData }>;

export const DataContext = createContext<DataContextType | null>(null);
const supabase = createClient();

export function useDataContext() {
  const value = useContext(DataContext);
  if (value == null) throw Error("Cannot use outside of Provider");
  return value;
}
export default function DataContextProvider({
  data: serverData,
  children,
}: Props) {
  const [data, setData] = useState<HydraData>(serverData);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && data) {
        window.location.reload();
        return;
      }
    });
    return () => subscription.unsubscribe();
  }, [data]);

  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}
