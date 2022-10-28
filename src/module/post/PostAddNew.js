import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Dropdown } from "../../components/dropdown";
import { Field } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { postStatus } from '../../utils/constants';
import ImageUpload from "../../components/image/ImageUpload"; 
import useFirebaseImage from "../../hooks/useFirebaseImage";
import Toggle from "../../components/image/toggle/Toggle";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { toast } from 'react-toastify';
import { useAuthContext } from "../../contexts/AuthContext";
const slugify = require('slugify');

const PostAddNewStyles = styled.div``;

const PostAddNew = () => {
  const { control, watch, setValue, handleSubmit, reset } = useForm({
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
  const [uploading, setUploading] = useState(false);
  const [selectingCategory, setSelectingCategory] = useState('');
  const [listCategory, setListCategory] = useState([]);
  const watchStatus = watch("status");
  const watchHot = watch("hot");
  // const handleAddPost = (values) => {
  //   console.log(values);
  //   setUploading(true);
  //   const tmpValues = {...values};
  //   // tmpValues.slug = slugify(values.slug || values.title, { lower: true });
  //   // tmpValues.status = Number(values.status);
  //   // handleUploadImage(tmpValues.image); // return true if uploaded image
  //   const collRef = collection(db, 'posts');
  //   addDoc(collRef, {
  //     ...tmpValues,
  //     slug: slugify(tmpValues.slug || tmpValues.title, { lower: true }),
  //     status: Number(tmpValues.status),
  //     image: tmpValues.image.name,
  //     imageUrl: selectedImage,
  //     userId: user.uid,
  //     createdAt: serverTimestamp(),
  //   })
  //   .then(() => {
  //     reset({
  //       title: '',
  //       slug: '',
  //       status: 2,
  //       category: '',
  //       hot: false,
  //       image: '', // image file,  change when select another image, change to image name when add post
  //       imageUrl: '',
  //     });
  //     setSelectingCategory('');
  //     setSelectedImage('');
  //     toast.success('Post added');
  //     setUploading(false);
  //   })
  //   .catch((err) => {
  //     setUploading(false);
  //     toast.error('cannot upload post');
  //   })
  //   .finally(() => {
  //     setUploading(false);
  //   });
  // }
  const handleAddPost2 = async (values) => {
    console.log(values);
    setUploading(true);
    const tmpValues = {...values};
    try {
      //get category doc
      const cateDoc = await getDoc(doc(db, 'categories', tmpValues?.category))
      const categoryInfo = {
        ...cateDoc.data(),
        id: cateDoc.id,
      }

      //get user doc
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userInfo = {
        ...userDoc.data(),
        id: userDoc.id,
      }

      await addDoc(collection(db, 'posts'), {
        ...tmpValues,
        slug: slugify(tmpValues.slug || tmpValues.title, { lower: true }),
        status: Number(tmpValues.status),
        image: tmpValues?.image?.name,
        imageUrl: selectedImage,
        userId: user.uid,
        createdAt: new Date().toDateString(),
        user: userInfo || '',
        category: categoryInfo || '',
      })
      reset({
        title: '',
        slug: '',
        status: 2,
        category: '',
        user: '',
        hot: false,
        image: '', // image file,  change when select another image, change to image name when add post
        imageUrl: '',
        createdAt: '',
      });
      setSelectingCategory('');
      setSelectedImage('');
      toast.success('Post added');
      setUploading(false);
    } catch (error) {
      setUploading(false);
      toast.error('cannot upload post');
    }
  }
  useEffect(() => {
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
  // const [selectedImage, setSelectedImage] = useState('');
  // const [loadImgProgress, setLoadImgProgress ] = useState(0);
  // const handleUploadImage = (file) => {
  //   const storage = getStorage();
  //   // Upload file and metadata to the object 'images/mountains.jpg'
  //   // 'images/' + user.email + '/' + file.name 
  //   const storageRef = ref(storage,`images/${user.email}/post/${uuidv4()}`);
  //   const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  //   // Listen for state changes, errors, and completion of the upload.
  //   uploadTask.on('state_changed', (snapshot) => {
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log('Upload is ' + progress + '% done');

  //     switch (snapshot.state) {
  //       case 'paused':
  //         console.log('Upload is paused');
  //         break;
  //       case 'running':
  //         console.log('Upload is running');
  //         break;
  //       default: console.log('Cannot upload');
  //     }
  //     }, 
  //     (error) => { 
        
  //     }, 
  //     () => {
  //       // Upload completed successfully, now we can get the download URL
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         console.log('File available at', downloadURL);
  //       });
  //     }
  //   );
  // }
  // const handleChangeImage = (e) => {
  //   const file = e.target.files[0];
  //   if(!file) return null;
  //   setValue('image', e.target.files[0]);
  //   handleSelectImage(e.target.files[0]);
  // }
  // const handleSelectImage = (file) => {
  //   const storage = getStorage();
  //   // Upload file and metadata to the object 'images/mountains.jpg'
  //   const storageRef = ref(storage, `images/${user.email}/edittingPostImg`);
  //   const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  //   // Listen for state changes, errors, and completion of the upload.
  //   uploadTask.on('state_changed', (snapshot) => {
  //     // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log('Upload is ' + progress + '% done');
  //     setLoadImgProgress(progress);
  //     switch (snapshot.state) {
  //       case 'paused':
  //         console.log('Upload is paused');
  //         break;
  //       case 'running':
  //         console.log('Upload is running');
  //         break;
  //       default: console.log('Cannot upload');
  //     }
  //   }, 
  //   (error) => { 
      
  //   }, 
  //   () => {
  //     // Upload completed successfully, now we can get the download URL
  //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //       console.log('File available at', downloadURL);
  //       setSelectedImage(downloadURL);
  //     });
  //   }
  //   );
  // }
  const handleChangeCategory = (item) => {
    setSelectingCategory(item.name);
    setValue('category', item.id);
  }
  return (
    <PostAddNewStyles>
      <h1 className="dashboard-heading">Add new post</h1> 
      <form onSubmit={handleSubmit(handleAddPost2)}>
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
        <Button isLoading={uploading} disabled={uploading} type="submit" className="mx-auto w-[240px]">
          Add new post
        </Button>
      </form>
    </PostAddNewStyles>
  );
};

export default PostAddNew;
