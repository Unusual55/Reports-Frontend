import React from 'react';
import './App.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import Report from './Report/Report';
import Menu from './Menu/Menu';
import { EMPLOYEENAME, DATE, STARTHOUR, ENDHOUR, NUMBER, COMMENTS } from './constants';
import SuccessModal from './Modals/SuccessModal';
import dayjs from 'dayjs';
import Pagination from '@mui/material/Pagination';
import { paginationStyle } from './CommonStyles';
import { getReportsPerPageByWidth } from './Utils/Utils';


function App() {


  // screen size will be used in order to make the number of reports per page responsive
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [itemsPerPage, setItemsPerPage] = useState(getReportsPerPageByWidth(screenWidth));
  const [data, setData] = React.useState([]);
  const [dispayData, setDisplayData] = React.useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successModalStatus, setSuccessModalStatus] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState(false);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const closeSuccessModal = () => { setSuccessModalStatus(false) };
  const openSuccessModal = () => { setSuccessModalStatus(true) };

  // used to update the width of the window when the window resizes, it will help to control
  // the number of items rendered in each page
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setItemsPerPage(getReportsPerPageByWidth(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /**
   * This function will sort the reports Ascending:
   * First it will sort by the date and then by the start hour.
   */
  function AscendingSort() {
    data.sort((a, b) => {
      const dateComparison = dayjs(new Date(a.date)).tz('Asia/Jerusalem').valueOf() - dayjs(new Date(b.date)).tz('Asia/Jerusalem').valueOf();
      if (dateComparison !== 0) return dateComparison;

      return dayjs(new Date(a.startHour)).tz('Asia/Jerusalem').valueOf() - dayjs(new Date(b.startHour)).tz('Asia/Jerusalem').valueOf();
    });
  }

  // Used to get the data from the DB
  useEffect(() => {
    fetch('http://localhost:5000/report')
      .then(response => {
        if (response.status === 404) {
          return (
            <div className="no-reports-container">
              <p className="no-reports">No Reports found</p>
            </div>
          );        }
        if (!response.ok) {// if an error occured
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {// if the data arrived successfully
        console.log('Data mounted!');//log to make sure it happened once
        setData(data);//set the new data
        setDisplayData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value - 1);
  }

  /**
   * used to update the display data whenever the real data changes
   * Will be used for pagination and filtering
   */
  useEffect(() => {
    if (!Array.isArray(data)) return; // Exit the effect if data is undefined

    const tempData = data.filter(report => report.employeeName.toLowerCase().startsWith(searchQuery.toLowerCase()));
    const pages = [];
    let curr = -1; // Initialize curr to -1

    for (let i = 0; i < tempData.length; i++) {
      if (i % itemsPerPage === 0) {
        curr++;
        pages.push([]); // Add a new empty array for the current page
      }
      pages[curr].push(tempData[i]);
    }
    setPageCount(curr + 1);
    setDisplayData(pages);
  }, [data, searchQuery, itemsPerPage]);



  //if the data did not arrived yet, show the loader
  if (loading) {
    return <div className="Loader"><CircularProgress /></div>;
  }

  if (error) {
    return <div className="App">Error: {error.message}</div>;
  }


  // This function will update a report
  async function updateReport(newData, set_errors, toggleEditModal) {
    console.log(newData);
    const url = 'http://localhost:5000/report';
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      const status = response.status;

      if (status === 409) {// if the report overlaps with another report
        const message = await response.json();
        console.log(message);
        set_errors((prev) => {
          return {
            ...prev,
            startHour: message.message,
            endHour: message.message
          }
        })
      }
      else if (!response.ok) {
        console.log(newData);
      }
      else {
        setData(prev => {
          const new_Data = prev.map(item => {
            if (item[NUMBER] === newData[NUMBER]) {
              return {
                ...item,
                [EMPLOYEENAME]: newData[EMPLOYEENAME],
                [DATE]: newData[DATE],
                [STARTHOUR]: newData[STARTHOUR],
                [ENDHOUR]: newData[ENDHOUR],
                [COMMENTS]: newData[COMMENTS],
              };
            }
            return item;
          });

          return new_Data;
        });
        toggleEditModal(false);
        setSuccessModalMessage('You updated the report successfully!');
        openSuccessModal()
      }
    }
    catch (error) {
      alert("Error: ", error)
    }
  }


  // This function will add a report
  async function AddReport(newData, index, indexes) {
    console.log(newData);
    const url = 'http://localhost:5000/report';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      const status = response.status;
      if (status === 409) {// if the report overlaps with another report
        const message = await response.json();
        console.log(message);     
      }
      else if (!response.ok) {
        console.log(newData);
      }
      else {
        const item = await response.json();
        setData(prev => [...prev, item]);
        indexes.add(index);//If the index is not added, than the input overlapped with another report
      }
    }
    catch (error) {
      alert("Error: ", error)
    }
  }

  async function DeleteReport(report) {
    const url = 'http://localhost:5000/report';
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
      //remove the deleted report from the state
      const newData = data.filter(rep => rep.number != report.number);
      setData(newData);
    }
    catch (error) {
      alert(error);
    }
  }

  // Used to sort the data displayed
  if (data.length > 0) {
    AscendingSort();
  }

  return (
    <div className="App">
      {successModalStatus && <SuccessModal modalStatus={successModalStatus} handleModalStatus={closeSuccessModal} message={successModalMessage} />}
      <div className='upper-menu'>
        <Menu query={searchQuery} updateSeachQuery={setSearchQuery} addReport={AddReport} />
      </div>
      <div className='main-container'>
        <div className='cards-container'>
          {dispayData[page] && dispayData[page].length > 0 ? (dispayData[page].map(report => (<Report data={report} updateReport={updateReport} deleteReport={DeleteReport} />)))
            :   <div className="no-reports-container">
            <p className="no-reports">No Reports found</p>
          </div>}
        </div>
        <div className='filter-container'>
        </div>
      </div>
      <footer class="footer">
        {Array.isArray(data) && dispayData.length > 0 && <Pagination count={pageCount} onChange={handlePageChange} size="large" sx={paginationStyle} />}
      </footer>
    </div>
  );
}

export default App;
