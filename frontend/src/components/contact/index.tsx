import { IContact } from "@/interfaces/contact.interfaces";
import { StyledContact } from "./style";

export const Contact = ({
  contact,
  onOpen,
}: {
  contact: IContact;
  onOpen: () => void;
}) => {
  return (
    <StyledContact onClick={onOpen}>
      <span>{contact.fullName}</span>
      <span>{contact.email}</span>
      <span>{contact.phone}</span>
    </StyledContact>
  );
};
