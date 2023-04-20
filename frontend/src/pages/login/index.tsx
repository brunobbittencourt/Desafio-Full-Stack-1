import { LoginForm } from "@/components/login";
import Link from "next/link";
import { StyledLogin } from "./style";
import { Header } from "@/components/header";

export default function Login() {
  return (
    <>
      <Header page="login" />
      <StyledLogin>
        <LoginForm />
      </StyledLogin>
    </>
  );
}
