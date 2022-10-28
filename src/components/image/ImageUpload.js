import React, { Fragment } from "react";
import propTypes, { bool, func, number, string } from 'prop-types';

const ImageUpload = (props) => {
  const {
    name,
    className = "",
    progress = 0,
    image = '',
    handleDeleteImage = () => {},
    accept,
    src = '',
    ...rest
  } = props;
  return (
    <label
      className={`cursor-pointer flex items-center justify-center bg-gray-100 border border-dashed w-full min-h-[200px] rounded-lg ${className} relative overflow-hidden group`}
    >
      <input
        accept={accept}
        type="file"
        name={name}
        className="hidden-input"
        onChange={() => {}}
        {...rest}
      />
        {
          src ? 
          <div className="w-full h-full">
            <img
              src={src}
              alt="upload-img"
              className="w-[390px] h-[190px] object-contain"
            />
          </div>
          :
          <div className="flex flex-col items-center text-center pointer-events-none">
            <img
              src='/img-upload.png'
              alt="upload-img"
              className="max-w-[80px] mb-5"
            />
            <p className="font-semibold">Choose photo</p>
          </div>
        }
        { progress < 100 &&
          <div style={{
            width: `${Math.ceil(progress)}%`}
          } className={`${Math.ceil(progress) < 30 ? 'bg-red-400' : Math.ceil(progress) < 70 ? 'bg-yellow-400' : 'bg-green-400'} absolute h-1 bg-green-400 bottom-0 left-0 transition-all image-upload-progress`}>
          </div>
        }
    </label>
  );
};

ImageUpload.propTypes = {
  name: string,
  className: string,
  progress: number,
  image: string,
  handleDeleteImage: func,
  accept: string,
  src: string,
}

export default ImageUpload;
