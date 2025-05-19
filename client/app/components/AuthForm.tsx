import { useForm } from "react-hook-form"
import { Link, useNavigate } from "@remix-run/react"
import { useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useToast } from "~/hooks/use-toast"


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
  const { toast } = useToast()

  const isSignup = type === "signup"
  const password = watch("password")

  const onSubmit = async (data: any) => {
    setApiError("")
    let url = `${import.meta.env.VITE_API_BASE_URL}/auth/login`
    if (isSignup) {
      url = `${import.meta.env.VITE_API_BASE_URL}/auth/register`
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      console.log(res)
      const result = await res.json()
      console.log(result)
      if (!res.ok) throw new Error(result.message || "Something went wrong")

      toast({
        title: isSignup ? "Account Created" : "Login Successful",
        description: isSignup
          ? "Your account has been created successfully. Please log in."
          : "You have been logged in successfully.",
        className: "bg-green-600 text-white border-green-700",
      })

      if (isSignup) {
        navigate("/login")
      } else {
        navigate("/")
      }
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
          <Label htmlFor="first_name">First Name</Label>
          <Input
            type="text"
            id="first_name"
            {...register("first_name", {
              required: "First Name is required",
            })}
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message as string}</p>
          )}
        </div>
      )}

      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            type="text"
            id="last_name"
            {...register("last_name", {
              required: "Last Name is required",
            })}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message as string}</p>
          )}
        </div>
      )}

      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="user_name">Username</Label>
          <Input
            type="text"
            id="user_name"
            {...register("user_name", {
              required: "User Name is required",
              pattern: {
                value: /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-z0-9.]{6,30}$/,
                message:
                  "Username must be 6–30 characters, lowercase letters, numbers, or dots. Cannot start/end with dot or contain consecutive dots.",
              },
            })}
          />
          {errors.user_name && (
            <p className="text-sm text-red-500">{errors.user_name.message as string}</p>
          )}
        </div>
      )}

      {!isSignup && (
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
      )}

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
          <Label htmlFor="repeat_password">Repeat Password</Label>
          <Input
            type="password"
            id="repeat_password"
            {...register("repeat_password", {
              required: "Please repeat your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.repeat_password && (
            <p className="text-sm text-red-500">
              {errors.repeat_password.message as string}
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
