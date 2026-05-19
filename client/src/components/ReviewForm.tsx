interface Props {
  onSubmit: (jobDescription: string, resume: string) => void;
  loading: boolean;
}

const ReviewForm = ({ onSubmit, loading }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent page reload on form submit

    // read values directly from the form elements
    const form = e.currentTarget;
    const jobDescription = (form.elements.namedItem('jobDescription') as HTMLTextAreaElement).value;
    const resume = (form.elements.namedItem('resume') as HTMLTextAreaElement).value;

    onSubmit(jobDescription, resume);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="jobDescription" style={{ fontWeight: 500, fontSize: '14px' }}>
          Job description
        </label>
        <textarea
          id="jobDescription"
          name="jobDescription"
          rows={6}
          placeholder="Paste the job description here..."
          required
          style={textareaStyle}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="resume" style={{ fontWeight: 500, fontSize: '14px' }}>
          Your resume
        </label>
        <textarea
          id="resume"
          name="resume"
          rows={10}
          placeholder="Paste your resume text here..."
          required
          style={textareaStyle}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle(loading)}
      >
        {loading ? 'Analysing...' : 'Analyse resume'}
      </button>

    </form>
  );
};

// styles kept outside the component so they don't get recreated on every render
const textareaStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '14px',
  resize: 'vertical', 
  fontFamily: 'system-ui',
};

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: loading ? '#aaa' : '#111',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 500,
  cursor: loading ? 'not-allowed' : 'pointer',
});

export default ReviewForm;