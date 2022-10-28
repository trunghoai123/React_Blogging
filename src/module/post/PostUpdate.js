import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { postStatus } from '../../utils/constants';
import ImageUpload from "../../components/image/ImageUpload"; 
import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/image/toggle/Toggle";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from 'react-toastify';
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import slugify from 'slugify';
import ImageUploader from 'quill-image-uploader';
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
Quill.register('modules/imageUploader', ImageUploader);

const PostUpdateStyles = styled.div``;
const PostUpdate = () => {
    const navigate = useNavigate();
    const [SearchParams, func] = useSearchParams();
    const { control, watch, setValue, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {
            title: '',
            slug: '',
            status: 2,
            hot: false,
            image: '', // image file,  change when select another image, change to image name when add post
            imageUrl: '',
            createdAt: '',
            user: '',
            category: '',
        },
    });
    const {selectedImage, handleChangeImage,
        loadImgProgress, setSelectedImage} = useFirebaseImage(setValue);
    const { user } = useAuthContext();
    const [content, setContent] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectingCategory, setSelectingCategory] = useState('');
    const [listCategory, setListCategory] = useState([]);
    const watchStatus = watch("status");
    const watchHot = watch("hot");
    const handleAddPost = async (values) => {
        console.log(values);
        //get category doc
        const cateDoc = await getDoc(doc(db, 'categories', values?.category))
        const categoryInfo = {
            ...cateDoc.data(),
            id: cateDoc.id,
        }

        const docRef = doc(db, 'posts', SearchParams.get('id'));
        await updateDoc(docRef, {
            ...values,
            category: categoryInfo,
            image: values?.image?.name || '',
            slug: slugify(values?.slug || values?.title, {lower: true, trim: true}),
            content,
        });
        toast.success('post updated');
        navigate('/manage/post');
        // setUploading(true);
        // const tmpValues = {...values};
        // try {
        // //get category doc
        // const cateDoc = await getDoc(doc(db, 'categories', tmpValues?.category))
        // const categoryInfo = {
        //     ...cateDoc.data(),
        //     id: cateDoc.id,
        // }

        // //get user doc
        // const userDoc = await getDoc(doc(db, 'users', user.uid))
        // const userInfo = {
        //     ...userDoc.data(),
        //     id: userDoc.id,
        // }

        // await addDoc(collection(db, 'posts'), {
        //     ...tmpValues,
        //     slug: slugify(tmpValues.slug || tmpValues.title, { lower: true }),
        //     status: Number(tmpValues.status),
        //     image: tmpValues?.image?.name,
        //     imageUrl: selectedImage,
        //     userId: user.uid,
        //     createdAt: new Date().toDateString(),
        //     user: userInfo || '',
        //     category: categoryInfo || '',
        // })
        // reset({
        //     title: '',
        //     slug: '',
        //     status: 2,
        //     category: '',
        //     user: '',
        //     hot: false,
        //     image: '', // image file,  change when select another image, change to image name when add post
        //     imageUrl: '',
        //     createdAt: '',
        // });
        // setSelectingCategory('');
        // setSelectedImage('');
        // toast.success('Post added');
        // setUploading(false);
        // } catch (error) {
        // setUploading(false);
        // toast.error('cannot upload post');
        // }
    }
    useEffect(() => { // get categories
        const getCategories = async () => {
        const collRef = collection(db, 'categories');
        const q = query(collRef, where('status', '>', 0), orderBy( 'status'));
        const data = await getDocs(q);
        const categories = [];
        data.forEach((doc) => {
            categories.push({
            id: doc.id,
            ...doc.data(),
            });
            setListCategory(categories);
        });
        }
        getCategories();
    }, []); 
    useEffect(() => { // get data from post
        const collDocRef = doc(db, 'posts', SearchParams.get('id'));
        getDoc(collDocRef)
            .then((doc) => {
                reset({
                    ...doc.data(),
                    category: doc.data()?.category?.id,
                });
                setSelectingCategory(doc.data()?.category?.name);
                setSelectedImage(doc.data()?.imageUrl);
                setContent(doc.data()?.content || '');
            }); 
    }, [SearchParams, reset, setSelectedImage]);
    const handleChangeCategory = (item) => {
        setSelectingCategory(item.name);
        setValue('category', item.id);
    }
    const modules = useMemo( () => ({
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image']
        ],
        // markdownShortcuts: {},
        imageUploader: {
            upload: async (file) => {
                const bodyFormData = new FormData();
                bodyFormData.append('image', file);
                const response = await axios({
                    method: 'post',
                    url: 'https://api.imgbb.com/1/upload?key=db935e3c906f0130fa51ae896f32cfe3',
                    data: bodyFormData,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                return response.data.data.url;
                // return new Promise((resolve, reject) => {
                // resolve('https://api.imgbb.com/1/upload?key=db935e3c906f0130fa51ae896f32cfe3');
                // });
            }
        }
    }), []);
    return (
        <PostUpdateStyles>
            <h1 className="dashboard-heading">Add new post</h1> 
            <form onSubmit={handleSubmit(handleAddPost)}>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                <Field>
                    <Label>Title</Label>
                    <Input
                    control={control}
                    placeholder="Enter your title"
                    name="title"
                    ></Input>
                </Field>
                <Field>
                    <Label>Slug</Label>
                    <Input
                    control={control}
                    placeholder="Enter your slug"
                    name="slug"
                    ></Input>
                </Field>
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                <Field>
                    <Label>Status</Label>
                    <div className="flex items-center gap-x-5">
                        <Radio
                            name="status"
                            control={control}
                            checked={Number(watchStatus) === postStatus.APPROVED}
                            onClick={() => setValue("status", postStatus.APPROVED)}
                            value={postStatus.APPROVED}
                        >
                            Approved
                        </Radio>
                        <Radio
                            name="status"
                            control={control}
                            checked={Number(watchStatus) === postStatus.PENDING}
                            onClick={() => setValue("status", postStatus.PENDING)}
                            value={postStatus.PENDING}
                        >
                            Pending
                        </Radio>
                        <Radio
                            name="status"
                            control={control}
                            checked={Number(watchStatus) === postStatus.REJECTED}
                            onClick={() => setValue("status", postStatus.REJECTED)}
                            value={postStatus.REJECTED}
                        >
                            Reject
                        </Radio>
                    </div>
                </Field>
                <Field>
                    <div>
                        <Label>Feature post </Label>
                    </div>
                    <div className="flex justify-center">
                        <Toggle on={watchHot} onClick={() => setValue('hot', !watchHot)}></Toggle>
                    </div>
                </Field>
                </div>
                <div className="grid grid-cols-2 gap-x-10 mb-10">
                    <Field>
                        <Label>Category</Label>
                        <Dropdown>
                        <Dropdown.DropdownBox placeholder={ selectingCategory ||`Select your Category`}></Dropdown.DropdownBox>
                        <Dropdown.DropdownList className='h-[200px] overflow-auto'>
                            {listCategory.length > 0 && listCategory.map((item) => {
                            return <Dropdown.Option onClick={() => handleChangeCategory(item)} key={item.id}>{item.name}</Dropdown.Option>
                            })}
                        </Dropdown.DropdownList>
                        {/* <Dropdown.Option>Blockchain</Dropdown.Option>
                        <Dropdown.Option>Setup</Dropdown.Option>
                        <Dropdown.Option>Nature</Dropdown.Option>
                        <Dropdown.Option>Developer</Dropdown.Option> */}
                        </Dropdown>
                    </Field>
                    <Field>
                        <ImageUpload
                        src={selectedImage}
                        accept='image/png, image/jpeg, image/jpg'
                        onChange={handleChangeImage} 
                        name='image'
                        progress={loadImgProgress}
                        ></ImageUpload>
                        {/* <input accept="image/png, image/jpeg, image/jpg" type='file' name="image" onChange={handleChangeImage} ></input> */}
                    </Field>
                    {/* <Field>
                        <Label>Author</Label>
                        <Input control={control} placeholder="Find the author"></Input>
                    </Field> */}
                </div>
                <div className="mb-10">
                    <Field>
                        <Label>Content</Label>
                        <div className="w-full entry-content">
                            <ReactQuill modules={modules} theme="snow" value={content} onChange={setContent}/>
                        </div>
                    </Field>
                </div>
                <Button isLoading={isSubmitting} disabled={isSubmitting} type="submit" className="mx-auto w-[240px]">
                Update now
                </Button>
            </form>
        </PostUpdateStyles>
    );
};

export default PostUpdate;