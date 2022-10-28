import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { useAuthContext } from '../contexts/AuthContext';
const metadata = {
  contentType: 'image/jpeg'
};
/**
 * 
 * @param {function} setValue function from useForm (react hook form), used to set image field for useForm;
 * @returns 
 */
export default function useFirebaseImage(setValue = () => {}){
    const { user } = useAuthContext();
    const [selectedImage, setSelectedImage] = useState('');
    const [loadImgProgress, setLoadImgProgress ] = useState(0);
    // const handleUploadImage = (file) => {
    //     const storage = getStorage();
    //     // Upload file and metadata to the object 'images/mountains.jpg'
    //     // 'images/' + user.email + '/' + file.name 
    //     const storageRef = ref(storage,`images/${user.email}/post/${uuidv4()}`);
    //     const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    //     // Listen for state changes, errors, and completion of the upload.
    //     uploadTask.on('state_changed', (snapshot) => {
    //       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //       console.log('Upload is ' + progress + '% done');
    //       switch (snapshot.state) {
    //         case 'paused':
    //           console.log('Upload is paused');
    //           break;
    //         case 'running':
    //           console.log('Upload is running');
    //           break;
    //         default: console.log('Cannot upload');
    //       }
    //       }, 
    //       (error) => { 

    //       }, 
    //       () => {
    //         // Upload completed successfully, now we can get the download URL
    //         // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //         //   console.log('File available at', downloadURL);
    //         // });
    //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //           console.log('File available at', downloadURL);
    //         });
    //       }
    //     );
    //   }
      const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if(!file) return null;
        setValue('image', e.target.files[0]);
        handleSelectImage(e.target.files[0]);
      }
      const handleSelectImage = (file) => {
        const storage = getStorage();
        // Upload file and metadata to the object 'images/mountains.jpg'
        // const storageRef = ref(storage, `images/${user.email}/edittingPostImg`);
        const storageRef = ref(storage, `images/${user.email}/selectedImage-` + uuidv4());
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed', (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setLoadImgProgress(progress);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default: console.log('Cannot upload');
          }
        }, 
        (error) => {
          
        }, 
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setSelectedImage(downloadURL);
          });
        }
        );
      }
    return {
        // handleUploadImage,
        selectedImage,
        handleChangeImage, 
        loadImgProgress, 
        setSelectedImage, 
    };
}; 