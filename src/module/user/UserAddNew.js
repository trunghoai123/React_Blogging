import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "../../components/image/ImageUpload";
import { userRole, userStatus } from "../../utils/constants";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import slugify from "slugify";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const UserAddNew = () => {
  const { control, watch, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: '',
      username: '',
      email: '',
      password: '',
      status: userStatus.ACTIVE,
      role: userRole.USER,
      // imageUrl: '',
      image: '',
      avatar: '',
      createdAt: '',
    }
  });
  // fullname: values.fullname,
  // username: slugify(values.fullname, { lower: true }),
  // email: values.email,
  // password: values.password,
  // role: userRole.USER,
  // status: userStatus.ACTIVE,
  // createdAt: new Date().toDateString(),
  // avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',

  // const [uploading, setUploading] = useState(false);
  const watchStatus = watch('status');
  const watchRole = watch('role');

  const {selectedImage, handleChangeImage, loadImgProgress, 
    setSelectedImage, imagePath, setImagePath} = useFirebaseImage(setValue);
  const handleAddUser = (values) => {
    console.log(values);
    const tmpValues = {...values};
    // const collRef = collection(db, 'users');
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: values.fullname,
          imgUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        });
      })
      .then(() => {
        setDoc(doc(db, 'users', auth.currentUser.uid), { // add user and set UserId = user document id,
          ...tmpValues,
          createdAt: new Date().toDateString(), //new Date().toDateString();
          image: tmpValues?.image?.name || '', // if not select image
          avatar: selectedImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        })
        .then(() => {
            reset({
              fullname: '',
              username: '',
              email: '',
              password: '',
              status: userStatus.ACTIVE,
              role: userRole.USER,
              image: '',
              avatar: '',
              createdAt: '',
            });
            setSelectedImage('');
            toast.success('User added');
        })
        .catch((err) => {
          toast.error('Cannot upload post');
        });
      })
      .then(() => {
        toast.success('Account was created');
      })
      .catch(() => {
        toast.warning('Cannot create account');
      })
    // addDoc(collRef, {
    //   ...tmpValues,
    //   createdAt: new Date().toDateString(), //new Date().toDateString();
    //   image: tmpValues?.image?.name || '', // if not select image
    //   avatar: selectedImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    // })
    // .then(() => {
    //     reset({
    //       fullname: '',
    //       username: '',
    //       email: '',
    //       password: '',
    //       status: userStatus.ACTIVE,
    //       role: userRole.USER,
    //       image: '',
    //       avatar: '',
    //       createdAt: '',
    //     });
    //     setSelectedImage('');
    //     toast.success('User added');
    // })
    // .catch((err) => {
    //   toast.error('Cannot upload post');
    // })
    // .finally(() => {

    // });
  }
  const handleAddUser2 = async (values) => {
    console.log(values);
    const tmpValues = {...values};
    // const collRef = collection(db, 'users');
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password)
      await updateProfile(auth.currentUser, {
        displayName: values.fullname,
        imgUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      });
      await setDoc(doc(db, 'users', auth.currentUser.uid), { // add user and set UserId = user document id,
        ...tmpValues,
        status: Number(tmpValues.status),
        role: Number(tmpValues.role),
        createdAt: new Date().toDateString(), //new Date().toDateString();
        image: tmpValues?.image?.name || '', // if not select image
        avatar: selectedImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        imagePath: imagePath || '',
      })
      reset({
        fullname: '',
        username: '',
        email: '',
        password: '',
        status: userStatus.ACTIVE,
        role: userRole.USER,
        image: '',
        avatar: '',
        createdAt: '',
      });
      setSelectedImage('');
      setImagePath('');
      toast.success('Account was created');

    } catch (error) {
      const err = Object.values(error);
      if(err && err[0] && err[0] === ('auth/email-already-in-use')){
          toast.error(`Email ${values.email} has already in use`);
      }
      else{
        toast.error('Cannot create account');
      }
    } finally{
      
    } 
  }
  return (
    <div>
      <DashboardHeading
        title="New user"
        desc="Add new user to system"
      ></DashboardHeading>
      <hr className="pb-4"></hr>
      <form onSubmit={handleSubmit(handleAddUser2)}>
        <div className="text-center mb-10">
          <ImageUpload src={selectedImage} onChange={handleChangeImage} 
            className="w-[200px] h-[200px] !rounded-5px min-h-0 mx-auto"></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes className='flex justify-between'>
              <Radio name="status" control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio name="status" control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio name="status" control={control}
                checked={Number(watchStatus) === userStatus.BANNED}
                value={userStatus.BANNED}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes className='flex justify-between'>
              <Radio name="role" control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio name="role" control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio> 
              <Radio name="role" control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button isLoading={isSubmitting} disabled={isSubmitting} type='submit' kind="primary" className="mx-auto w-[200px]">
          Add new user
        </Button>
      </form>
    </div>
  );
};

export default UserAddNew;
