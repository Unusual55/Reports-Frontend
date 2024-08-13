import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ConfirmationModal from '../Modals/ConfirmationModal';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import AddModal from '../Modals/AddModal';
import SuccessModal from '../Modals/SuccessModal';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export default function Menu({ query, updateSeachQuery, addReport }) {
    const [successModalStatus, setSuccessModalStatus] = React.useState(false);
    const [successModalMessage, setSuccessModalMessage] = React.useState('');

    const closeSuccessModal = () => { setSuccessModalStatus(false); }

    const [closeWindowModalStatus, setCloseWindowModalStatus] = React.useState(false);
    const [addModalStatus, setAddModalStatus] = React.useState(false)
    const handleSearchChange = (event) => {
        const newSearchTerm = event.target.value;
        updateSeachQuery(newSearchTerm);
    };

    const closeExitConfirmationModal = () =>{setCloseWindowModalStatus(false)}

    //will close the window when the user confirms
    const handleExitClick = () => {
        window.close();
    };

    const openAddModal = () =>{setAddModalStatus(true)};
    const closeAddModal = () => {setAddModalStatus(false);}

    return (
        <Box sx={{ flexGrow: 1 }}>
            {closeWindowModalStatus && <ConfirmationModal modalStatus={closeWindowModalStatus} handleModalStatus={closeExitConfirmationModal} message={"Are you sure you want to close this window?"} action={handleExitClick} />}
            {successModalStatus && <SuccessModal modalStatus={successModalStatus} handleModalStatus={closeSuccessModal} message={successModalMessage} />}
            {addModalStatus && <AddModal open={addModalStatus} handleClose={closeAddModal} submitDataToMenu={addReport} setSuccessModalStatus={setSuccessModalStatus} setSuccessModalMessage={setSuccessModalMessage}/>}
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                    >
                        <AddIcon onClick={openAddModal}/>
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Report controller by Ofri Tavor
                    </Typography>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={query}
                            onChange={handleSearchChange}
                        />
                    </Search>
                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="exit"
                        onClick={()=>setCloseWindowModalStatus(true)}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}