import DashboardHeading from "../dashboard/DashboardHeading";
import React from "react";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/table";
import { useEffect } from "react";
import { collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-app/firebase-config";
import { useState } from "react";
import { userRole, userStatus } from "../../utils/constants";
import LabelStatus from "../../components/label/LabelStatus";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UserManage = () => {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const colRef = collection(db, 'users');
    onSnapshot(colRef, (snapshot) => {
      const listUser = [];
      snapshot.docs.forEach((doc) => {
        listUser.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setUsers(listUser);
    });

    // async function getListCategory(){
    //   const colRef = collection(db, 'users');
    //   const listUser = [];
    //   const documentSnapshots = await getDocs(colRef);
    //   documentSnapshots.forEach((doc) => {
    //     listUser.push({
    //       ...doc.data(),
    //       id: doc.id,
    //     });
    //   })
    //   setUsers(listUser);
    // };
    // getListCategory(); 
  }, []);

  const handleDeleteUser = (userId) => {
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
        const collDeleteRef = doc(db, 'users', userId);
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

  const renderStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type='success' >Active</LabelStatus>;
      case userStatus.BANNED:
        return <LabelStatus type='danger'>Banned</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type='warning' >Pending</LabelStatus>;
      default:
        return <LabelStatus type='default' >Unknown Status</LabelStatus>;
    }
  }
  const renderRole = (role) => {
    switch (role) {
      case userRole.ADMIN:
        return 'Administrator';
      case userRole.MOD:
        return 'Modarator'
      case userRole.USER:
        return 'Standard User'
      default:
        return 'Unknown Role'
    }
  }
  const userTableItem = (item, index) => {
    return (
      <tr key={index}>
        <td title={item.id}>
          {item?.id.slice(0,5) + '...'}
        </td>
        <td>
          <div className="flex justify-between items-center gap-2">
            <div className="w-10 h-10 rounded-md border-2 border-green-400 overflow-hidden">
              <img
                className="w-10 h-10 object-contain"
                src={item.avatar || 'https://i.pinimg.com/originals/5e/65/20/5e6520289b44e11a9e74363c18ce3ee1.jpg'} 
                alt={item?.image || ''}
              />
            </div>
            <div className="flex justify-center flex-col items-center">
              <span>{item.fullname}</span>
              <div className="text-right w-full text-sm text-gray-500">
                {item?.createdAt || 'Sun Jun 29 2022'}
              </div>
            </div>
          </div>
        </td>
        <td> 
          {item.username}
        </td>
        <td title={item.email}>
          {item.email.slice(-item.email.length, -10) + '...'}
        </td>
        <td>
          {renderStatus(Number(item.status))}
        </td>
        <td>
          {renderRole(Number(item?.role))}
        </td>
        <td>
          <div className="flex justify-center gap-x-1 items-center">
            {/* <ActionView></ActionView> */}
            <ActionEdit onClick={() => navigate(`/manage/update-user?id=${item.id}`)}></ActionEdit>
            <ActionDelete onClick={() => handleDeleteUser(item.id)}></ActionDelete>
          </div>
        </td>
      </tr>
    )
  }
  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className='p-3 border border-green-500 rounded-md mb-2'>
        <input className="text-green-400 font-medium w-full" type='text' placeholder='Type Username...'/>
      </div>
      <Table>
        <thead>
          <tr className="text-center">
            <td>Id</td>
            <td>Info</td> 
            <td>User Name</td>
            <td>Email</td>
            <td>Status</td>
            <td>Role</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 && users.map((item, index) => {
            return userTableItem(item, index)
          })
          }
        </tbody>
      </Table>
    </div>
  );
};

export default UserManage;
