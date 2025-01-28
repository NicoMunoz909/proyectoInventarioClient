import { config } from "./apiClient";
const apiClient = "";
const URL = config.url;

const inventoryService = {

  // Fetch all inventory items
  async getAll(filters = {}, attributes=[]) {
    try {
      const queryParams = {
        ...filters,
        attributes
      }
      const queryString = new URLSearchParams(queryParams).toString();
      const response =  await fetch(`${URL}/inventario${queryString ? `?${queryString}` : ''}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      })
      return response.json();
    } catch (error) {
      return error
    }
  },

  // Register item exits
  async registerExit(ids, destino, facturaVenta) {
    const response = await fetch(`${URL}/inventario`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ids, destino, facturaVenta})
    });
    return response.json();
  },

  // Update specific item details (PATCH)
  async updateItem(id, updates) {
    const response = await apiClient.patch(
      `/inventario/${id}`,
      JSON.stringify(updates),
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  },

  // Delete an item permanently (DELETE)
  async deleteItem(id) {
    const response = await apiClient.delete(
      `/inventario/${id}`,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  },
};

export default inventoryService