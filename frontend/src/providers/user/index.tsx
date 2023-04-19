import {
  ILogin,
  IUser,
  IUserContext,
  IUserData,
} from "@/interfaces/user.interfaces";
import { API } from "@/services/api";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UserContext = createContext<IUserContext>({} as IUserContext);

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<IUser>({} as IUser);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    profile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createUser = (data: IUserData) => {
    const id = toast.loading("Signing...");
    API.post("users/", data)
      .then((res) => {
        toast.update(id, {
          render: "Signed",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        router.push("/login");
      })
      .catch((error) => {
        toast.update(id, {
          render: error.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  };

  const login = (data: ILogin) => {
    const id = toast.loading("Loggin...");
    API.post("login/", data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.update(id, {
          render: "Logged",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        toast.update(id, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  };

  const profile = () => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("users/profile")
        .then((res) => {
          setUser(res.data);
          router.push("/dashboard");
        })
        .catch((error) => {
          localStorage.removeItem("token");
          setToken(null);
          setUser({} as IUser);
          router.push("/login");
        });
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setUser({} as IUser);
      router.push("/login");
    }
  };

  const update = (data: IUserData) => {
    const id = toast.loading("Updating...");
    API.patch("users/", data)
      .then((res) => {
        toast.update(id, {
          render: "Updated",
          type: "success",
          isLoading: false,
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        toast.update(id, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
        });
      });
  };
  const deleteUser = () => {
    const id = toast.loading("Deleting...");
    API.delete("users/")
      .then((res) => {
        toast.update(id, {
          render: "Deleted",
          type: "success",
          isLoading: false,
        });
        localStorage.removeItem("token");
        setToken(null);
        setUser({} as IUser);
        router.push("/login");
      })
      .catch((error) => {
        toast.update(id, {
          render: error.response.data.message,
          type: "error",
          isLoading: false,
        });
        localStorage.removeItem("token");
        setToken(null);
        setUser({} as IUser);
        router.push("/login");
      });
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser({} as IUser);
    router.push("/login");
  };

  return (
    <UserContext.Provider
      value={{ createUser, login, profile, update, deleteUser, logOut, user }}
    >
      {children}
    </UserContext.Provider>
  );
}
