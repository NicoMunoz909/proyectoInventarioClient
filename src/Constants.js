const development = {
  url: "${URL}/",
};

const production = {
  url: "https://id-automation-inventario.onrender.com/",
};

export const config = process.env.NODE_ENV === "development" ? development : production;
