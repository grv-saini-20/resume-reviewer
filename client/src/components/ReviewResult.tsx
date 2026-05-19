import type { ReviewResult } from '../hooks/useReview';

interface Props {
  result: ReviewResult;
}

const ReviewResultCard = ({ result }: Props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* score */}
      <div style={cardStyle}>
        <p style={labelStyle}>Match score</p>
        <p style={{ fontSize: '42px', fontWeight: 700, color: scoreColor(result.score) }}>
          {result.score}<span style={{ fontSize: '20px', color: '#888' }}>/100</span>
        </p>
      </div>

      {/* strengths */}
      <div style={cardStyle}>
        <p style={labelStyle}>Strengths</p>
        <ul style={listStyle}>
          {result.strengths.map((item, i) => (
            <li key={i} style={listItemStyle}>✓ {item}</li>
          ))}
        </ul>
      </div>

      {/* gaps */}
      <div style={cardStyle}>
        <p style={labelStyle}>Gaps</p>
        <ul style={listStyle}>
          {result.gaps.map((item, i) => (
            <li key={i} style={{ ...listItemStyle, color: '#c0392b' }}>✗ {item}</li>
          ))}
        </ul>
      </div>

      {/* suggestions */}
      <div style={cardStyle}>
        <p style={labelStyle}>Suggestions</p>
        <ol style={{ ...listStyle, paddingLeft: '1.2rem' }}>
          {result.suggestions.map((item, i) => (
            <li key={i} style={{ ...listItemStyle, marginBottom: '6px' }}>{item}</li>
          ))}
        </ol>
      </div>

    </div>
  );
};

// return green/amber/red depending on score range
const scoreColor = (score: number) => {
  if (score >= 70) return '#27ae60';
  if (score >= 40) return '#e67e22';
  return '#c0392b';
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #eee',
  borderRadius: '10px',
  padding: '1rem 1.25rem',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '8px',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const listItemStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: '#2d6a2d',
};

export default ReviewResultCard;