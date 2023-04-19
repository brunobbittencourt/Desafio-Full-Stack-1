import { useDisclosure } from "@chakra-ui/react";
import { NewContact } from "../newContact";
import { useContext, useState } from "react";
import { ContactContext } from "@/providers/contact";
import { Contact } from "../contact";
import { UpdateDeleteContact } from "../updateDeleteContact";
import { IContact } from "@/interfaces/contact.interfaces";

export function Dashboard() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const { contacts } = useContext(ContactContext);
  const [contact, setContact] = useState<IContact | null>(null);
  const switchContact = (contact: IContact) => {
    setContact(contact);
    onOpenEdit();
  };
  return (
    <>
      <button onClick={onOpen}>Criar Novo Contato</button>
      <h2>Contatos:</h2>
      <ul>
        {contacts?.map((contact) => (
          <Contact
            onOpen={() => {
              switchContact(contact);
            }}
            key={contact.id}
            contact={contact}
          />
        ))}
      </ul>
      <NewContact isOpen={isOpen} onClose={onClose} />
      <UpdateDeleteContact
        contact={contact}
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
      />
    </>
  );
}
