function TextInputWithLabel({ ref, value, onChange, elementId, labelText }) {
    return (
      <>
          <label htmlFor={elementId}>{labelText}</label>
          <input
              ref={ref}
              type="text"
              value={value}
              onChange={onChange}
              id={elementId}
          />
      </>
    );
}

export default TextInputWithLabel;