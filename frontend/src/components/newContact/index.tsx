import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { IContactData } from "@/interfaces/contact.interfaces";
import { useContext } from "react";
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

export function NewContact({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createContact } = useContext(ContactContext);

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
  } = useForm<IContactData>({ resolver: yupResolver(schema) });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Cadastrar Novos Contatos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            onSubmit={handleSubmit((data) => {
              reset(
                { email: "", fullName: "", phone: "" },
                { keepDirty: true, keepErrors: true }
              );
              createContact(data, onClose);
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
              <Button colorScheme="blue" mr={3} type="submit">
                Cadastrar Novo Contato
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
