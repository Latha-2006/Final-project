const API = "/api";

// ✅ GET DONORS
export const getDonors = async () => {
  const res = await fetch(`${API}/donors`);
  return res.json();
};

// ✅ ADD DONOR
export const addDonor = async (data: any) => {
  const res = await fetch(`${API}/donors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// ✅ GET BLOOD REQUESTS (THIS WAS MISSING)
export const getRequests = async () => {
  const res = await fetch(`${API}/requests`);
  return res.json();
};