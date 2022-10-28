import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Field } from "../components/field";
import { Button } from "../components/button";
import { useForm } from "react-hook-form";
import { IconEyeOff, IconEyeOpen } from "../components/icon";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { auth, db } from "../firebase-app/firebase-config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import AuthenticationPage from "./AuthenticationPage";
import { NavLink } from "react-router-dom";
import PasswordInput from "../components/input/PasswordInput";
import slugify from "slugify";
import { userRole, userStatus } from "../utils/constants";

const schema = yup.object({
  fullname: yup.string().required("Fullname cannot empty"),
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

const SignUpPage = () => {
  const navigate = useNavigate();
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
  const handleSignUp = async (values) => {
    try {
      const crdt = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await updateProfile(auth.currentUser, {
        displayName: values.fullname,
        imgUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      });
      // const collUsers = collection(db, 'users');
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        // add user and set UserId = user document id,
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.fullname, { lower: true }),
        avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        status: userStatus.ACTIVE,
        role: userRole.USER,
        createdAt: new Date().toDateString(),
      });
      // await addDoc(collUsers, {
      //     fullname: values.fullname,
      //     email: values.email,
      //     password: values.password,
      //     id: crdt.user.uid,
      // });
      // console.log(crdt);
      toast.success("Create account successfully");
      navigate("/");
    } catch (error) {
      const err = Object.values(error);
      if (err[0] === "auth/email-already-in-use") {
        toast.error(`Email ${values.email} has already in use`);
      }
    }
  };
  useEffect(() => {
    const arrErrors = Object.values(errors);
    if (arrErrors.length > 0) {
      toast.error(arrErrors[0].message, {});
    }
  }, [errors]);
  return (
    <AuthenticationPage>
      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="form"
        autoComplete="off"
      >
        {/* <div className='field'> */}
        <Field className="field">
          {/* <label className='inputLabel' htmlFor='username'>Username</label> */}
          <Label htmlFor="fullname">Fullname</Label>
          {/* <input style={{marginBottom: '20px'}} className='inputText' name='username' id='username' type='text' placeholder='Type user name' /> */}
          <Input
            // hasIcon={true}
            name="fullname"
            id="fullname"
            control={control}
            placeholder="Type your Fullname"
          >
            {/* <IconEyeOpen className='icon_container'></IconEyeOpen> */}
          </Input>
        </Field>
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
          <PasswordInput control={control}></PasswordInput>
          {/* <Input
                        // hasIcon={true}
                        type={ togglePassword ? 'text': 'password' }
                        name='password'
                        id='password'
                        control={control}
                        placeholder='Type your password'
                    >
                        { togglePassword ?
                            <IconEyeOpen onClick={() => setTogglePassword(false)}></IconEyeOpen>
                            :
                            <IconEyeOff onClick={() => setTogglePassword(true)}></IconEyeOff>
                        }
                    </Input> */}
        </Field>
        <div className="link-container">
          do you have an account already?{" "}
          <NavLink className="link" to={"/sign-in"}>
            Sign In
          </NavLink>
        </div>
        <Button
          style={{ width: "290px" }}
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </AuthenticationPage>
  );
};

export default SignUpPage;
