import Spinner from 'react-bootstrap/Spinner';

export default function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );
}
