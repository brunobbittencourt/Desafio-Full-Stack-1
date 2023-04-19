import {
  IContact,
  IContactContext,
  IContactData,
} from "@/interfaces/contact.interfaces";
import { ILogin, IUser, IUserData } from "@/interfaces/user.interfaces";
import { API } from "@/services/api";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import { UserContext } from "../user";

export const ContactContext = createContext<IContactContext>(
  {} as IContactContext
);

export function ContactProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [contacts, setContacts] = useState<IContact[]>([]);

  const createContact = (data: IContactData, onClose: () => void) => {
    const id = toast.loading("Signing...");
    API.post("contacts/", data)
      .then((res) => {
        toast.update(id, {
          render: "Signed",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        listContacts();
        onClose();
      })
      .catch((error) => {
        console.log(error);

        toast.update(id, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  };

  const listContacts = () => {
    API.get("contacts")
      .then((res) => {
        setContacts(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (user) {
      listContacts();
    }
  }, [user]);

  const updateContact = (
    data: IContactData,
    contactId: string,
    onClose: () => void
  ) => {
    const id = toast.loading("Updating...");
    API.patch(`contacts/${contactId}`, data)
      .then((res) => {
        toast.update(id, {
          render: "Updated",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        listContacts();
        onClose();
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
  const deleteContact = (contactId: string, onClose: () => void) => {
    const id = toast.loading("Deleting...");
    API.delete(`contacts/${contactId}`)
      .then((res) => {
        toast.update(id, {
          render: "Deleted",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        listContacts();
        onClose();
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

  return (
    <ContactContext.Provider
      value={{
        createContact,
        listContacts,
        updateContact,
        deleteContact,
        contacts,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}
