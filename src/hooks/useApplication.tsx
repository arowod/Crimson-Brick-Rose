import { useState, useEffect } from "react";

const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const ITEMS_PER_PAGE = 5;

  const parseLinkHeader = (linkHeader: string): { [key: string]: string } => {
    if (!linkHeader) return {};

    const links: { [key: string]: string } = {};
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

  const fetchApplications = async (page = 1, append = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/applications?_page=${page}&_limit=${ITEMS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const linkHeader = response.headers.get("Link");
      const links = parseLinkHeader(linkHeader);

      setHasMore(!!links.next);

      if (append) {
        setApplications((prevApplications) => [...prevApplications, ...data]);
      } else {
        setApplications(data);
      }
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
    fetchApplications(nextPage, true);
  };

  useEffect(() => {
    fetchApplications(1, false);
  }, []);

  return {
    applications,
    loading,
    hasMore,
    error,
    loadMore,
  };
};

export default useApplications;
