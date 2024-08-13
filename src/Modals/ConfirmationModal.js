import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './form.css'
import { submitButtonStyle, closeButtonStyle } from '../CommonStyles';

const Modalstyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
};

export default function ConfirmationModal({ modalStatus, handleModalStatus, message, action }) {
    return (
        <div>
            <Modal
                open={modalStatus}
                onClose={handleModalStatus}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={Modalstyle}>
                    <Typography>
                        {message}
                    </Typography>
                    <br />
                    <div className='form-buttons'>
                        <Button variant="contained" onClick={action} sx={submitButtonStyle}>Confirm</Button>
                        <Button variant="contained" onClick={handleModalStatus} sx={closeButtonStyle}>Close</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}