import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { closeButtonStyle } from '../CommonStyles';


const style = {
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

export default function ViewCommentsModal({ openComments, handleCommentsModal, comments }) {
    return (
        <div>
            <Modal
                open={openComments}
                onClose={handleCommentsModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography>
                        {comments}
                    </Typography>

                    <Button variant="contained" onClick={handleCommentsModal} sx={closeButtonStyle}>Close</Button>
                </Box>
            </Modal>
        </div>
    );
}