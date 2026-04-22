import { useState } from "react";

function Field({ id, label, type = "text", value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="field">
      <label className={`label ${focused ? "active" : ""}`}>
        {label}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

export default Field;