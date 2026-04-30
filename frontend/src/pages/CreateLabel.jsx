import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/CreateLabel.css";

function emptyUsAddress() {
  return {
    name: "",
    street1: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  };
}

const US_STATE_RE = /^[A-Z]{2}$/;
const US_ZIP_RE = /^\d{5}(-\d{4})?$/;

function AddressFields({ description, prefix, value, onChange }) {
  const scope = prefix === "from" ? "billing" : "shipping";

  return (
    <div className="create-label-panel">
      <div className="create-label-panel-head">
        <p className="create-label-panel-note">{description}</p>
        <span className="create-label-us-badge">United States only</span>
      </div>

      <div className="create-label-fields">
        <div className="create-label-field">
          <label htmlFor={`${prefix}-name`}>Full name</label>
          <input
            id={`${prefix}-name`}
            name={`${prefix}_name`}
            autoComplete={`${scope} name`}
            placeholder="Jane Doe"
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </div>

        <div className="create-label-field">
          <label htmlFor={`${prefix}-street1`}>Street address</label>
          <input
            id={`${prefix}-street1`}
            name={`${prefix}_street1`}
            autoComplete={`${scope} street-address`}
            placeholder="417 Montgomery Street"
            value={value.street1}
            onChange={(e) => onChange({ street1: e.target.value })}
          />
        </div>

        <div className="create-label-field-row">
          <div className="create-label-field">
            <label htmlFor={`${prefix}-city`}>City</label>
            <input
              id={`${prefix}-city`}
              name={`${prefix}_city`}
              autoComplete={`${scope} address-level2`}
              placeholder="San Francisco"
              value={value.city}
              onChange={(e) => onChange({ city: e.target.value })}
            />
          </div>
          <div className="create-label-field create-label-field--state">
            <label htmlFor={`${prefix}-state`}>State</label>
            <input
              id={`${prefix}-state`}
              name={`${prefix}_state`}
              autoComplete={`${scope} address-level1`}
              placeholder="CA"
              maxLength={2}
              value={value.state}
              onChange={(e) =>
                onChange({
                  state: e.target.value.toUpperCase().replace(/[^A-Z]/g, ""),
                })
              }
            />
          </div>
          <div className="create-label-field create-label-field--zip">
            <label htmlFor={`${prefix}-zip`}>ZIP code</label>
            <input
              id={`${prefix}-zip`}
              name={`${prefix}_zip`}
              autoComplete={`${scope} postal-code`}
              placeholder="94104"
              inputMode="numeric"
              value={value.zip}
              onChange={(e) => onChange({ zip: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateLabel() {
  const navigate = useNavigate();
  const [fromAddress, setFromAddress] = useState(emptyUsAddress);
  const [toAddress, setToAddress] = useState(emptyUsAddress);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const requiredAddr = (a, label) => {
      if (
        !a.name.trim() ||
        !a.street1.trim() ||
        !a.city.trim() ||
        !a.state.trim() ||
        !a.zip.trim()
      ) {
        alert(`Please fill in all ${label} fields.`);
        return false;
      }
      if (!US_STATE_RE.test(a.state)) {
        alert(`${label}: use a 2-letter US state code (e.g. CA).`);
        return false;
      }
      if (!US_ZIP_RE.test(a.zip.trim())) {
        alert(`${label}: enter a valid US ZIP code (12345 or 12345-6789).`);
        return false;
      }
      return true;
    };

    if (!requiredAddr(fromAddress, "From address")) return;
    if (!requiredAddr(toAddress, "Destination address")) return;

    const w = Number(weight);
    const l = Number(length);
    const wi = Number(width);
    const h = Number(height);
    if (
      !Number.isFinite(w) ||
      !Number.isFinite(l) ||
      !Number.isFinite(wi) ||
      !Number.isFinite(h) ||
      w <= 0 ||
      l <= 0 ||
      wi <= 0 ||
      h <= 0
    ) {
      alert(
        "Please enter positive numbers for weight (oz) and length, width, and height (in).",
      );
      return;
    }

    try {
      await api.post("/shipping-labels", {
        from_address: {
          ...fromAddress,
          name: fromAddress.name.trim(),
          street1: fromAddress.street1.trim(),
          city: fromAddress.city.trim(),
          state: fromAddress.state.toUpperCase(),
          zip: fromAddress.zip.trim(),
          country: "US",
        },
        to_address: {
          ...toAddress,
          name: toAddress.name.trim(),
          street1: toAddress.street1.trim(),
          city: toAddress.city.trim(),
          state: toAddress.state.toUpperCase(),
          zip: toAddress.zip.trim(),
          country: "US",
        },
        weight: w,
        length: l,
        width: wi,
        height: h,
      });

      navigate("/dashboard", { state: { labelCreated: true } });
    } catch {
      alert("Could not create label. Check your data and try again.");
    }
  }

  return (
    <div className="create-label">
      <Link className="create-label-back" to="/dashboard">
        ← Back to dashboard
      </Link>

      <div className="create-label-title-block">
        <h1>Create label</h1>
        <p className="create-label-lede">
          Enter US addresses for ship-from and destination, then package weight
          and dimensions. Country is fixed to United States.
        </p>
      </div>

      <div className="create-label-card">
        <form onSubmit={handleSubmit} noValidate>
          <section className="create-label-section" aria-labelledby="from-heading">
            <h2 id="from-heading" className="create-label-section-title">
              From address
            </h2>
            <AddressFields
              description="Where the package ships from."
              prefix="from"
              value={fromAddress}
              onChange={(patch) =>
                setFromAddress((prev) => ({ ...prev, ...patch }))
              }
            />
          </section>

          <section className="create-label-section" aria-labelledby="to-heading">
            <h2 id="to-heading" className="create-label-section-title">
              Destination address
            </h2>
            <AddressFields
              description="Where the package is delivered."
              prefix="to"
              value={toAddress}
              onChange={(patch) =>
                setToAddress((prev) => ({ ...prev, ...patch }))
              }
            />
          </section>

          <section className="create-label-section" aria-labelledby="pkg-heading">
            <h2 id="pkg-heading" className="create-label-section-title">
              Package
            </h2>
            <p className="create-label-section-lede">
              Use U.S. customary shipping units: weight in{" "}
              <strong>ounces (oz)</strong>, outer length × width × height in{" "}
              <strong>inches (in)</strong>. For reference, 16 oz = 1 lb.
            </p>

            <div className="create-label-field">
              <label htmlFor="pkg-weight">Weight (ounces, oz)</label>
              <input
                id="pkg-weight"
                name="weight"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="16"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="create-label-dimensions">
              <div className="create-label-field">
                <label htmlFor="pkg-length">Length (inches, in)</label>
                <input
                  id="pkg-length"
                  name="length"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder="10"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                />
              </div>
              <div className="create-label-field">
                <label htmlFor="pkg-width">Width (inches, in)</label>
                <input
                  id="pkg-width"
                  name="width"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder="8"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div className="create-label-field">
                <label htmlFor="pkg-height">Height (inches, in)</label>
                <input
                  id="pkg-height"
                  name="height"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  placeholder="4"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
            </div>
          </section>

          <div className="create-label-actions">
            <button className="create-label-submit" type="submit">
              Create label
            </button>
            <Link className="create-label-cancel" to="/dashboard">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
