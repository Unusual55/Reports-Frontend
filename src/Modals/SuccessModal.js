import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './form.css';
import {closeButtonStyle } from '../CommonStyles';

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

export default function SuccessModal({ modalStatus, handleModalStatus, message }) {
    return (
        <div>
            <Modal
                open={modalStatus}
                onClose={handleModalStatus}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={Modalstyle}>
                    <Typography variant="h2" sx={{ color: 'green', mb: 2 }}>
                        Success
                    </Typography>
                    <Typography>
                        {message}
                    </Typography>
                    <div className='form-buttons'>
                        <Button variant="contained" onClick={handleModalStatus} sx={closeButtonStyle}>Close</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
