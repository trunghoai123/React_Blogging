import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUpload from "../../components/image/ImageUpload";
import { userRole, userStatus } from "../../utils/constants";
import useFirebaseImage from "../../hooks/useFirebaseImage";
import slugify from "slugify";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase-app/firebase-config";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotFoundPage from "../../pages/NotFoundPage";

const UpdateUser = () => {
    const [userParams] = useSearchParams();
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
            // createdAt: '',
            updatedAt: ''
        }
    });
    const {selectedImage, handleChangeImage, loadImgProgress, setSelectedImage} = useFirebaseImage(setValue);
    useEffect(() => {
        const collDocRef = doc(db, 'users', userParams.get('id'));
        getDoc(collDocRef)
            .then((doc) => {
                reset(doc.data());
                setSelectedImage(doc.data()?.avatar);
            });
    }, [userParams, reset, setValue, setSelectedImage]);
    console.log('re-rendered'); 
    const navigate = useNavigate();
    const watchStatus = watch('status');
    const watchRole = watch('role');

    const handleUpdateUser = async (values) => {
        console.log(values);
        const tmpValues = {...values};
        try {
            const refDoc = doc(db, 'users', userParams.get('id'));
            await updateDoc(refDoc, { // add user and set UserId = user document id,
                ...tmpValues,
                status: Number(tmpValues.status),
                role: Number(tmpValues.role),
                updatedAt: new Date().toDateString(), //new Date().toDateString();
                image: tmpValues?.image?.name || '', // if not select image
                avatar: selectedImage || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            })
            navigate('/manage/user');
            toast.success('Account was updated');
        } catch (error) {
                toast.error('Cannot update account');
        } finally{
        
        }
    }
    return (
        <div>
            <DashboardHeading
                title="Update user"
                desc="Update user"
            ></DashboardHeading>
            <hr className="pb-4"></hr>
            <form onSubmit={handleSubmit(handleUpdateUser)}>
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
                Update now
                </Button>
            </form>
        </div>
    );
};

export default UpdateUser;