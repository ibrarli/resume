export interface CityOption {
  label: string;
  value: string;
}

export const CITIES_DATA: CityOption[] = [
  // --- Pakistan ---
  { label: "Islamabad, Pakistan", value: "Islamabad, Pakistan" },
  { label: "Rawalpindi, Pakistan", value: "Rawalpindi, Pakistan" },
  { label: "Quetta, Pakistan", value: "Quetta, Pakistan" },
  { label: "Karachi, Pakistan", value: "Karachi, Pakistan" },
  { label: "Lahore, Pakistan", value: "Lahore, Pakistan" },
  { label: "Peshawar, Pakistan", value: "Peshawar, Pakistan" },
  { label: "Faisalabad, Pakistan", value: "Faisalabad, Pakistan" },
  { label: "Multan, Pakistan", value: "Multan, Pakistan" },
  { label: "Sialkot, Pakistan", value: "Sialkot, Pakistan" },
  { label: "Gujranwala, Pakistan", value: "Gujranwala, Pakistan" },
  { label: "Hyderabad, Pakistan", value: "Hyderabad, Pakistan" },
  { label: "Gwadar, Pakistan", value: "Gwadar, Pakistan" },

  // --- Egypt ---
  { label: "Cairo, Egypt", value: "Cairo, Egypt" },
  { label: "Alexandria, Egypt", value: "Alexandria, Egypt" },
  { label: "Giza, Egypt", value: "Giza, Egypt" },
  { label: "Sharm El-Sheikh, Egypt", value: "Sharm El-Sheikh, Egypt" },

  // --- United Arab Emirates ---
  { label: "Dubai, United Arab Emirates", value: "Dubai, United Arab Emirates" },
  { label: "Abu Dhabi, United Arab Emirates", value: "Abu Dhabi, United Arab Emirates" },
  { label: "Sharjah, United Arab Emirates", value: "Sharjah, United Arab Emirates" },

  // --- United States ---
  { label: "New York, United States", value: "New York, United States" },
  { label: "San Francisco, United States", value: "San Francisco, United States" },
  { label: "Los Angeles, United States", value: "Los Angeles, United States" },
  { label: "Chicago, United States", value: "Chicago, United States" },
  { label: "Austin, United States", value: "Austin, United States" },
  { label: "Seattle, United States", value: "Seattle, United States" },
  { label: "Boston, United States", value: "Boston, United States" },

  // --- United Kingdom ---
  { label: "London, United Kingdom", value: "London, United Kingdom" },
  { label: "Manchester, United Kingdom", value: "Manchester, United Kingdom" },
  { label: "Birmingham, United Kingdom", value: "Birmingham, United Kingdom" },
  { label: "Edinburgh, United Kingdom", value: "Edinburgh, United Kingdom" },

  // --- Germany ---
  { label: "Berlin, Germany", value: "Berlin, Germany" },
  { label: "Munich, Germany", value: "Munich, Germany" },
  { label: "Frankfurt, Germany", value: "Frankfurt, Germany" },

  // --- Canada ---
  { label: "Toronto, Canada", value: "Toronto, Canada" },
  { label: "Vancouver, Canada", value: "Vancouver, Canada" },
  { label: "Montreal, Canada", value: "Montreal, Canada" },

  // --- Australia ---
  { label: "Sydney, Australia", value: "Sydney, Australia" },
  { label: "Melbourne, Australia", value: "Melbourne, Australia" },

  // --- Saudi Arabia ---
  { label: "Riyadh, Saudi Arabia", value: "Riyadh, Saudi Arabia" },
  { label: "Jeddah, Saudi Arabia", value: "Jeddah, Saudi Arabia" },

  // --- Singapore ---
  { label: "Singapore, Singapore", value: "Singapore, Singapore" }
].sort((a, b) => a.label.localeCompare(b.label)); // Alphabetical sorting for clean UI traversal