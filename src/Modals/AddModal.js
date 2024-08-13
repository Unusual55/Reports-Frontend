import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import AddForm from '../Form/Form';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { submitButtonStyle, closeButtonStyle } from '../CommonStyles';
import ConfirmationModal from './ConfirmationModal';
import { DATE, EMPLOYEENAME, STARTHOUR, ENDHOUR, COMMENTS, VALID, OVERLAP } from '../constants';
import { checkNameEmpty, checkNameLength, checkTimeLogic } from '../Utils/formValidations';

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

dayjs.extend(utc);
dayjs.extend(timezone);

export default function AddModal({ open, handleClose, submitDataToMenu, setSuccessModalStatus, setSuccessModalMessage }) {

    const [tempData, setTempData] = React.useState([{
        employeeName: '',
        date: dayjs().startOf('day'),
        startHour: dayjs().tz('UTC'),
        endHour: dayjs().tz('UTC'),
        comments: ''
    }]);

    const [errors, setErrors] = React.useState([{
        employeeName: '',
        date: '',
        startHour: '',
        endHour: ''
    }]);
    const [confirmationModalStatus, setConfirmationModalStatus] = React.useState(false);
    const [cancelConfirmationModalStatus, setCancelConfirmationModalStatus] = React.useState(false);

    function closeConfirmationModal() {
        setConfirmationModalStatus(false);
    }

    function closeCancelConfirmationModal() {
        setCancelConfirmationModalStatus(false);
    }

    const removeForm = (i) => {
        const newTempData = tempData.filter((_, index) => index !== i);
        const newErrors = errors.filter((_, index) => index !== i);
        setTempData(newTempData);
        setErrors(newErrors);
        if (newTempData.length === 0) {
            handleClose();
        }
    }

    // This function will update the temporal data state
    function updateTempData(value, name, index) {
        if (name === DATE || name === STARTHOUR || name === ENDHOUR) {
            if (!dayjs(value).isValid()) {
                console.warn(`Invalid date: ${value}`);
                return;
            }
        }
        if (name === STARTHOUR || name === ENDHOUR) {
            // Convert to the UTC (Neutral) timezone so it won't change the time to asia/jerusalem and mess up the whole time system.
            value = dayjs(value).tz('UTC');
        }
        setTempData(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        );
    }

    // This function will submit the data and handle the error marking
    async function submit() {
        let successfullIndexes = new Set();
        let newErrors = [...errors]; // Create a copy of the current errors

        for (let i = 0; i < tempData.length; i++) {
            let validInputs = true;
            const emptyName = checkNameEmpty(tempData[i].employeeName);
            const longName = checkNameLength(tempData[i].employeeName);
            const logicalTime = checkTimeLogic(tempData[i].startHour, tempData[i].endHour);
            let nameError = '';

            if (emptyName === VALID) {
                nameError = longName;
            } else {
                nameError = emptyName;
            }

            // Update the error in the newErrors array
            newErrors[i] = {
                ...newErrors[i],
                employeeName: nameError,
                startHour: logicalTime
            };

            if (nameError !== VALID || logicalTime !== VALID) {
                validInputs = false;
                // Set the errors state once after all the updates
            } else if (nameError === VALID && logicalTime === VALID) {
                await submitDataToMenu(tempData[i], i, successfullIndexes, errors);
                if (!successfullIndexes.has(i)) {
                    newErrors[i] = {
                        ...newErrors[i],
                        startHour: OVERLAP,
                        endHour: OVERLAP
                    }
                }
                // successfullIndexes.add(i);
            }
            console.log(errors);
        }
        setErrors(newErrors);

        const newTempData = [];
        const newErrorList = [];
        for (let i = 0; i < tempData.length; i++) {
            if (!successfullIndexes.has(i)) {
                newTempData.push(tempData[i]);
                newErrorList.push(newErrors[i]);
            }
        }
        setTempData(newTempData);
        setErrors(newErrorList);


        // Handle success modal for single form
        if (successfullIndexes.size === 1 && newTempData.length === 0) {
            setSuccessModalMessage('The report was added successfully!');
            setSuccessModalStatus(true);
            closeConfirmationModal();
            handleClose();
            return;
        }
        
        // Send a message to the user about successfull indexes.
        let counter = 0;
        // the second condition will prevent the modal to open twice if not needed
        if (successfullIndexes.size > 0 && newTempData.length > 0) {
            let message = 'The following reports was added successfully: ';
            for (let idx of successfullIndexes) {
                if (counter === 0) {
                    message = message + (idx + 1);
                }
                else {
                    message = message + ", " + (idx + 1);
                }
                counter++;
            }
            setSuccessModalMessage(message);
            setSuccessModalStatus(true);
        }

        if (newTempData.length === 0) {
            setSuccessModalMessage('All of the reports was added successfully!');
            setSuccessModalStatus(true);
            handleClose();
        }
        closeConfirmationModal();
    }

    function addNewForm() {
        setTempData(prev => [
            ...prev,
            {
                employeeName: '',
                date: dayjs().startOf('day'),
                startHour: dayjs.utc().tz('Asia/Jerusalem'),
                endHour: dayjs.utc().tz('Asia/Jerusalem'),
                comments: ''
            }
        ]);

        setErrors(prev => [
            ...prev,
            {
                employeeName: '',
                date: '',
                startHour: '',
                endHour: ''
            }
        ]);
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
                    {tempData.map((data, index) => (
                        <AddForm
                            key={index}
                            index={index}
                            tempData={data}
                            errors={errors[index] || {}}
                            updateTempData={updateTempData}
                            DeleteForm={removeForm}
                        />
                    ))}
                    <IconButton aria-label="add" onClick={addNewForm}>
                        <AddIcon />
                    </IconButton>
                    <div className='form-buttons'>
                        <Button variant="contained" sx={submitButtonStyle} onClick={() => setConfirmationModalStatus(true)}>Submit</Button>
                        <Button variant="contained" sx={closeButtonStyle} onClick={() => setCancelConfirmationModalStatus(true)}>Close</Button>
                    </div>
                    {cancelConfirmationModalStatus && <ConfirmationModal modalStatus={cancelConfirmationModalStatus} handleModalStatus={closeCancelConfirmationModal} message={"Are you sure you want to close this form?"} action={handleClose} />}
                    {confirmationModalStatus && <ConfirmationModal modalStatus={confirmationModalStatus} handleModalStatus={closeConfirmationModal} message={"Are you sure you want to add this reports?"} action={submit} />}
                </Box>
            </Modal>
        </LocalizationProvider>
    );
}
