
import { Pagination } from "../../components/pagination";
import { Table } from "../../components/table";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { collection, deleteDoc, doc, getDocs, limit, onSnapshot, query, startAfter, where } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { debounce } from "lodash";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { postStatus, userStatus } from "../../utils/constants";
import LabelStatus from "../../components/label/LabelStatus";
import { reload } from "firebase/auth";

const NUMBER_POST_PER_PAGE = 2;
const PostManage = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('');
  const [lastVisible, setLastVisible] = useState();
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    async function getListCategory(){
      const colRef = collection(db, 'posts');
      var q = null;
      if(filter.trim() !== '') {
        q = query(colRef, where('title', '<=', filter + 'utf8'),
        where('title', '>=', filter), limit(NUMBER_POST_PER_PAGE));
      }
      else {
        q = query(colRef, limit(NUMBER_POST_PER_PAGE));
      }
      const documentSnapshots = await getDocs(q);
      
      // const listPost = [];
      // documentSnapshots.forEach((doc) => {
      //   listPost.push({
      //     ...doc.data(),
      //     id: doc.id,
      //   });
      // })
      // setPosts(listPost);

      onSnapshot(q, (snapshot) => {
        let listPost = [];
        snapshot.forEach((doc) => {
          listPost.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setPosts(listPost);
      });
      setTotal(documentSnapshots.size);
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]); 
    };
    getListCategory(); 
  }, [filter]);

  const handleLoadMore = async () => {
    const colRef = collection(db, 'posts');
    const nextQuery = filter.trim() === '' ?
      query(colRef, startAfter(lastVisible) , limit(NUMBER_POST_PER_PAGE)) 
    : 
      query(colRef, where('title', '<=', filter + 'utf8'), where('title', '>=', filter), 
      startAfter(lastVisible), limit(NUMBER_POST_PER_PAGE))
    ; 
    const documentSnapshots = await getDocs(nextQuery);
    const listCategory = [...posts];
    documentSnapshots.forEach((doc) => {
      console.log(doc.data());;
      listCategory.push({
        ...doc.data(),
        id: doc.id,
      });
    })
    setTotal(documentSnapshots.size);
    setPosts(listCategory);
    setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]); 
  }

  const handleFilter = debounce((e) => {
    setFilter(e.target.value);
  }, 1000);

  const handleDeletePost = async (docId) => {
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
        const collDeleteRef = doc(db, 'posts', docId);
        await deleteDoc(collDeleteRef);
        Swal.fire(
          'Deleted!',
          'Your post has been deleted.',
          'success'
        ); 
        window.location.reload();
      }
    })
    .catch((err) => {
      toast.warn('error happened');
    });
  }
  const renderStatus = (status) => {
    switch (status) {
      case postStatus.APPROVED:
        return <LabelStatus type='success' >Approved</LabelStatus>;
      case postStatus.PENDING:
        return <LabelStatus type='warning'>Pending</LabelStatus>;
      case postStatus.REJECTED:
        return <LabelStatus type='warning' >Rejected</LabelStatus>;
      default:
        return <LabelStatus type='default' >Unknown Status</LabelStatus>;
    }
  }
  return (
    <div>
      <h1 className="dashboard-heading">Manage post</h1>
      <div className="mb-10 flex justify-end">
        <div className="w-full max-w-[300px]">
          <input
            type="text"
            className="w-full p-4 rounded-lg border border-solid border-gray-300"
            placeholder="Search post..."
          />
        </div>
      </div>
      <div className='p-3 border border-green-500 rounded-md mb-2'>
        <input className="text-green-400 font-medium w-full" type='text' placeholder='Type Post name...'
          onChange={handleFilter}
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Post</th>
            <th>Category</th>
            <th>Status</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          { posts.length > 0 && posts.map((item) => {
            return <tr key={item.id}>
              <td>
                <span title={item.id}>{item.id.slice(0, 4) + '...'}</span>
              </td>
              <td>
                <div className="flex items-center gap-x-3 w-[260px]">
                  <img
                    src={item?.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80"}
                    alt={item?.image || ''}
                    className="w-[66px] h-[55px] rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 title={item?.title} className="font-semibold max-w-[220px] text-ellipsis whitespace-nowrap overflow-hidden">
                      {item?.title || 'One Special 4K Camera'}
                    </h3>
                    <time className="text-sm text-gray-500">
                      Date: {item?.createdAt}
                    </time>
                  </div>
                </div>
              </td>
              <td className="max-w-[160px] text-ellipsis overflow-hidden">
                <span title={item?.category?.name} className="text-gray-500 whitespace-nowrap">{item?.category?.name}</span>
              </td>
              <td>
                {renderStatus(Number(item.status))}
              </td>
              <td className="max-w-[190px] text-ellipsis overflow-hidden">
                <span title={item?.user?.fullname} className="text-gray-500">{item?.user?.fullname}</span>
              </td>
              <td>
                <div className="flex items-center gap-x-3 text-gray-500">
                  <ActionView onClick={() => navigate(`/${item.slug}`)}></ActionView>
                  <ActionEdit onClick={() => navigate(`/manage/update-post?id=${item.id}`)}></ActionEdit>
                  <ActionDelete onClick={() => handleDeletePost(item.id)}></ActionDelete>
                </div>
              </td>
            </tr>
          })}
        </tbody>
      </Table>
      {
        total === 2 && 
        <div className="mt-3 pl-5">
          <span onClick={handleLoadMore} className="p-3 text-white font-medium rounded-sm select-none cursor-pointer bg-green-400">Load More...</span>
        </div>
      }
      {/* <div className="mt-10">
        <Pagination></Pagination>
      </div> */}
    </div>
  );
};

export default PostManage;
