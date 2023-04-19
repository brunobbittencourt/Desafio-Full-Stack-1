import { Header } from "@/components/header";
import { RegisterForm } from "@/components/register";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <Header page="register" />
      <main>
        <RegisterForm />
        <Link href={"/login"}>Logar</Link>
      </main>
    </>
  );
}
