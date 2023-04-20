import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IContact, IContactData } from "@/interfaces/contact.interfaces";
import { useContext, useEffect } from "react";
import { ContactContext } from "@/providers/contact";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export function UpdateDeleteContact({
  isOpen,
  onClose,
  contact,
}: {
  isOpen: boolean;
  onClose: () => void;
  contact: IContact | null;
}) {
  const { updateContact, deleteContact } = useContext(ContactContext);

  const schema = yup.object().shape({
    email: yup.string().required().email(),
    fullName: yup.string().required(),
    phone: yup.string().required(),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IContactData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: contact?.email,
      fullName: contact?.fullName,
      phone: contact?.phone,
    },
  });
  useEffect(() => {
    reset(
      {
        email: contact?.email,
        fullName: contact?.fullName,
        phone: contact?.phone,
      },
      { keepDirty: true, keepErrors: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Atualizar Contato</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={handleSubmit((data) => {
              reset(
                { email: "", fullName: "", phone: "" },
                { keepDirty: true, keepErrors: true }
              );
              updateContact(data, contact?.id!, onClose);
            })}
          >
            <input
              placeholder="Nome Completo"
              {...register("fullName")}
            ></input>
            {errors.fullName?.message && (
              <span>{errors.fullName?.message}</span>
            )}
            <input placeholder="E-Mail" {...register("email")}></input>
            {errors.email?.message && <span>{errors.email?.message}</span>}
            <input placeholder="Telefone" {...register("phone")}></input>
            {errors.phone?.message && <span>{errors.phone?.message}</span>}
            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                type="button"
                onClick={() => deleteContact(contact?.id!, onClose)}
              >
                Deletar
              </Button>
              <Button colorScheme="blue" mr={3} type="submit">
                Atualizar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
