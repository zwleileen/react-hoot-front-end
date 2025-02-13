const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/hoots`;

// src/services/hootService.js

async function index() {
  try {
    const res = await fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
    return res.json();
  } catch (error) {
    console.log(error);
  }
}

export { index };
