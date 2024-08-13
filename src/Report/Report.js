import React from 'react';
import './Report.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Typography from '@mui/material/Typography';
import ViewCommentsModal from '../Modals/ViewCommentsModal';
import Button from '@mui/material/Button';
import EditModal from '../Modals/EditModal';
import ConfirmationModal from '../Modals/ConfirmationModal';




dayjs.extend(utc)

export default function Report({ data, updateReport, deleteReport }) {
    const [commentsModalOpen, setCommentsModal] = React.useState(false);
    const [openEditModal, setEditModal] = React.useState(false);
    const [DeleteConfirmationModalStatus, setDeleteConfirmationModalStatus] = React.useState(false);
    const formattedDate = dayjs(data.date).tz('Asia/Jerusalem').format('YYYY-MM-DD');
    const formattedStartHour = dayjs.utc(data.startHour).tz('Asia/Jerusalem').format('HH:mm');
    const formattedEndHour = dayjs.utc(data.endHour).tz('Asia/Jerusalem').format('HH:mm');

    const closeDeleteConfirmationModal = () => {setDeleteConfirmationModalStatus(false);}
    const openDeleteConfirmationModal = () => {setDeleteConfirmationModalStatus(true);}

    const handleCommentsModalClose = () => {setCommentsModal(false);}

    const closeEditModal = ()=> {setEditModal(false);}

      function OpenEditModal(){
        setEditModal(true);
      }

      function deleteThisReport(){
        deleteReport(data);
        closeDeleteConfirmationModal();
      }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className='container'>
                <div className='buttons'>
                    <IconButton aria-label="delete" onClick={() => {openDeleteConfirmationModal()}}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="edit" onClick={() => OpenEditModal()}>
                        <EditIcon />
                    </IconButton>
                </div>
                <div className='name-container'>
                    <span className='name'>{data.employeeName}</span>
                    <span className="tooltiptext">{data.employeeName}</span>
                </div>
                <br />
                <div className='date'>
                    <Typography variant="body1" component="p">
                        <strong>Work date:</strong> {formattedDate}
                    </Typography>
                </div>
                <div className='start-hour'>
                    <Typography variant="body1" component="p">
                        <strong>Start hour:</strong> {formattedStartHour}
                    </Typography>
                </div>
                <div className='end-hour'>
                    <Typography variant="body1" component="p">
                        <strong>End hour:</strong> {formattedEndHour}
                    </Typography>
                </div>
                <div className='comments-container'>
                    <Button variant="text" onClick={()=>setCommentsModal(true)}>Comments</Button>
                    <ViewCommentsModal comments={data.comments}
                        openComments={commentsModalOpen}
                        handleCommentsModal={handleCommentsModalClose} />
                </div>
            </div>
            {(openEditModal && <EditModal open={openEditModal} handleClose={closeEditModal} submitDataToMenu={updateReport} data={data} />) }
            {DeleteConfirmationModalStatus && <ConfirmationModal modalStatus={DeleteConfirmationModalStatus} handleModalStatus={closeDeleteConfirmationModal} message={"Are you sure you want to delete this report?"} action={deleteThisReport}/>}
        </LocalizationProvider>

    )
}