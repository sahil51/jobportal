export default function JobCard({ job, onEdit, onDelete, onDuplicate }) {
  if (!job) return null;

  const backendUrl = "http://127.0.0.1:8000";
  const profilePicture = job.profile_picture;
  const imageUrl =
    typeof profilePicture === "string" && profilePicture
      ? profilePicture.startsWith("http")
        ? profilePicture
        : `${backendUrl}/${profilePicture.replace(/^\/+/, "")}`
      : null;

  const statusValues = Array.isArray(job.status)
    ? job.status
    : job.status
      ? [job.status]
      : [];
  const categoryValues = Array.isArray(job.category)
    ? job.category
    : job.category
      ? [job.category]
      : [];
  const location = [job.city, job.state].filter(Boolean).join(", ");

  return (
    <article className="simple-card">
      <div className="card-image-box">
        {imageUrl ? (
          <img src={imageUrl} alt={job.title || "Job"} className="card-img" />
        ) : (
          <div className="img-placeholder" aria-label="No image">
            {job.title ? job.title.charAt(0).toUpperCase() : "J"}
          </div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-job-title">{job.title || "Untitled job"}</h3>

        {location && <p className="card-meta">{location}</p>}
        {job.address && <p className="card-meta">{job.address}</p>}
        {job.description && <p className="card-desc">{job.description}</p>}

        {(statusValues.length > 0 || categoryValues.length > 0) && (
          <div className="tags-container" style={{ marginTop: '8px' }}>
            {statusValues.map((value) => (
              <span className="tag-chip active" key={`status-${value}`}>
                {value}
              </span>
            ))}
            {categoryValues.map((value) => (
              <span className="tag-chip" key={`category-${value}`}>
                {value}
              </span>
            ))}
          </div>
        )}
      </div>

<<<<<<< Updated upstream
        <div className="card-actions">
          {onEdit && (
            <button type="button" onClick={() => onEdit(job)}>
              Edit
            </button>
          )}
          {onDuplicate && (
            <button type="button" onClick={() => onDuplicate(job.id)}>
              Duplicate
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={() => onDelete(job.id, job.title)}>
              Delete
            </button>
          )}
        </div>
=======
      <div className="card-buttons">
        {onEdit && (
          <button type="button" className="btn-small" onClick={() => onEdit(job)}>
            Edit
          </button>
        )}
        {onDuplicate && (
          <button type="button" className="btn-small" onClick={() => onDuplicate(job.id)}>
            Duplicate
          </button>
        )}
        {onDelete && (
          <button type="button" className="btn-small btn-del" onClick={() => onDelete(job.id, job.title)}>
            Delete
          </button>
        )}
>>>>>>> Stashed changes
      </div>
    </article>
  );
}