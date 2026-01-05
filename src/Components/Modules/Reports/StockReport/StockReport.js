import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import DataTable from '../../../Pages/InputField/DataTable'; // Import the reusable DataTable component
import baseURL from "../../../../Url/NodeBaseURL";

const StockReport = () => {
    const [data, setData] = useState([]); // State to store table data
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch data from the API
    useEffect(() => {
        fetch(`${baseURL}/get/opening-tags-entry`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch stock entries');
                }
                return response.json();
            })
            .then((data) => {
                setData(data.result);
            })
            .catch((error) => {
                console.error('Error fetching stock entries:', error);
            });
    }, []);

    // Define columns for the table
    const columns = React.useMemo(
        () => [
            {
                Header: 'S No.',
                Cell: ({ row }) => row.index + 1, // Generate a sequential number based on the row index
            },
            {
                Header: 'Date',
                accessor: 'date',
                Cell: ({ value }) => {
                    if (!value) return "";
                    const date = new Date(value);
                    const day = String(date.getDate()).padStart(2, "0");
                    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
                    const year = date.getFullYear();
                    return `${day}-${month}-${year}`;
                }
            },
            { Header: 'Category', accessor: 'category' },
            { Header: 'Sub Category', accessor: 'sub_category' },
            { Header: 'Product Design Name', accessor: 'design_master' },
            { Header: 'Barcode', accessor: 'PCode_BarCode' },
            { Header: 'Gross Wt', accessor: 'Gross_Weight' },
            // { Header: 'Stones Wt', accessor: 'Stones_Weight' },
            // { Header: 'Wasatage%', accessor: 'Wastage_Percentage' },
            { Header: 'Net Wt', accessor: 'TotalWeight_AW' },
            { Header: 'MC', accessor: 'Making_Charges' },
            { Header: 'Rate', accessor: 'rate' },
            { Header: 'Total Amt', accessor: 'total_price' },
            { Header: 'Status', accessor: 'Status' },
            {
                Header: "Barcode",
                Cell: ({ row }) =>
                    <a
                        href={`${baseURL}/invoices/${row.original.PCode_BarCode}.pdf`} // Fetch from backend
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                    >
                        📝 View
                    </a>
            },
        ],
        []
    );

    return (
        <div className="main-container">
            <div className="sales-table-container">
                <Row className="mb-3">
                    <Col className="d-flex justify-content-between align-items-center">
                        <h3>Stock Report</h3>
                    </Col>
                </Row>
                    <DataTable columns={columns} data={[...data].reverse()} /> 
            </div>
        </div>
    );
};

export default StockReport;
