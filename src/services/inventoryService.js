import { config } from "./apiClient";
const URL = config.url;

const inventoryService = {

  // Fetch all inventory items
  async getAll(filters = {}, attributes=[], matchTypes = {}) {
    try {
      const queryParams = {
        ...filters,
        attributes,
        matchTypes: JSON.stringify(matchTypes)
      }
      const queryString = new URLSearchParams(queryParams).toString();
      const response =  await fetch(`${URL}/inventario${queryString ? `?${queryString}` : ''}`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('AppInventarioToken')}`},
        credentials: "include"
      });
      const newAccessToken = response.headers.get('Authorization');
      if (newAccessToken) localStorage.setItem("AppInventarioToken", newAccessToken);
      return response.json();
    } catch (error) {
      return error
    }
  },

  // Register new items (entries)
  async createEntry(items) {
    try {
      const response = await fetch(`${URL}/inventario`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('AppInventarioToken')}`       
         },
        credentials: "include",
        body: JSON.stringify(items)
      })
      const newAccessToken = response.headers.get('Authorization');
      if (newAccessToken) localStorage.setItem("AppInventarioToken", newAccessToken);
      return response.json();
    } catch (error) {
      return error
    }
  },

  // Register item exits
  async registerExit(ids, destino, facturaVenta) {
    const response = await fetch(`${URL}/inventario`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('AppInventarioToken')}`
      },
      credentials: "include",
      body: JSON.stringify({ids, destino, facturaVenta})
    });
    const newAccessToken = response.headers.get('Authorization');
    if (newAccessToken) localStorage.setItem("AppInventarioToken", newAccessToken);
    return response.json();
  },

  // // Update specific item details (PATCH)
  // async updateItem(id, updates) {
  //   const response = await apiClient.patch(
  //     `/inventario/${id}`,
  //     JSON.stringify(updates),
  //     { headers: { 'Content-Type': 'application/json' } }
  //   );
  //   return response.data;
  // },

  // // Delete an item permanently (DELETE)
  // async deleteItem(id) {
  //   const response = await apiClient.delete(
  //     `/inventario/${id}`,
  //     { headers: { 'Content-Type': 'application/json' } }
  //   );
  //   return response.data;
  // },
};

export default inventoryService