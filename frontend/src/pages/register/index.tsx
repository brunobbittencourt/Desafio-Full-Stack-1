import { Header } from "@/components/header";
import { RegisterForm } from "@/components/register";
import Link from "next/link";
import { StyledRegister } from "./style";

export default function Register() {
  return (
    <>
      <Header page="register" />
      <StyledRegister>
        <RegisterForm />
      </StyledRegister>
    </>
  );
}
