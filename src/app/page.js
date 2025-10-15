import { Suspense } from "react";
import LoginForm from "@/app/login/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="styleNotResponsive">
        <LoginForm />
      </div>
      <div className="styleResponsive">
        <h1>Esta pagina esta diseñada para verse desde una Computadora</h1>
      </div>
    </Suspense>
  );
}