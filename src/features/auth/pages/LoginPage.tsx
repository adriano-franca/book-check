import { LoginForm } from "../components/LoginForm"

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
          </div>
        </div>
      </div>
    </div>
  )
}
