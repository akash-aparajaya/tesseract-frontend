import "../../styles/Loader.css"; 

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export default function Loader({ fullScreen = true, message }: LoaderProps) {
  return (
    <div className={fullScreen ? "loader-overlay" : "loader-inline"}>
      <div className="loader-box">
        {/* Your custom CSS loader */}
        <div className="loader"></div>
        {message && <p className="loader-text">{message}</p>}
      </div>
    </div>
  );
}