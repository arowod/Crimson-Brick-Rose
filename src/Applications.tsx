import React from "react";
import SingleApplication from "./SingleApplication";
import useApplications from "./hooks/useApplication";
import styles from "./Applications.module.css";

const Applications = () => {
  const { applications, loading, hasMore, error, loadMore } = useApplications();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString().replace(/\//g, "-");
  };

  if (error) {
    return (
      <div className={styles.Applications}>
        <div className={styles.error}>Error loading applications: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.Applications}>
      {applications.length === 0 && !loading ? (
        <div>No applications found</div>
      ) : (
        <>
          {loading && applications.length === 0 && (
            <div className={styles.loading}>Loading applications...</div>
          )}
          <div>
            {applications.map((application) => (
              <SingleApplication
                key={application.id}
                application={{
                  ...application,
                  date_created: formatDate(application.date_created),
                  expiry_date: formatDate(application.expiry_date),
                }}
              />
            ))}
          </div>

          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                className={styles.loadMoreButton}
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications;
