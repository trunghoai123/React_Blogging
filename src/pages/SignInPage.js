import React from "react";
import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Field } from "../components/field";
import { Button } from "../components/button";
import AuthenticationPage from "./AuthenticationPage";
import { IconEyeOff, IconEyeOpen } from "../components/icon";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-app/firebase-config";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter correct email")
    .required("Email cannot empty"),
  password: yup
    .string()
    .required("Password cannot empty")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contains 1 char, 1 num, 1 upper case, 1 lower case and minimum 8 chars "
    ),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const [togglePassword, setTogglePassword] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0].message, {});
    }
  }, [errors]);
  const handleSignIn = async (values) => {
    console.log(values);
    try {
      const crdt = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      toast.success("Login successfully");
    } catch (error) {
      toast.error("Please check your email and password again");
    }
  };

  const { user } = useAuthContext();
  // onAuthStateChanged(auth, (user) => {
  //     if(user){
  //         navigate('/');
  //     }
  // });
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  return (
    <AuthenticationPage>
      <form
        onSubmit={handleSubmit(handleSignIn)}
        className="form"
        autoComplete="off"
      >
        <Field className="field">
          <Label htmlFor="email">Email</Label>
          <Input
            hasIcon={true}
            type="email"
            name="email"
            id="email"
            control={control}
            placeholder="Type your email"
          ></Input>
        </Field>
        <Field className="field">
          <Label htmlFor="password">Password</Label>
          <Input
            hasIcon={true}
            type={togglePassword ? "text" : "password"}
            name="password"
            id="password"
            control={control}
            placeholder="Type your password"
          >
            {togglePassword ? (
              <IconEyeOpen
                onClick={() => setTogglePassword(false)}
              ></IconEyeOpen>
            ) : (
              <IconEyeOff onClick={() => setTogglePassword(true)}></IconEyeOff>
            )}
          </Input>
        </Field>
        <Button
          style={{ width: "290px" }}
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignInPage;
