import React, {useState, useEffect} from 'react'
import {LuPlus} from 'react-icons/lu'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import SummaryCard from '../../components/Cards/SummaryCard'
import moment from 'moment'
import { CARD_BG } from '../../utils/data'
import { FaMonument } from 'react-icons/fa'
import Modal from '../../components/Modal'
import CreateSessionForm from './CreateSessionForm'
import DeleteAlertContent from '../../components/DeleteAlertContent'

const Dashboard = () => {
  const navagate = useNavigate()

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false)
  const [sessions, setSessions] = useState([])

  const [openDeleteAlert, setOpenDeleteAlert] = useState<{ open: boolean; data: string | null;}>({
    open: false,
    data: "",
  });
  
  const fetchAllSessions = async () => {
    try {
      
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  }

  const deleteSession = async (sessionData: any) => {
    try {
      
      const response = await axiosInstance.delete(API_PATHS.SESSION.DELETE_BY_ID(sessionData?._id));
      
      if (response.data) {
        toast.success("Session deleted successfully");
        setOpenDeleteAlert({ open: false, data: null });
        fetchAllSessions();
      } else {
        toast.error("Failed to delete session");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("An error occurred while deleting the session");
    }
  }

  useEffect(() => {
    fetchAllSessions();
  }, []);


  return (
    <DashboardLayout>
      <div className='container mx-auto px-4 pb-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-6'>
          {sessions?.map((data: any, index: number) => (
            <SummaryCard
              key={data?._id}
              colors={CARD_BG[index % CARD_BG.length]}
              role={data?.role || ""}
              topicToFocus={data?.topicToFocus || ""}
              experience={data?.experience || "-"}
              questions={data?.questions?.length || "-"}
              description={data?.description || ""}
              lastUpdated={
                data?.updatedAt 
                ? moment(data?.updatedAt).format("MMM Do YYYY, h:mm A")
                : ""
              }
              onSelect={() => {
                navagate(`/interview-prep/${data?._id}`)
              }}
              onDelete={() => {
                setOpenDeleteAlert({
                  open: true,
                  data
                });
              }}
              
            />
          ))}

          <button
            className='h-12 md:h-12 flex items-center justify-center gap-3 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold px-7 py-2.5 rounded-full fixed bottom-10 md:bottom-20 right-10 md:right-20'
            onClick={() => setOpenCreateModal(true)}
          >
            <LuPlus className='' />

            Add New
          </button>

        </div>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div>
          <CreateSessionForm/>
        </div>
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title='Delete Session'
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content='Are you sure you want to delete this session?'
            onDelete={() => deleteSession(openDeleteAlert?.data)}
          />
        </div>

      </Modal>
    </DashboardLayout>
  )
}

export default Dashboard