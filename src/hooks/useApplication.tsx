import { useState, useEffect } from "react";

const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const parseLinkHeader = (
    linkHeader: string | null
  ): Record<string, string> => {
    if (!linkHeader) return {};

    const links: Record<string, string> = {};
    const parts = linkHeader.split(",");

    parts.forEach((part) => {
      const section = part.split(";");
      if (section.length !== 2) return;

      const url = section[0].replace(/<(.*)>/, "$1").trim();
      const rel = section[1].replace(/rel="(.*)"/, "$1").trim();
      links[rel] = url;
    });

    return links;
  };

  const fetchApplications = async (page = 1, itemLimit = 5) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/applications?_page=${page}&_limit=${itemLimit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const linkHeader = response.headers.get("Link");
      const links = parseLinkHeader(linkHeader);

      setHasMore(!!links.next);
      setApplications(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchApplications(nextPage, limit);
  };

  useEffect(() => {
    fetchApplications(1, limit);
  }, [limit]);

  return {
    applications,
    loading,
    currentPage,
    limit,
    hasMore,
    error,
    loadMore,
    refetch: () => fetchApplications(currentPage, limit),
  };
};

export default useApplications;
