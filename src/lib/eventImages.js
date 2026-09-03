import saraswatiImg from "../assets/events/saraswati-puja.jpg";
import holiImg from "../assets/events/holi.png";
import poilaImg from "../assets/events/poila-boishak.png";
import picnicImg from "../assets/events/summer-picnic.png";
import durgaImg from "../assets/events/durga-puja.jpg";
import bijoyaImg from "../assets/events/bijoya-sammiloni.png";
import deepaboliImg from "../assets/events/deepaboli.png";
import newYearImg from "../assets/events/new-year.jpeg";
import fallbackImg from "../assets/events/ankur-generic.png";

// Keyword -> fixed local image. Matched against the event's name (case-insensitive),
// so this works whether "events" comes from FALLBACK_EVENTS or real Sanity content.
// More specific keywords must precede general ones (.find() returns the first match) —
// e.g. "bengali new year" before "new year".
export const EVENT_IMAGE_RULES = [
  { keyword: "saraswati", image: saraswatiImg },
  { keyword: "holi", image: holiImg },
  { keyword: "poila", image: poilaImg },
  { keyword: "boishak", image: poilaImg },
  { keyword: "bengali new year", image: poilaImg },
  { keyword: "picnic", image: picnicImg },
  { keyword: "durga", image: durgaImg },
  { keyword: "bijoya", image: bijoyaImg },
  { keyword: "deepaboli", image: deepaboliImg },
  { keyword: "diwali", image: deepaboliImg },
  { keyword: "new year", image: newYearImg },
];

export function getEventImage(name = "") {
  const lower = name.toLowerCase();
  const match = EVENT_IMAGE_RULES.find((rule) => lower.includes(rule.keyword));
  return match ? match.image : fallbackImg;
}
