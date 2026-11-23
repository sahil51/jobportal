export default function JobCard({ job, onEdit, onDelete, onDuplicate }) {
  if (!job) return null;

  const backendUrl = "http://localhost:8000";
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
          <div className="card-image-placeholder" aria-label="No image">
            {job.title ? job.title.charAt(0).toUpperCase() : "J"}
          </div>
        )}
      </div>

      <div className="card-content">
        <h3>{job.title || "Untitled job"}</h3>

        {location && <p className="job-location">{location}</p>}
        {job.address && <p className="job-address">{job.address}</p>}
        {job.description && <p className="job-description">{job.description}</p>}

        {(statusValues.length > 0 || categoryValues.length > 0) && (
          <div className="job-tags">
            {statusValues.map((value) => (
              <span className="job-tag" key={`status-${value}`}>
                {value}
              </span>
            ))}
            {categoryValues.map((value) => (
              <span className="job-tag" key={`category-${value}`}>
                {value}
              </span>
            ))}
          </div>
        )}

        <div className="card-actions">
          {onEdit && (
            <button type="button" onClick={() => onEdit(job)}>
              Edit
            </button>
          )}
          {onDuplicate && (
            <button type="button" onClick={() => onDuplicate(job)}>
              Duplicate
            </button>
          )}
          {onDelete && (
            <button type="button" onClick={() => onDelete(job)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}