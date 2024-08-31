import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MarketData = () => {
    const [dax1DayDurationData, setDax1DayDurationData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://lstm-server1.onrender.com/getDax1DayDurationEF2Data'); // Update this URL to match your new endpoint
                setDax1DayDurationData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleShowModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    // Prepare data for the chart
    const chartData = {
        labels: dax1DayDurationData.map(item => item.crashEndDay), // X-axis labels (Crash End Day)
        datasets: [
            {
                label: 'Crash Duration',
                data: dax1DayDurationData.map(item => item.crashDuration), // Y-axis data (Crash Size)
                borderColor: 'rgba(0, 0, 0, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Crash End Day',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Crash duration',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="container">
            <h1 className="my-4">Market Crash Detection Predictive System</h1>

            {/* Line Chart for Crash Size */}
            <div className="mt-4">
                <h2>Crash duration Over Time</h2>
                <Line data={chartData} options={chartOptions} />
            </div>

            <div className="mt-4">
                <h2>DAX 1 Day Duration Data</h2>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Crash End Day</th>
                            <th>Crash Duration</th>
                            <th>Crash Size</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dax1DayDurationData.map(item => (
                            <tr key={item._id}>
                                <td>{item.crashEndRow}</td>
                                <td>{item.crashEndDay}</td>
                                <td>{item.crashDuration}</td>
                                <td>{item.crashSize}</td>
                                <td>
                                    <Button variant="primary" onClick={() => handleShowModal(item)}>
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <div>
                            <p><strong>No:</strong> {selectedItem.crashEndRow}</p>
                            <p><strong>Crash End Day:</strong> {selectedItem.crashEndDay}</p>
                            <p><strong>Crash Duration:</strong> {selectedItem.crashDuration}</p>
                            <p><strong>Crash Size:</strong> {selectedItem.crashSize}</p>
                            <p><strong>Duration Error (m=1):</strong> {selectedItem.durationError_m_1_}</p>
                            <p><strong>Predicted Duration (m=1):</strong> {selectedItem.predictedDuration_m_1_}</p>
                            <p><strong>Target Duration (m=1):</strong> {selectedItem.targetDuration_m_1_}</p>
                            <p><strong>Size Error (m=1):</strong> {selectedItem.sizeError_m_1_}</p>
                            <p><strong>Predicted Size (m=1):</strong> {selectedItem.predictedSize_m_1_}</p>
                            <p><strong>Target Size (m=1):</strong> {selectedItem.targetSize_m_1_}</p>
                            {/* Add more fields as needed */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MarketData;
