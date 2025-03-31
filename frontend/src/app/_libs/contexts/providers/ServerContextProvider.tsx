"use client";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { AuthProfile } from "../../types";

type DataContextType = {
  authProfile: AuthProfile;
  setAuthProfile: (data: AuthProfile) => void;
};

type Props = PropsWithChildren<{ authProfileData: AuthProfile }>;

export const DataContext = createContext<DataContextType | null>(null);

export function useDataContext() {
  const value = useContext(DataContext);
  if (value == null) throw Error("Cannot use outside of Provider");
  return value;
}
export default function DataContextProvider({
  authProfileData,
  children,
}: Props) {
  const [data, setData] = useState<AuthProfile>(authProfileData);

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     if (!session && data) {
  //       window.location.reload();
  //       return;
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [data]);

  return (
    <DataContext.Provider
      value={{ authProfile: data, setAuthProfile: setData }}
    >
      {children}
    </DataContext.Provider>
  );
}
