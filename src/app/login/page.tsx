"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import LoginFormModel, { LoginModel } from "../models/login";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(LoginFormModel) });
  const [isShowPassword, setIsShowPassword] = useState(false);

  function toogleShowPassword() {
    setIsShowPassword((prev) => !prev);
  }

  function onSubmitForm(data: LoginModel) {
    console.log("Form Data", data);
  }

  return (
    <div className="px-4 sm:px-0">
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className="
          w-full max-w-md mx-auto
          flex flex-col gap-4
          px-6 py-8 sm:px-12 sm:py-16
          rounded-2xl sm:rounded-3xl
          shadow-[0_4px_20px_rgba(0,0,0,0.12)]
          dark:shadow-[0_4px_20px_rgba(0,0,0,0.6)]
        "
      >
        <h2 className="font-apple text-2xl sm:text-4xl font-semibold text-(--title) text-center mb-2 sm:mb-4">
          Login Form
        </h2>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="font-apple text-sm font-semibold mb-2"
          >
            Email<span>*</span>
          </label>

          <input
            type="email"
            id="email"
            placeholder="email..."
            {...register("email")}
            className="
              w-full h-11 px-4 rounded-md border
              text-base font-semibold
              border-(--input-border)
              bg-(--input-bg)
              outline-(--input-outline)
            "
          />
          {errors.email && (
            <p className="text-red-500 text-sm ms-1 mt-1 font-semibold">
              {" "}
              {errors.email.message}{" "}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="font-apple text-sm font-semibold mb-2"
          >
            Password*
          </label>

          <div className="relative">
            <input
              type={isShowPassword ? "text" : "password"}
              id="password"
              placeholder="password..."
              {...register("password")}
              className="
                w-full h-11 px-4 rounded-md border
                text-base font-semibold
                border-(--input-border)
                bg-(--input-bg)
                outline-(--input-outline)
              "
            />

            <Image
              width={22}
              height={22}
              src={
                isShowPassword
                  ? "/images/eye-icon-off.svg"
                  : "/images/eye-icon.svg"
              }
              alt="eye-icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={toogleShowPassword}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm ms-1 mt-1 font-semibold">
              {" "}
              {errors.password.message}{" "}
            </p>
          )}
        </div>

        <button className="common-button mt-3">
          <span className="relative z-10">Submit</span>
        </button>

        <p className="font-semibold text-sm sm:text-base text-center">
          Don't have an account?
          <Link
            className="font-bold ms-2 text-[#fb5650] link-hover relative"
            href="/signup"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
