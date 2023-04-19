import { ReactNode } from "react";
import { UserProvider } from "./user";
import { ContactProvider } from "./contact";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <ContactProvider>{children}</ContactProvider>
    </UserProvider>
  );
}
