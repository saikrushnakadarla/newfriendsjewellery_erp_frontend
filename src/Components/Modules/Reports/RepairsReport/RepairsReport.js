import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import DataTable from '../../../Pages/InputField/DataTable'; // Import the reusable DataTable component
import baseURL from "../../../../Url/NodeBaseURL";

const RepairsTable = () => {
  const [data, setData] = useState([]); // State to store table data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/get/repairs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // If the result is not an array, wrap it in an array
        setData(Array.isArray(result) ? result : [result]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  // Define columns for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sr. No.',
        Cell: ({ row }) => row.index + 1, // Generate a sequential number based on the row index
      },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-GB'); // 'en-GB' formats as dd/mm/yyyy
        },
      },
      {
        Header: 'Repair No',
        accessor: 'repair_no',
      },
      {
        Header: 'Customer Name',
        accessor: 'account_name',
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
      },
      {
        Header: 'Entry Type',
        accessor: 'entry_type',
      },
      {
        Header: 'Item Name',
        accessor: 'item',
      },            
      {
        Header: 'Metal Type',
        accessor: 'metal_type',
      },
      {
        Header: 'Purity',
        accessor: 'purity',
      },
      
      {
        Header: 'Total',
        accessor: row => row.total_amt ? row.total_amt : '0.00',
      },
      
      {
        Header: 'Status',
        accessor: 'status',
      },
    ],
    []
  );

  return (
    <div className="main-container">
      <div className="sales-table-container">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <h3>Repairs Report</h3>
          </Col>
        </Row>
        {loading ? (
          <p>Loading...</p> // Show loading message while fetching data
        ) : (
          <DataTable columns={columns} data={[...data].reverse()}/> // Render the table
        )}
      </div>
    </div>
  );
};

export default RepairsTable;
