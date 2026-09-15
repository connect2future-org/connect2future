import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCompanies } from "../../services/companyService";
import { createInsight, updateInsight, getInsightById } from "../../services/insightService";
import { getCroppedImg } from "../utils/cropImage";
import styles from "../styles/CreateInsight.module.css";

const POST_TYPES = ["Insight", "Announcement", "Story", "News"];

const FORMAT_OPTIONS = [
  {
    id: "landscape",
    name: "Landscape",
    ratio: "16:9",
    aspect: 16 / 9,
    width: "44px",
    height: "25px",
  },
  {
    id: "portrait",
    name: "Portrait",
    ratio: "4:5",
    aspect: 4 / 5,
    width: "28px",
    height: "35px",
  },
  {
    id: "square",
    name: "Square",
    ratio: "1:1",
    aspect: 1 / 1,
    width: "32px",
    height: "32px",
  },
];

export default function CreateInsight() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [type, setType] = useState("Insight");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [hashtags, setHashtags] = useState("");

  // Image & Crop State
  const [selectedFormat, setSelectedFormat] = useState("landscape");
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [croppedImagePreview, setCroppedImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const currentFormatObj = FORMAT_OPTIONS.find((f) => f.id === selectedFormat) || FORMAT_OPTIONS[0];

  // Load companies & existing insight data if edit mode
  useEffect(() => {
    const initData = async () => {
      try {
        const compRes = await getCompanies();
        let loadedCompanies = [];
        if (compRes.success && compRes.data) {
          loadedCompanies = compRes.data;
          setCompanies(loadedCompanies);
        }

        if (isEditMode && id) {
          const insightRes = await getInsightById(id);
          if (insightRes.success && insightRes.data) {
            const data = insightRes.data;
            setTitle(data.title || "");
            setContent(data.content || "");
            setType(data.type || "Insight");
            setImageDescription(data.imageDescription || "");
            if (data.hashtags && Array.isArray(data.hashtags)) {
              setHashtags(data.hashtags.join(", "));
            } else if (typeof data.hashtags === "string") {
              setHashtags(data.hashtags);
            }

            if (data.image) {
              if (data.image.format) setSelectedFormat(data.image.format);
              if (data.image.url) {
                setExistingImageUrl(data.image.url);
                setCroppedImagePreview(data.image.url);
              }
            }

            if (data.company) {
              const matchedComp = loadedCompanies.find(
                (c) => c._id === (typeof data.company === "object" ? data.company._id : data.company)
              );
              if (matchedComp) {
                setSelectedCompany(matchedComp);
              } else if (typeof data.company === "object") {
                setSelectedCompany(data.company);
              }
            }
          }
        } else if (loadedCompanies.length > 0) {
          setSelectedCompany(loadedCompanies[0]);
        }
      } catch (err) {
        console.error("Failed to load initial form data:", err);
        setError("Failed to load insight details.");
      } finally {
        setFetching(false);
      }
    };
    initData();
  }, [id, isEditMode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImageSrc(reader.result);
        setIsCropping(true);
        setCroppedImagePreview(null);
        setImageFile(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!rawImageSrc || !croppedAreaPixels) return;
    try {
      const result = await getCroppedImg(rawImageSrc, croppedAreaPixels);
      if (result) {
        setCroppedImagePreview(result.fileUrl);
        const fileName = `cropped_${Date.now()}.jpg`;
        const file = new File([result.blob], fileName, { type: "image/jpeg" });
        setImageFile(file);
        setIsCropping(false);
      }
    } catch (e) {
      console.error("Error cropping image:", e);
      setError("Failed to crop image.");
    }
  };

  const handleFormatSelect = (fmtId) => {
    setSelectedFormat(fmtId);
    if (rawImageSrc) {
      setIsCropping(true);
    }
  };

  const handleRemoveImage = () => {
    setRawImageSrc(null);
    setCroppedImagePreview(null);
    setImageFile(null);
    setExistingImageUrl("");
    setIsCropping(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedCompany) {
      setError("Please select a company.");
      return;
    }

    if (!isEditMode && !imageFile && !croppedImagePreview) {
      setError("Please upload and crop an image before publishing.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("company", selectedCompany._id);
      formData.append("type", type);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("imageDescription", imageDescription);
      formData.append("hashtags", hashtags);
      formData.append("format", selectedFormat);
      formData.append("aspectRatio", currentFormatObj.ratio);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res;
      if (isEditMode) {
        res = await updateInsight(id, formData);
      } else {
        res = await createInsight(formData);
      }

      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate("/admin/insights"), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? "update" : "publish"} insight.`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.page}>
        <div className={styles.card} style={{ textAlign: "center", padding: "40px" }}>
          Loading insight data...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h1>{isEditMode ? "Edit Insight" : "Create Insight"}</h1>
            <p>{isEditMode ? "Modify existing corporate insight details." : "Publish corporate news, stories, and insights across Connect2Future."}</p>
          </div>
          <Link to="/admin/insights" className={styles.backBtn}>
            ← Back to Insights
          </Link>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Insight {isEditMode ? "updated" : "published"} successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Company Selector */}
          <div className={styles.section}>
            <label className={styles.label}>1. Select Company</label>
            <div className={styles.companyGrid}>
              {companies.map((comp) => (
                <div
                  key={comp._id}
                  className={`${styles.companyItem} ${selectedCompany?._id === comp._id ? styles.companyActive : ""}`}
                  onClick={() => setSelectedCompany(comp)}
                >
                  {comp.logo?.url && (
                    <img
                      src={comp.logo.url}
                      alt={comp.name}
                      className={comp.name === "Connect2Air" ? styles.companyLogoLarge : styles.companyLogo}
                    />
                  )}
                  {comp.name !== "Connect2Air" && (
                    <span className={styles.companyName}>{comp.name}</span>
                  )}
                </div>
              ))}
            </div>

            {selectedCompany && (
              <div className={styles.companyPreview}>
                {selectedCompany.logo?.url && (
                  <img
                    src={selectedCompany.logo.url}
                    alt={selectedCompany.name}
                    className={selectedCompany.name === "Connect2Air" ? styles.previewLogoLarge : styles.previewLogo}
                  />
                )}
                {selectedCompany.name !== "Connect2Air" && (
                  <div>
                    <div className={styles.previewName}>{selectedCompany.name}</div>
                    <div className={styles.previewTagline}>
                      {selectedCompany.tagline || "UNLOCK THE POWER OF CONNECTIVITY"}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Type */}
          <div className={styles.section}>
            <label className={styles.label}>2. Post Type</label>
            <div className={styles.typeGroup}>
              {POST_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`${styles.typeBtn} ${type === t ? styles.typeActive : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className={styles.section}>
            <label className={styles.label}>3. Insight Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              className={styles.input}
              required
            />
          </div>

          {/* Content */}
          <div className={styles.section}>
            <label className={styles.label}>4. Content / Description</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your article/announcement content..."
              className={styles.textarea}
              required
            />
          </div>

          {/* Image Upload, Format Selector & Cropper */}
          <div className={styles.section}>
            <label className={styles.label}>5. Post Image & Format Selection</label>

            {/* Upload File Input */}
            {!rawImageSrc && !croppedImagePreview && (
              <label htmlFor="fileUpload" className={styles.fileBox}>
                <input
                  id="fileUpload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
                <div>
                  <strong>Click to upload an image or poster</strong>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                    Supports JPG, PNG, WEBP. Format & cropping will be configured in the next step.
                  </div>
                </div>
              </label>
            )}

            {/* Format Selector Cards */}
            {(rawImageSrc || croppedImagePreview) && (
              <div>
                <label className={styles.label} style={{ marginBottom: "6px" }}>Select Image Format:</label>
                <div className={styles.formatGrid}>
                  {FORMAT_OPTIONS.map((fmt) => (
                    <div
                      key={fmt.id}
                      className={`${styles.formatCard} ${selectedFormat === fmt.id ? styles.formatActive : ""}`}
                      onClick={() => handleFormatSelect(fmt.id)}
                    >
                      <div className={styles.formatIconBox}>
                        <div style={{ width: fmt.width, height: fmt.height, border: "2px solid currentColor", borderRadius: "2px" }} />
                      </div>
                      <span className={styles.formatName}>{fmt.name}</span>
                      <span className={styles.formatRatio}>{fmt.ratio}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crop Editor Area */}
            {isCropping && rawImageSrc && (
              <div className={styles.cropBox}>
                <div className={styles.cropCropperWrap}>
                  <Cropper
                    image={rawImageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={currentFormatObj.aspect}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                <div className={styles.zoomControl}>
                  <span>Zoom:</span>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-label="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className={styles.zoomSlider}
                  />
                </div>

                <div className={styles.cropActions}>
                  <button type="button" className={styles.applyCropBtn} onClick={handleApplyCrop}>
                    Apply Crop ({currentFormatObj.name})
                  </button>
                </div>
              </div>
            )}

            {/* Final Cropped Image Preview */}
            {!isCropping && croppedImagePreview && (
              <div className={styles.finalPreviewBox}>
                <span className={styles.previewHeading}>How it will appear on Insights:</span>
                <div className={styles.previewFrame} style={{ aspectRatio: `${currentFormatObj.aspect}` }}>
                  <img src={croppedImagePreview} alt="Cropped Preview" className={styles.previewImg} />
                </div>

                <div className={styles.previewMetaRow}>
                  <span className={styles.formatBadge}>
                    Format: {currentFormatObj.name} ({currentFormatObj.ratio})
                  </span>
                  <div className={styles.previewBtnGroup}>
                    {rawImageSrc && (
                      <button type="button" className={styles.recropBtn} onClick={() => setIsCropping(true)}>
                        Recrop
                      </button>
                    )}
                    <button type="button" className={styles.removeImgBtn} onClick={handleRemoveImage}>
                      Replace / Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Description */}
          <div className={styles.section}>
            <label className={styles.label}>6. Image Description (Accessibility Alt Text)</label>
            <input
              type="text"
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Describe the image content..."
              className={styles.input}
            />
          </div>

          {/* Hashtags */}
          <div className={styles.section}>
            <label className={styles.label}>7. Hashtags</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="e.g. #FutureOfWork, #Technology, #Connect2Job"
              className={styles.input}
            />
          </div>

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={loading || isCropping}>
            {loading ? (isEditMode ? "Updating..." : "Publishing...") : (isEditMode ? "Update Insight" : "Publish Insight")}
          </button>
        </form>
      </div>
    </div>
  );
}
