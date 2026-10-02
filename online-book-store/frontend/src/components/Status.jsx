export const Loader = ({ text = 'Loading...' }) => <p className="status">{text}</p>;

export const ErrorMessage = ({ message }) => <p className="status status-error">{message}</p>;

export const EmptyState = ({ title, text, children }) => (
  <div className="status empty">
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {children}
  </div>
);
