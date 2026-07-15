// src/pages/TweetDetailPreview.jsx
import { useParams } from "react-router-dom";

function TweetDetailPreview() {
  const { id } = useParams(); // reads the ":id" segment from the URL

  return <div>Tweet Detail placeholder — showing tweet ID: {id}</div>;
}

export default TweetDetailPreview;