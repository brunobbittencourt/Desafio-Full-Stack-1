import { IContact } from "@/interfaces/contact.interfaces";

export const Contact = ({
  contact,
  onOpen,
}: {
  contact: IContact;
  onOpen: () => void;
}) => {
  return (
    <li onClick={onOpen}>
      {contact.fullName}
      {contact.email}
      {contact.phone}
    </li>
  );
};
