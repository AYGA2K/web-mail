import { useForm } from "react-hook-form"
import { Link, useNavigate } from "@remix-run/react"
import { useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface Props {
  type: "login" | "signup"
}

export function AuthForm({ type }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const [apiError, setApiError] = useState("")

  const isSignup = type === "signup"
  const password = watch("password")

  const onSubmit = async (data: any) => {
    setApiError("")
    let Url = `${import.meta.env.API_BASE_URL}/auth/login`
    if (isSignup) {
      Url = `${import.meta.env.API_BASE_URL}/auth/signup`
    }
    try {
      const res = await fetch(Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || "Something went wrong")

      navigate("/dashboard")
    } catch (err: any) {
      setApiError(err.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-md bg-white border rounded-xl shadow-sm p-8"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800">
        {isSignup ? "Create Your WebMail Account" : "Login to WebMail"}
      </h1>

      {apiError && (
        <p className="text-sm text-red-500 text-center">{apiError}</p>
      )}

      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            {...register("firstName", {
              required: "First Name is required",
            })}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message as string}</p>
          )}
        </div>
      )}
      {isSignup && (
        // last name
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            {...register("lastName", {
              required: "Last Name is required",
            })}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message as string}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          type="email"
          id="email"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message as string}</p>
        )}
      </div>

      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="repeatPassword">Repeat Password</Label>
          <Input
            type="password"
            id="repeatPassword"
            {...register("repeatPassword", {
              required: "Please repeat your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.repeatPassword && (
            <p className="text-sm text-red-500">
              {errors.repeatPassword.message as string}
            </p>
          )}
        </div>
      )}

      {!isSignup && (
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
      )}

      <Button type="submit" className="w-full">
        {isSignup ? "Sign Up" : "Login"}
      </Button>

      <div className="text-center text-sm text-gray-600">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </>
        )}
      </div>
    </form>
  )
}
