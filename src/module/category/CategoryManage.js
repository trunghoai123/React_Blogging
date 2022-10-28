import DashboardHeading from "../../module/dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { Table } from "../../components/table";
import LabelStatus from '../../components/label/LabelStatus';
import {ActionDelete, ActionEdit, ActionView} from "../../components/action/";
import { collection, deleteDoc, doc, getDocs, limit, limitToLast, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { categoryStatus } from "../../utils/constants";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { debounce, orderBy } from 'lodash';

const NUMBER_CATEGORY_PER_PAGE = 2;
const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const [lastVisible, setLastVisible] = useState();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    async function getListCategory(){
      const colRef = collection(db, 'categories');
      var q = null;
      if(filter.trim() !== '') {
        q = query(colRef, where('name', '<=', filter + 'utf8'),
        where('name', '>=', filter), limit(NUMBER_CATEGORY_PER_PAGE));
      }
      else {
        q = query(colRef, limit(NUMBER_CATEGORY_PER_PAGE));
      }
      const listCategory = [];
      const documentSnapshots = await getDocs(q);
      
      documentSnapshots.forEach((doc) => {
        listCategory.push({
          ...doc.data(),
          id: doc.id,
        });
      })
      setTotal(documentSnapshots.size);
      setCategories(listCategory);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]); 
    };
    getListCategory(); 
  }, [filter]);

  const handleLoadMore = async () => {
    const colRef = collection(db, 'categories');
    const nextQuery = filter.trim() === '' ?
      query(colRef, startAfter(lastVisible) , limit(NUMBER_CATEGORY_PER_PAGE)) 
    : 
      query(colRef, where('name', '<=', filter + 'utf8'), where('name', '>=', filter), 
      startAfter(lastVisible), limit(NUMBER_CATEGORY_PER_PAGE))
    ; 
    const documentSnapshots = await getDocs(nextQuery);
    const listCategory = [...categories];
    documentSnapshots.forEach((doc) => {
      console.log(doc.data());;
      listCategory.push({
        ...doc.data(),
        id: doc.id,
      });
    })
    setTotal(documentSnapshots.size);
    setCategories(listCategory);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]); 
  }

  const handleFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 1000);

  const handleDeleteCategory = async (docId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async(result) => {
      if (result.isConfirmed) {
        const collDeleteRef = doc(db, 'categories', docId);
        await deleteDoc(collDeleteRef);
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        ); 
        window.location.reload();
      }
    })
    .catch((err) => {
      toast.warn('error happened');
    });

  }
  
  const navigate = useNavigate();
  return (
    <div>
      <DashboardHeading
        title="Categories"
        desc="Manage your category"
      ></DashboardHeading>
      <div className='p-3 border border-green-500 rounded-md mb-2'>
        <input className="text-green-400 font-medium w-full" type='text' placeholder='Type Category name...'
          onChange={handleFilter}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Name</td>
            <td>Slug</td>
            <td>Status</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map((item, index) => {
            return <tr key={index}>
              <td>{item?.id}</td>
              <td>{item?.name}</td>
              <td>
                <span className='italic font-light text-gray-500'>{item?.slug}</span>
              </td>
              <td>
                { Number(item?.status) === categoryStatus.APPROVED ? 
                      <LabelStatus type='success'>Approved</LabelStatus> 
                  : 
                    <LabelStatus type='danger'>Unapproved</LabelStatus>  }
              </td>
              <td>
                <div className="flex justify-center gap-x-1 items-center">
                  <ActionView></ActionView>
                  <ActionEdit onClick={() => navigate(`/manage/update-category?id=${item.id}`)}></ActionEdit>
                  <ActionDelete onClick={() => handleDeleteCategory(item.id)}></ActionDelete>
                </div>
              </td>
            </tr>
          })
          }
        </tbody>
      </Table>
      {
        total === 2 && 
        <div className="mt-3 pl-5">
          <span onClick={handleLoadMore} className="p-3 text-white font-medium rounded-sm select-none cursor-pointer bg-green-400">Load More...</span>
        </div>
      }
    </div>
  );
};



export default CategoryManage;
