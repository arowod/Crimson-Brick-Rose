import React from "react";
import SingleApplication from "./SingleApplication";
import useApplications from "./hooks/useApplication";
import styles from "./Applications.module.css";
import { Button } from "./ui/Button/Button";

const Applications = () => {
  const {
    applications,
    loading,
    hasMore,
    error,
    loadMore,
    retry,
    lastFailedPage,
  } = useApplications();

  const getRetryButtonText = () => {
    if (loading) return "Retrying...";
    if (lastFailedPage && applications.length > 0) {
      return "Retry Load More";
    }
    return "Try Again";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString().replace(/\//g, "-");
  };

  return (
    <div className={styles.Applications}>
      {applications.length === 0 && !loading && !error ? (
        <div className={styles.noData}>No applications found</div>
      ) : (
        <>
          {loading && applications.length === 0 && (
            <div className={styles.loading}>Loading applications...</div>
          )}
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

          {error && (
            <div className={styles.error}>
              <div className={styles.errorMessage}>
                Error loading applications: {error}
              </div>
              <Button
                className={styles.retryButton}
                onClick={retry}
                disabled={loading}
              >
                {getRetryButtonText()}
              </Button>
            </div>
          )}

          {hasMore && !error && (
            <div className={styles.loadMoreContainer}>
              <Button
                className={styles.loadMoreButton}
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications;
