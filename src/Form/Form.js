import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { DATE, STARTHOUR, EMPLOYEENAME, ENDHOUR, COMMENTS } from '../constants';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '../Modals/ConfirmationModal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxHeight: '90vh',
    overflowY: 'auto',
};


export default function AddForm({ index, tempData, errors, updateTempData, DeleteForm }) {
    
    const removeForm = () => {
        DeleteForm(index);
        closeRemoveFormModal();
    }
    const [removeFormModalStatus, setRemoveFormModalStatus] = React.useState(false);
    const openRemoveFormModal = () => setRemoveFormModalStatus(true);
    const closeRemoveFormModal = () => setRemoveFormModalStatus(false);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="en-gb">
            <>
            {removeFormModalStatus && <ConfirmationModal modalStatus={removeFormModalStatus} handleModalStatus={closeRemoveFormModal} message={'Are you sure you want to delete this form?'} action={removeForm}/>}
            <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={openRemoveFormModal}
                >
                    <DeleteIcon />
                </IconButton>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Report Form
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    In this form you can add a report.
                </Typography>

                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        required
                        id="outlined-required"
                        label="Employee name"
                        defaultValue=""
                        name={EMPLOYEENAME}
                        onChange={(e) => updateTempData(e.target.value, e.target.name, index)}
                        value={tempData.employeeName}
                        inputProps={{ maxLength: 50 }}
                    />
                    {(errors[EMPLOYEENAME] !== '' &&
                        <Typography color="red">{errors[EMPLOYEENAME]}</Typography>)}
                    <DatePicker
                        label="Work date"
                        name={DATE}
                        value={tempData.date}
                        onChange={(newValue) => updateTempData(newValue, DATE, index)}
                        error={errors[DATE] !== ''}
                        helperText={errors[DATE]}
                    />
                    {(errors[DATE] !== '' &&
                        <Typography color="red">{errors[DATE]}</Typography>)}
                    <TimePicker
                        label="Start hour"
                        value={dayjs(tempData.startHour).tz('Asia/Jerusalem')}
                        name={STARTHOUR}
                        onChange={(newValue) => updateTempData(newValue, STARTHOUR, index)}
                        error={errors[STARTHOUR] !== ''}
                        helperText={errors[STARTHOUR]}
                    />
                    {(errors[STARTHOUR] !== '' &&
                        <Typography color="red">{errors[STARTHOUR]}</Typography>)}
                    <TimePicker
                        label="End hour"
                        value={dayjs(tempData.endHour).tz('Asia/Jerusalem')}
                        name={ENDHOUR}
                        onChange={(newValue) => updateTempData(newValue, ENDHOUR, index)}
                    />
                    {(errors[ENDHOUR] !== '' &&
                        <Typography color="red">{errors[ENDHOUR]}</Typography>)}
                    <TextField
                        id="outlined-multiline-static"
                        label="Comments"
                        name={COMMENTS}
                        multiline
                        rows={6}
                        value={tempData.comments}
                        onChange={(e) => updateTempData(e.target.value, COMMENTS, index)}
                    />
                </Box>
            </>
        </LocalizationProvider>

    );
}