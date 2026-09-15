import { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getInsights, deleteInsight } from "../../services/insightService";
import styles from "../styles/ManageInsights.module.css";

export default function ManageInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const res = await getInsights({ page, limit: 10, status: "all" });
      if (res.success) {
        setInsights(res.data || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages);
        }
      }
    } catch (err) {
      console.error("Failed to load insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [page]);

  const confirmDelete = (id) => {
    setDeletingId(id);
  };

  const handleExecuteDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteInsight(deletingId);
      setDeletingId(null);
      loadInsights();
    } catch (err) {
      alert("Failed to delete insight.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1>Insights Management</h1>
            <p>Publish and manage corporate insights, announcements, and news.</p>
          </div>
          <Link to="/admin/insights/create" className={styles.createBtn}>
            <FaPlus /> Create Insight
          </Link>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className={styles.message}>Loading insights...</td>
                </tr>
              ) : insights.length === 0 ? (
                <tr>
                  <td colSpan="5" className={styles.message}>No insights found. Click "Create Insight" to publish one.</td>
                </tr>
              ) : (
                insights.map((item) => (
                  <tr key={item._id}>
                    <td className={styles.titleCell}>{item.title}</td>
                    <td>
                      <div className={styles.companyBadge}>
                        {item.company?.logo?.url && (
                          <img
                            src={item.company.logo.url}
                            alt={item.company.name}
                            className={item.company.name === "Connect2Air" ? styles.companyLogoLarge : styles.companyLogo}
                          />
                        )}
                        {item.company?.name !== "Connect2Air" && (
                          <span>{item.company?.name || "—"}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={styles.typeBadge}>{item.type}</span>
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td>
                      <div className={styles.actions}>
                        <Link to={`/admin/insights/edit/${item._id}`} className={styles.editBtn} title="Edit">
                          <FaEdit />
                        </Link>
                        <button className={styles.deleteBtn} onClick={() => confirmDelete(item._id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this insight? This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeletingId(null)}>
                Cancel
              </button>
              <button className={styles.confirmDeleteBtn} onClick={handleExecuteDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
