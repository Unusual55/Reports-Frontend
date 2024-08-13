import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/en-gb';
import { checkNameEmpty, checkNameLength, checkTimeLogic } from '../Utils/formValidations';
import { VALID, DATE, STARTHOUR, EMPLOYEENAME, ENDHOUR, COMMENTS } from '../constants';
import ConfirmationModal from './ConfirmationModal';
import { submitButtonStyle, closeButtonStyle } from '../CommonStyles';



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

dayjs.extend(utc)
dayjs.extend(timezone);


export default function EditModal({ open, handleClose, submitDataToMenu, data }) {

    const [tempData, setTempData] = React.useState({
        number: data.number,
        employeeName: data.employeeName,
        date: dayjs(data.date),
        startHour: dayjs(data.startHour).tz('UTC'),
        endHour: dayjs(data.endHour).tz('UTC'),
        comments: data.comments
    });
    const [errors, setErrors] = React.useState({
        "employeeName": '',
        "date": '',
        'startHour': '',
        'endHour': ''
    })
    const [confirmationModalStatus, setConfirmationModalStatus] = React.useState(false);
    const [cancelConfirmationModalStatus, setCancelConfirmationModalStatus] = React.useState(false);

    function closeConfirmationModal() {
        setConfirmationModalStatus(false);
    }

    function closeCancelConfirmationModal() {
        setCancelConfirmationModalStatus(false);
    }

    // This function will update the temporal data state
    function updateTempData(value, name) {
        //check if the date or times is invalid, and if it is don't update the state - in that case any attempt to mess the date will not work
        if (name == DATE || name === STARTHOUR || name === ENDHOUR) {
            if (!dayjs(value).isValid()) {
                return;
            }
        }
        if (name === STARTHOUR || name === ENDHOUR) {
            // Convert to the UTC (Neutral) timezone so it won't change the time to asia/jerusalem and mess up the whole time system.
            value = dayjs(value).tz('UTC');
        }

        setTempData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function submit() {
        let validInputs = true;//Assume the inputs are always valid and then try to refute it
        const emptyName = checkNameEmpty(tempData.employeeName);
        const longName = checkNameLength(tempData.employeeName);
        const logicalTime = checkTimeLogic(tempData.startHour, tempData.endHour);
        let nameError = '';
        if (emptyName === VALID) {//if it's not empty, alert the user the length of the name is too long
            nameError = longName;
        }
        else {
            //if it arrives here, then longName doesn't matter since the input is empty
            //in case both of them are valid, it will still work and can remove previous errors from the state
            nameError = emptyName;
        }
        setErrors(prev => ({
            ...prev,
            employeeName: nameError,
            startHour: logicalTime
        }))
        if (nameError != VALID || logicalTime != VALID) {//if the input is valid
            validInputs = false;//one of the inputs is invalid
        }
        else if (nameError == VALID && logicalTime == VALID) {//both inputs are valid and there are no errors
            submitDataToMenu(tempData, setErrors, handleClose);
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} locale="en-gb">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Report Form
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        In this form you can update a report.
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
                            onChange={(e) => updateTempData(e.target.value, e.target.name)}
                            value={tempData.employeeName}
                            inputProps={{ maxLength: 50 }}
                        />
                        {(errors[EMPLOYEENAME] != '' &&
                            <Typography color="red">{errors[EMPLOYEENAME]}</Typography>)}
                        <DatePicker
                            label="Work date"
                            name={DATE}
                            value={tempData.date}
                            onChange={(newValue) => updateTempData(newValue, DATE)}
                            error={(errors[DATE] != '')}
                            helperText={errors[DATE]}
                        />
                        {(errors[DATE] != '' &&
                            <Typography color="red">{errors[DATE]}</Typography>)}
                        <TimePicker
                            label="Start hour"
                            value={dayjs(tempData.startHour).tz('Asia/Jerusalem')}
                            name={STARTHOUR}
                            onChange={(newValue) => updateTempData(newValue, STARTHOUR)}
                            error={(errors[STARTHOUR] != '')}
                            helperText={errors[STARTHOUR]}
                        />
                        {(errors[STARTHOUR] != '' &&
                            <Typography color="red">{errors[STARTHOUR]}</Typography>)}
                        <TimePicker
                            label="End hour"
                            value={dayjs(tempData.endHour).tz('Asia/Jerusalem')}
                            name={ENDHOUR}
                            onChange={(newValue) => updateTempData(newValue, ENDHOUR)}
                        />
                        {(errors[ENDHOUR] != '' &&
                            <Typography color="red">{errors[ENDHOUR]}</Typography>)}
                        <TextField
                            id="outlined-multiline-static"
                            label="Comments"
                            name={COMMENTS}
                            multiline
                            rows={6}
                            value={tempData.comments}
                            onChange={(e) => updateTempData(e.target.value, COMMENTS)}
                        />
                    </Box>
                    <br />
                    <br />
                    <div className='form-buttons'>
                        <Button variant="contained" sx={submitButtonStyle} onClick={() => setConfirmationModalStatus(true)}>Submit</Button>
                        <Button variant="contained" sx={closeButtonStyle} onClick={() => setCancelConfirmationModalStatus(true)}>Close</Button>
                    </div>
                    {cancelConfirmationModalStatus && <ConfirmationModal modalStatus={cancelConfirmationModalStatus} handleModalStatus={closeCancelConfirmationModal} message={"Are you sure you want to close this form?"} action={handleClose} />}
                    {confirmationModalStatus && <ConfirmationModal modalStatus={confirmationModalStatus} handleModalStatus={closeConfirmationModal} message={"Are you sure you want to update this report?"} action={submit} />}
                </Box>
            </Modal>
        </LocalizationProvider>
    );
}