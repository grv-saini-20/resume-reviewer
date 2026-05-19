import useReview from './hooks/useReview';
import ReviewForm from './components/ReviewForm';
import ReviewResultCard from './components/ReviewResult';

const App = () => {
  const { result, loading, error, analyse } = useReview();

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '0.25rem' }}>
        AI resume reviewer
      </h1>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '2rem' }}>
        Paste a job description and your resume to get structured AI feedback
      </p>

      <ReviewForm onSubmit={analyse} loading={loading} />

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {loading && (
        <p style={{ marginTop: '1.5rem', color: '#888', fontSize: '14px' }}>
          Analysing your resume...
        </p>
      )}

      {result && !loading && (
        <div style={{ marginTop: '2rem' }}>
          <ReviewResultCard result={result} />
        </div>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  maxWidth: '680px',
  margin: '0 auto',
  padding: '2rem 1rem',
};

const errorStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '10px 14px',
  background: '#fdecea',
  border: '1px solid #f5c6cb',
  borderRadius: '8px',
  color: '#c0392b',
  fontSize: '14px',
};

export default App;