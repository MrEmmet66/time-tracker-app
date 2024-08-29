import { useSelector } from "react-redux";

import { useRouter } from "../../hooks/use-router.ts";
import LoginForm from "../../components/forms/LoginForm.tsx";
import { RootState } from "../../redux/store.ts";
import AuthLayout from "../../layouts/AuthLayout.tsx";

function LoginPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  if (user) {
    router.push("/");
  }

  return (
    <AuthLayout>
      <div className="mt-40">
        <LoginForm />
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
