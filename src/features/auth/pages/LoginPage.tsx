import { LoginForm } from "../components/LoginForm";
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-[3fr_2fr]">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/login-image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
            <p className="mt-4 text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-blue-500 hover:underline font-medium"
              >
                Cadastrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};