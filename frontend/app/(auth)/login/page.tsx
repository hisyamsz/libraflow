import { Suspense } from "react";
import Login from "./_components/login";

export const metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}
