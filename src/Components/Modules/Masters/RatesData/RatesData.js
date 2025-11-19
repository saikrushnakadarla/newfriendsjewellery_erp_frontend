import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../Pages/InputField/DataTable'; // Import the reusable DataTable component
import { Row, Col } from 'react-bootstrap';
import { format } from 'date-fns'; // Import date-fns for date formatting
import baseURL from "../../../../Url/NodeBaseURL";

const RepairsTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // State to store table data
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/get/rates`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        // Map rate_date to date before passing to DataTable
        const modifiedData = result.map(item => ({
          ...item,
          date: item.rate_date, // Rename rate_date to date
        }));

        setData(modifiedData); // Set the modified data
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'S No.',
        Cell: ({ row }) => row.index + 1, // Generate a sequential number based on the row index
      },
      {
        Header: 'Date',
        accessor: 'date', // Access the renamed date field
        Cell: ({ value }) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-GB'); // en-GB for dd/mm/yyyy format
        },
      },
      {
        Header: '16 Crt',
        accessor: 'rate_16crt',
      },
      {
        Header: '18 Crt',
        accessor: 'rate_18crt',
      },
      {
        Header: '22 Crt',
        accessor: 'rate_22crt',
      },
      {
        Header: '24 Crt',
        accessor: 'rate_24crt',
      },
      {
        Header: 'Silver',
        accessor: 'silver_rate',
      },
    ],
    []
  );

  return (
    <div className="main-container">
      <div className="sales-table-container">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <h3>Rates</h3>
          </Col>
        </Row>
        {loading ? (
          <div>Loading...</div> // Loading indicator
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </div>
  );
};

export default RepairsTable;
