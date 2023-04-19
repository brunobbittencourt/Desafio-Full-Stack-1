import { UserContext } from "@/providers/user";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export const Header = ({
  page,
}: {
  page: "register" | "login" | "dashboard";
}) => {
  const { logOut } = useContext(UserContext);
  const router = useRouter();
  const switchButton = () => {
    switch (page) {
      case "register":
        return <button onClick={() => router.push("/login")}>Login</button>;
      case "login":
        return (
          <button onClick={() => router.push("/register")}>Registro</button>
        );
      case "dashboard":
        return <button onClick={logOut}>Logout</button>;
    }
  };
  return <header>{switchButton()}</header>;
};
