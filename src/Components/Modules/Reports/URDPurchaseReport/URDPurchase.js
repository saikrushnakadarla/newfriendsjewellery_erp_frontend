import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../Pages/InputField/DataTable'; // Import the reusable DataTable component
import { Button, Row, Col } from 'react-bootstrap';
import baseURL from "../../../../Url/NodeBaseURL";

const RepairsTable = () => {
  const [data, setData] = useState([]); // State to store table data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseURL}/get-purchases`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(Array.isArray(result) ? result : [result]); // Ensure the result is an array
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchData();
  }, []);

  // Columns definition for the DataTable
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sr. No.',
        Cell: ({ row }) => row.index + 1, // Generate a sequential number based on the row index
      },
      {
        Header: 'Name',
        accessor: 'account_name',
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
      },
      // {
      //   Header: 'Email',
      //   accessor: 'email',
      // },
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-GB'); // en-GB for dd/mm/yyyy format
        },
      },
      {
        Header: 'Purchase No',
        accessor: 'urdpurchase_number',
      },
      {
        Header: 'Product Name',
        accessor: 'product_name',
      },
      {
        Header: 'Metal',
        accessor: 'metal',
      },
      // {
      //   Header: 'Purity',
      //   accessor: 'purity',
      // },
      {
        Header: 'Gross Weight',
        accessor: 'gross',
      },
      {
        Header: 'Dust Weight',
        accessor: 'dust',
      },
      // {
      //   Header: 'Touch Percent',
      //   accessor: 'touch_percent',
      // },
      {
        Header: 'ML Percent',
        accessor: 'ml_percent',
      },
      {
        Header: 'Net Weight',
        accessor: 'eqt_wt',
      },
      {
        Header: 'Rate',
        accessor: 'rate',
      },
      {
        Header: 'Total Amount',
        accessor: 'total_amount',
      },
    ],
    []
  );


  return (
    <div className="main-container">
      <div className="payments-table-container">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <h3>URD Purchase Report</h3>
          </Col>
        </Row>
        {loading ? (
          <div>Loading...</div> // Show loading state while fetching
        ) : (
          <DataTable columns={columns} data={[...data].reverse()} /> // Display the table with fetched data
        )}
      </div>
    </div>
  );
};

export default RepairsTable;
