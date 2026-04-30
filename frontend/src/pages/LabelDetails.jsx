import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";
import "../styles/LabelDetails.css";

/** Chrome / Edge PDF viewer: ask for width-fit page; ignored by some hosts but harmless */
function pdfPreviewSrc(url) {
  if (!url || typeof url !== "string") return url;
  try {
    const u = new URL(url);
    if (!u.hash) {
      u.hash = "page=1&view=FitH&toolbar=0";
    }
    return u.toString();
  } catch {
    return url;
  }
}

/** Logical iframe size (PDF viewer canvas); JS scales down to fit viewport without scroll */
const PREVIEW_IFRAME_W = 840;
const PREVIEW_IFRAME_H = 980;

function LabelPdfPreview({ src }) {
  const viewportRef = useRef(null);
  const [scale, setScale] = useState(0.35);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    function compute() {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (cw < 12 || ch < 12) return;
      const s =
        Math.min(cw / PREVIEW_IFRAME_W, ch / PREVIEW_IFRAME_H, 1) * 0.995;
      setScale(s);
    }

    compute();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(compute);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={viewportRef} className="label-detail-preview-viewport">
      <div
        className="label-detail-preview-clip"
        style={{
          width: PREVIEW_IFRAME_W * scale,
          height: PREVIEW_IFRAME_H * scale,
        }}
      >
        <div
          className="label-detail-preview-inner"
          style={{
            width: PREVIEW_IFRAME_W,
            height: PREVIEW_IFRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            id="label-frame"
            src={src}
            title="Shipping label preview"
            width={PREVIEW_IFRAME_W}
            height={PREVIEW_IFRAME_H}
          />
        </div>
      </div>
    </div>
  );
}

export default function LabelDetails() {
  const { id } = useParams();
  const [label, setLabel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLabel(null);
      try {
        const res = await api.get(`/shipping-labels/${id}`);
        if (!cancelled) setLabel(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setLabel(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const iframeSrc = useMemo(
    () => (label?.label_url ? pdfPreviewSrc(label.label_url) : ""),
    [label?.label_url],
  );

  function handlePrint() {
    const iframe = document.getElementById("label-frame");
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }

  function handleSaveAsPDF() {
    if (!label?.label_url) return;
    const a = document.createElement("a");
    a.href = label.label_url;
    a.download = `${label.easypost_id ?? "label"}.pdf`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  }

  if (loading) {
    return (
      <div className="label-detail">
        <Link className="label-detail-back" to="/dashboard">
          ← Back to dashboard
        </Link>
        <p className="label-detail-loading">Loading label…</p>
      </div>
    );
  }

  if (!label) {
    return (
      <div className="label-detail">
        <Link className="label-detail-back" to="/dashboard">
          ← Back to dashboard
        </Link>
        <div className="label-detail-empty">
          <p className="label-detail-empty-title">Label not found</p>
          <p>
            This label may have been removed or the link is invalid. Return to
            your dashboard to see available labels.
          </p>
          <Link className="label-detail-btn label-detail-btn--primary" to="/dashboard">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="label-detail">
      <Link className="label-detail-back" to="/dashboard">
        ← Back to dashboard
      </Link>

      <header className="label-detail-header">
        <h1>Shipping label</h1>
        <p className="label-detail-lede">
          Preview below. Use{" "}
          <a
            className="label-detail-inline-link"
            href={label.label_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open PDF
          </a>{" "}
          if the preview is hard to read.
        </p>
        <div className="label-detail-meta">
          {label.easypost_id != null && label.easypost_id !== "" ? (
            <span className="label-detail-meta-item">
              <span className="label-detail-meta-label">EasyPost ID</span>
              <span className="label-detail-meta-value label-detail-meta-value--mono">
                {label.easypost_id}
              </span>
            </span>
          ) : null}
          {label.tracking_code ? (
            <span className="label-detail-meta-item">
              <span className="label-detail-meta-label">Tracking</span>
              <span className="label-detail-meta-value label-detail-meta-value--mono">
                {label.tracking_code}
              </span>
            </span>
          ) : null}
          {label.created_at ? (
            <span className="label-detail-meta-item">
              <span className="label-detail-meta-label">Created</span>
              <time
                className="label-detail-meta-value"
                dateTime={
                  Number.isNaN(new Date(label.created_at).getTime())
                    ? undefined
                    : new Date(label.created_at).toISOString()
                }
              >
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(label.created_at))}
              </time>
            </span>
          ) : null}
        </div>
      </header>

      <div className="label-detail-actions">
        <button
          type="button"
          className="label-detail-btn label-detail-btn--primary"
          onClick={handlePrint}
        >
          Print
        </button>
        <button
          type="button"
          className="label-detail-btn label-detail-btn--secondary"
          onClick={handleSaveAsPDF}
        >
          Download PDF
        </button>
      </div>

      <div className="label-detail-preview">
        <LabelPdfPreview src={iframeSrc} />
        <p className="label-detail-preview-footer">
          <a
            href={label.label_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open PDF in new tab
          </a>{" "}
          — full-screen viewer with zoom controls.
        </p>
      </div>
    </div>
  );
}
