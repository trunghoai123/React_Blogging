import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import slugify from 'slugify';
import { Button } from '../../components/button';
import { Radio } from '../../components/checkbox';
import { Field, FieldCheckboxes } from '../../components/field';
import { Input } from '../../components/input';
import { Label } from '../../components/label';
import { db } from '../../firebase-app/firebase-config';
import NotFoundPage from '../../pages/NotFoundPage';
import { categoryStatus } from '../../utils/constants';
import DashboardHeading from '../dashboard/DashboardHeading';

const CategoryUpdate = () => {
    const navigate = useNavigate();
    const [URLSearchParams, func] = useSearchParams();
    const { handleSubmit, control, watch, reset, getValues, setValue, formState: { isSubmitting } } = useForm({
        mode: "onChange",
        defaultValues: {
            name: '',
            slug: '',
            status: 1,
            createdAt: '',
            updatedAt: '',
        }
    });
    const watchStatus = watch('status');
    useEffect(() => {
        const collDocRef = doc(db, 'categories', URLSearchParams.get('id'));
        getDoc(collDocRef)
            .then((doc) => {
                reset(doc.data());
            });
    }, [URLSearchParams, reset, setValue]);
    if(!URLSearchParams.get('id')) return <NotFoundPage></NotFoundPage>;
    const handleUpdateCategory = async (values) => {
        // const time = (new Date()).toDateString();
        // console.log(values);
        // console.log(values.createdAt.toLocaleString());
        const collUpdateRef = doc(db, 'categories', URLSearchParams.get('id'));
        await updateDoc(collUpdateRef, {
            ...values,
            status: Number(values.status),
            updatedAt: new Date().toDateString(),
            slug: slugify(values.slug || values.name, {lower: true}),
        });
        toast.success('Category was updated');
        navigate('/manage/category');
    }
    return (
        <div>
            <DashboardHeading title='Categories' desc='Update Categories'></DashboardHeading>
            <form autoComplete="off" onSubmit={handleSubmit(handleUpdateCategory)}>
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

export default CategoryUpdate;