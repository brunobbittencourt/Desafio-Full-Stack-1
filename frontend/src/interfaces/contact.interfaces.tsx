export interface IContactData {
  fullName: string;
  email: string;
  phone: string;
}

export interface IContact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface IContactContext {
  createContact: (data: IContactData, onClose: () => void) => void;
  listContacts: () => void;
  updateContact: (
    data: IContactData,
    contactId: string,
    onClose: () => void
  ) => void;
  deleteContact: (contactId: string, onClose: () => void) => void;
  contacts: IContact[];
}
