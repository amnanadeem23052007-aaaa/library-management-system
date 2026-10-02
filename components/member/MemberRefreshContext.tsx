"use client";

import { createContext, useContext, useMemo, useState } from "react";

type MemberRefreshContextValue = {
  refreshKey: number;
  refresh: () => void;
};

const MemberRefreshContext = createContext<MemberRefreshContextValue>({
  refreshKey: 0,
  refresh: () => {},
});

export function MemberRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshKey, setRefreshKey] = useState(0);

  const value = useMemo(
    () => ({
      refreshKey,
      refresh: () => setRefreshKey((current) => current + 1),
    }),
    [refreshKey]
  );

  return (
    <MemberRefreshContext.Provider value={value}>
      {children}
    </MemberRefreshContext.Provider>
  );
}

export function useMemberRefresh() {
  return useContext(MemberRefreshContext);
}
