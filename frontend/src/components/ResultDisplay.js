import React from 'react';

const ResultDisplay = ({ result }) => {
  const { result: status, details } = result;
  const { quantity, freshness_score, ocr, detected_items, is_perishable } = details;
  const { detections, object_counts } = detected_items;

  return (
    <div className={`result-display ${status === 'PASS' ? 'pass' : 'fail'}`}>
      <h2>Result: {status}</h2>

      <table className="result-table">
        <tbody>
          <tr>
            <th>Total Quantity</th>
            <td>{quantity}</td>
          </tr>
          <tr>
            <th>Freshness</th>
            <td>
              {is_perishable ? (
                freshness_score !== null ? `${freshness_score}` : 'N/A'
              ) : (
                <i>Freshness check skipped — not a perishable item.</i>
              )}
            </td>
          </tr>
          <tr>
            <th>Expiry Date</th>
            <td>{ocr.expiry_date}</td>
          </tr>
          <tr>
            <th>Expiry Status</th>
            <td style={{ color: ocr.color }}>{ocr.status}</td>
          </tr>
          <tr>
            <th>OCR Text</th>
            <td>{ocr.text}</td>
          </tr>
        </tbody>
      </table>

      <h3>Object Counts</h3>
      <table className="result-table">
        <thead>
          <tr>
            <th>Class</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(object_counts).map(([cls, count]) => (
            <tr key={cls}>
              <td>{cls}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Detected Items</h3>
      <table className="result-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Class</th>
            <th>Confidence</th>
            <th>Box [x1, y1, x2, y2]</th>
          </tr>
        </thead>
        <tbody>
          {detections.map((det, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{det.class}</td>
              <td>{(det.confidence * 100).toFixed(2)}%</td>
              <td>[{det.box.join(', ')}]</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultDisplay;
