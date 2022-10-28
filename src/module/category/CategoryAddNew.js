import { Button } from "../../components/button";
import { Radio } from "../../components/checkbox";
import { Field, FieldCheckboxes } from "../../components/field";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import DashboardHeading from "../../module/dashboard/DashboardHeading";
import { categoryStatus } from '../../../src/utils/constants';
import React from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from '../../firebase-app/firebase-config'
import slugify from "slugify";
import { toast } from "react-toastify";

const CategoryAddNew = () => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: '',
      slug: '',
      status: 1,
      createdAt: '',
    }
  });
  const watchStatus = watch('status');
  const handleAddCategory = async (values) => {
    const cateColl = collection(db, 'categories');
    try {
      await addDoc(cateColl, {
        ...values,
        status: Number(values.status),
        createdAt: new Date().toDateString(),
        slug: slugify(values.slug || values.name, { lower: true }),
      });
      toast.success('Category was Added');
    } catch (error) {
      toast.error(error.message);
    }finally{
      reset( {
        name: '',
        slug: '',
        status: 1,
        createdAt: '',
      });
    }
    
  }
  return (
    <div>
      <DashboardHeading
        title="New category"
        desc="Add new category"
      ></DashboardHeading>
      <form autoComplete="off" onSubmit={handleSubmit(handleAddCategory)}>
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <div className="flex flex-wrap gap-x-5">
              <FieldCheckboxes>
                <Radio name="status" control={control}
                  checked={Number(watchStatus) === categoryStatus.APPROVED}
                  // onClick={() => setValue('status', categoryStatus.APPROVED)}
                  value={categoryStatus.APPROVED}
                >
                  Approved
                </Radio>
                <Radio name="status" control={control} 
                  checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                  // onClick={() => setValue('status', categoryStatus.UNAPPROVED)}
                  value={categoryStatus.UNAPPROVED}
                >
                  Unapproved
                </Radio>
              </FieldCheckboxes>
            </div>
          </Field>
        </div>
        <Button isLoading={isSubmitting} disabled={isSubmitting} kind="primary" className="mx-auto w-[220px]" type='submit'>
          Add new category
        </Button>
      </form>
    </div>
  );
};

export default CategoryAddNew;
